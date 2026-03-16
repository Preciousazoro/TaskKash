import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailVerification from '@/models/EmailVerification';
import User from '@/models/User';
import { isValidOTPFormat, isOTPExpired } from '@/lib/otp';
import { createWelcomeBonus } from '@/lib/transactions';
import { AdminNotifications } from '@/lib/adminNotifications';
import { UserNotifications } from '@/lib/userNotifications';
import { getClientIP, otpVerifyRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode } = await request.json();

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = otpVerifyRateLimit(`${clientIP}:${email}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Validate input
    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    if (!isValidOTPFormat(otpCode)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find OTP verification record
    const verification = await EmailVerification.findOne({ email });
    if (!verification) {
      return NextResponse.json(
        { error: 'No verification request found for this email' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (isOTPExpired(verification.expiresAt)) {
      await EmailVerification.deleteOne({ email });
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 410 }
      );
    }

    // Check maximum attempts
    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({ email });
      return NextResponse.json(
        { error: 'Maximum verification attempts exceeded. Please request a new code.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (verification.otpCode !== otpCode) {
      // Increment attempts
      await EmailVerification.updateOne(
        { email },
        { $inc: { attempts: 1 } }
      );
      
      const remainingAttempts = 5 - (verification.attempts + 1);
      return NextResponse.json(
        { 
          error: 'Invalid verification code',
          remainingAttempts 
        },
        { status: 400 }
      );
    }

    // Check if user already exists (double check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await EmailVerification.deleteOne({ email });
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create the user account
    const user = await User.create({
      name: verification.name,
      email: verification.email,
      password: verification.password,
      username: verification.username,
      emailVerified: true,
    });

    // Create welcome bonus transaction
    try {
      await createWelcomeBonus(user._id.toString());
      
      // Create user notification for welcome bonus
      await UserNotifications.welcomeBonus(user._id.toString(), 100);
    } catch (error) {
      console.error('Error creating welcome bonus:', error);
      // Don't fail registration if bonus creation fails
    }

    // Create admin notification for new user registration (background)
    setTimeout(async () => {
      try {
        await AdminNotifications.userSignedUp(user._id.toString(), user.name, user.email);
      } catch (error) {
        console.error('Failed to create user registration notification:', error);
      }
    }, 0);

    // Delete verification record
    await EmailVerification.deleteOne({ email });

    return NextResponse.json(
      { 
        message: 'Email verified successfully. Account created!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          taskPoints: user.taskPoints,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
