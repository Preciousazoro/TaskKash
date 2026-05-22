import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Gift from '@/models/Gift';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const user = await User.findById(session.user.id).select('taskPoints');

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Calculate total sent amount
    const sentGifts = await Gift.find({
      senderId: session.user.id,
      status: 'completed'
    });
    
    const totalSent = sentGifts.reduce((sum, gift) => sum + gift.amount, 0);

    return NextResponse.json({
      success: true,
      balance: user.taskPoints,
      totalSent
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch balance' }, { status: 500 });
  }
}
