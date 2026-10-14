import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { PublicKey } from '@solana/web3.js';

export const dynamic = 'force-dynamic';

// Validate Solana public key
function isValidSolanaPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

// POST /api/user/wallet - Connect or update wallet
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { walletAddress, walletName } = body;

    if (!walletAddress || !walletName) {
      return NextResponse.json(
        { error: 'Wallet address and wallet name are required' },
        { status: 400 }
      );
    }

    // Validate Solana public key
    if (!isValidSolanaPublicKey(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if wallet is already associated with another user
    const existingUserWithWallet = await User.findOne({
      walletAddress: walletAddress,
      _id: { $ne: session.user.id }
    });

    if (existingUserWithWallet) {
      return NextResponse.json(
        { error: 'This wallet is already connected to another account' },
        { status: 409 }
      );
    }

    // Update user's wallet information
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        walletAddress: walletAddress,
        walletName: walletName,
        walletConnectedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('walletAddress walletName walletConnectedAt') as IUser | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      walletAddress: user.walletAddress,
      walletName: user.walletName,
      walletConnectedAt: user.walletConnectedAt
    });

  } catch (error) {
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/wallet - Disconnect wallet
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Remove wallet information from user
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $unset: {
          walletAddress: 1,
          walletName: 1,
          walletConnectedAt: 1
        }
      },
      { new: true }
    ).select('walletAddress walletName walletConnectedAt') as IUser | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect wallet' },
      { status: 500 }
    );
  }
}

// GET /api/user/wallet - Get current wallet status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select('walletAddress walletName walletConnectedAt')
      .lean() as IUser | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      walletAddress: user.walletAddress || null,
      walletName: user.walletName || null,
      walletConnectedAt: user.walletConnectedAt || null
    });

  } catch (error) {
    console.error('Error fetching wallet status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet status' },
      { status: 500 }
    );
  }
}
