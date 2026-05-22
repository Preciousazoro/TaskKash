import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';

// Generate a random 4-digit OTP
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, crypto, destinationAddress } = body;

    // Validate required fields
    if (!amount || !crypto || !destinationAddress) {
      return NextResponse.json(
        { error: 'Amount, crypto, and destination address are required' },
        { status: 400 }
      );
    }

    // Validate minimum withdrawal amount (amount is in TP)
    if (amount < 500) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is 500 TP' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check user's balance (amount is in TP)
    if (user.taskPoints < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Convert TP to USD for email display
    const TP_TO_USD_RATE = 0.0006;
    const usdAmount = amount * TP_TO_USD_RATE;

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in user document (with expiration)
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        withdrawalOTP: otp,
        otpExpiration,
      },
      { new: true, select: '+withdrawalOTP +otpExpiration' } // Return the updated document with OTP fields
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to store OTP' },
        { status: 500 }
      );
    }

    console.log('OTP stored in DB:', {
      userId: session.user.id,
      otp: otp,
      expiration: otpExpiration,
      dbOtp: updatedUser.withdrawalOTP,
      dbExpiration: updatedUser.otpExpiration
    });

    // Send OTP email using the email library
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">TaskKash</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Secure Withdrawal</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-top: 0;">Your One-Time Password (OTP)</h2>
          <p style="color: #666; line-height: 1.6;">You requested to withdraw <strong>${amount} TP</strong> (≈ $${usdAmount.toFixed(2)}) to your ${crypto.name} wallet.</p>
          <p style="color: #666; line-height: 1.6;">Use the following OTP to complete your withdrawal:</p>
          <div style="background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            This OTP will expire in 10 minutes. If you didn't request this withdrawal, please ignore this email.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 12px;">Withdrawal Details:</p>
            <p style="color: #666; font-size: 12px;">Amount: ${amount} TP (≈ $${usdAmount.toFixed(2)})</p>
            <p style="color: #666; font-size: 12px;">Currency: ${crypto.name} (${crypto.symbol})</p>
            <p style="color: #666; font-size: 12px;">Destination: ${destinationAddress.substring(0, 10)}...${destinationAddress.substring(destinationAddress.length - 6)}</p>
          </div>
        </div>
      </div>
    `;

    const emailSent = await sendEmail({
      to: user.email,
      subject: 'Your Withdrawal OTP - TaskKash',
      html: emailHtml,
      from: 'NOREPLY',
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
