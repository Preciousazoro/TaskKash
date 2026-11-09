import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailVerification from '@/models/EmailVerification';
import User from '@/models/User';
import { generateOTP } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';
import { getClientIP, otpSendRateLimit } from '@/lib/rateLimit';
import { createWelcomeBonus } from '@/lib/transactions';
import { AdminNotifications } from '@/lib/adminNotifications';
import { UserNotifications } from '@/lib/userNotifications';
import crypto from 'crypto';

// ⚠️ TEMPORARY BYPASS: email verification server is down.
// Set to false to re-enable OTP email verification.
const SKIP_EMAIL_VERIFICATION = true;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, username, referralToken } = await request.json();

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

    // ⚠️ TEMPORARY BYPASS: create account directly without email verification
    if (SKIP_EMAIL_VERIFICATION) {
      // Validate referral token if provided
      let referrerId: string | null = null;
      if (referralToken) {
        const referrer = await User.findOne({ referralToken });
        if (referrer) {
          referrerId = referrer._id.toString();
        }
      }

      // Generate referral token and link for new user
      let newUserReferralToken: string | null = null;
      let newUserReferralLink: string | null = null;

      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        newUserReferralToken = crypto.randomBytes(4).toString('hex').toLowerCase();
        const existingUser = await User.findOne({ referralToken: newUserReferralToken });

        if (!existingUser) {
          isUnique = true;
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taskkash.xyz';
          newUserReferralLink = `${baseUrl}/ref/${newUserReferralToken}`;
        }
        attempts++;
      }

      // Create the user account (marked as verified to allow login)
      const user = await User.create({
        name,
        email,
        password,
        username,
        emailVerified: true,
        referredBy: referrerId,
        referralToken: newUserReferralToken,
        referralLink: newUserReferralLink,
        referralStats: {
          totalInvites: 0,
          activeUsers: 0,
          pending: 0,
          qualified: 0,
          unlockedRewards: 0,
          pendingRewards: 0,
          qualifiedReferrals: []
        }
      });

      // Update referrer's stats if referral was valid
      if (referrerId) {
        try {
          await User.findByIdAndUpdate(
            referrerId,
            { $inc: { 'referralStats.totalInvites': 1, 'referralStats.pending': 1, 'referralStats.pendingRewards': 500 } },
            { new: true }
          );
        } catch (error) {
          console.error('Error updating referrer stats:', error);
        }
      }

      // Create welcome bonus transaction
      try {
        await createWelcomeBonus(user._id.toString());
        await UserNotifications.welcomeBonus(user._id.toString(), 100);
      } catch (error) {
        console.error('Error creating welcome bonus:', error);
      }

      // Create admin notification for new user registration (background)
      setTimeout(async () => {
        try {
          await AdminNotifications.userSignedUp(user._id.toString(), user.name, user.email);
        } catch (error) {
          console.error('Failed to create user registration notification:', error);
        }
      }, 0);

      return NextResponse.json(
        {
          message: 'Account created successfully',
          requiresVerification: false,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            taskPoints: user.taskPoints,
          }
        },
        { status: 201 }
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
      referralToken,
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
