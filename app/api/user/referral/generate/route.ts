import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import crypto from 'crypto';

// POST /api/user/referral/generate - Generate a unique referral link
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id) as IUser | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a referral token
    if (user.referralToken && user.referralLink) {
      return NextResponse.json({
        referralToken: user.referralToken,
        referralLink: user.referralLink,
        message: 'Referral link already exists'
      });
    }

    // Generate a unique referral token
    let referralToken: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate a random 8-character token
      referralToken = crypto.randomBytes(4).toString('hex').toLowerCase();
      
      // Check if this token already exists
      const existingUser = await User.findOne({ referralToken });
      
      if (!existingUser) {
        isUnique = true;
        
        // Generate the full referral link
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taskkash.xyz';
        const referralLink = `${baseUrl}/ref/${referralToken}`;
        
        // Update user with referral token and link using findOneAndUpdate for better compatibility
        const updatedUser = await User.findByIdAndUpdate(
          session.user.id,
          {
            $set: {
              referralToken: referralToken,
              referralLink: referralLink,
              referralStats: {
                totalInvites: 0,
                activeUsers: 0,
                pending: 0,
                qualified: 0,
                unlockedRewards: 0,
                pendingRewards: 0
              }
            }
          },
          { new: true, runValidators: false }
        );
        
        if (!updatedUser) {
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }
        
        return NextResponse.json({
          referralToken,
          referralLink,
          message: 'Referral link generated successfully'
        });
      }
      
      attempts++;
    }

    // If we couldn't generate a unique token after max attempts
    return NextResponse.json(
      { error: 'Failed to generate unique referral token' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error generating referral link:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral link' },
      { status: 500 }
    );
  }
}

// GET /api/user/referral/generate - Get existing referral link
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select('referralToken referralLink referralStats')
      .lean() as IUser | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      referralToken: user.referralToken || null,
      referralLink: user.referralLink || null,
      referralStats: user.referralStats || {
        totalInvites: 0,
        activeUsers: 0,
        pending: 0,
        qualified: 0,
        unlockedRewards: 0,
        pendingRewards: 0
      }
    });

  } catch (error) {
    console.error('Error fetching referral link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral link' },
      { status: 500 }
    );
  }
}
