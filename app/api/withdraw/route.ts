import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';

const TP_TO_USD_RATE = 0.0006;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate account balance (convert taskPoints to USD)
    const accountBalance = (user.taskPoints || 0) * TP_TO_USD_RATE;

    // Get crypto addresses from user profile (already in correct format)
    const cryptoAddresses = user.cryptoPayoutAddresses || [];

    // Get withdrawal history
    const withdrawals = await Withdrawal.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Format withdrawal history to match the expected structure
    const formattedWithdrawals = withdrawals.map((w: any) => ({
      id: w._id.toString(),
      amount: w.amount, // Show TP amount
      method: w.cryptoDetails?.network || 'CRYPTO',
      status: w.status,
      date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      destinationAddress: w.cryptoDetails?.walletAddress || '',
    }));

    return NextResponse.json({
      accountBalance,
      taskPoints: user.taskPoints || 0,
      cryptoAddresses,
      withdrawals: formattedWithdrawals,
    });
  } catch (error) {
    console.error('Error fetching withdraw data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, crypto, destinationAddress, otp } = body;

    // Validate required fields
    if (!amount || !crypto || !destinationAddress || !otp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (otp.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
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

    const user = await User.findById(session.user.id).select('+withdrawalOTP +otpExpiration');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify OTP
    console.log('OTP Verification:', {
      userId: session.user.id,
      providedOTP: otp,
      dbOTP: user.withdrawalOTP,
      dbExpiration: user.otpExpiration,
      currentTime: new Date(),
      isExpired: user.otpExpiration && new Date() > user.otpExpiration
    });

    if (!user.withdrawalOTP || user.withdrawalOTP !== otp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check OTP expiration
    if (user.otpExpiration && new Date() > user.otpExpiration) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Check user's balance (amount is in TP)
    if (user.taskPoints < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Convert TP to USD for storage
    const usdAmount = amount * TP_TO_USD_RATE;

    // Create withdrawal record
    const withdrawal = await Withdrawal.create({
      userId: session.user.id,
      amount: amount,
      convertedAmount: usdAmount,
      withdrawalType: 'crypto',
      cryptoDetails: {
        network: crypto.symbol,
        walletAddress: destinationAddress,
      },
      status: 'pending',
    });

    // Deduct points from user's balance
    await User.findByIdAndUpdate(
      session.user.id,
      { 
        $inc: { taskPoints: -amount },
        $unset: { withdrawalOTP: 1, otpExpiration: 1 }
      }
    );

    return NextResponse.json({
      success: true,
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.convertedAmount,
        status: withdrawal.status,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal' },
      { status: 500 }
    );
  }
}
