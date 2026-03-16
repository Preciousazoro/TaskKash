import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailVerification from '@/models/EmailVerification';
import { generateOTP } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';
import { getClientIP, otpResendRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = otpResendRateLimit(`${clientIP}:${email}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find existing verification
    const existingVerification = await EmailVerification.findOne({ email });
    if (!existingVerification) {
      return NextResponse.json(
        { error: 'No verification request found for this email' },
        { status: 404 }
      );
    }

    // Check if we can resend (at least 60 seconds have passed)
    const timeSinceLastOTP = Date.now() - existingVerification.createdAt.getTime();
    if (timeSinceLastOTP < 60000) {
      const remainingTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
      return NextResponse.json(
        { 
          error: 'Please wait before requesting another verification code',
          remainingTime 
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const newOtpCode = generateOTP();

    // Update existing record with new OTP and reset attempts
    await EmailVerification.updateOne(
      { email },
      {
        otpCode: newOtpCode,
        attempts: 0,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        createdAt: new Date(),
      }
    );

    // Send new verification email
    const emailSent = await sendVerificationEmail(email, newOtpCode, existingVerification.name);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'New verification code sent to your email',
        email: email
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
