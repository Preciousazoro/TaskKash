import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailVerification from '@/models/EmailVerification';
import User from '@/models/User';
import { generateOTP } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';
import { getClientIP, otpSendRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, username } = await request.json();

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = otpSendRateLimit(`${clientIP}:${email}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password should be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if there's an existing OTP for this email
    const existingVerification = await EmailVerification.findOne({ email });
    if (existingVerification) {
      // Check if we can resend (at least 60 seconds have passed)
      const timeSinceLastOTP = Date.now() - existingVerification.createdAt.getTime();
      if (timeSinceLastOTP < 60000) {
        return NextResponse.json(
          { error: 'Please wait before requesting another verification code' },
          { status: 429 }
        );
      }
      
      // Delete existing OTP to create a new one
      await EmailVerification.deleteOne({ email });
    }

    // Generate new OTP
    const otpCode = generateOTP();

    // Store OTP verification data
    await EmailVerification.create({
      email,
      otpCode,
      name,
      password,
      username,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, otpCode, name);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Verification code sent to your email',
        email: email
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
