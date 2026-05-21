import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import Task from '@/models/Task';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    console.log('Fetching stats for user:', session.user.id);

    // Calculate total withdrawn amount
    const withdrawals = await Withdrawal.find({ userId: session.user.id });
    const totalWithdrawn = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    console.log('Total withdrawals:', totalWithdrawn, 'Count:', withdrawals.length);

    // Count all active tasks (not filtered by user)
    const activeTasksCount = await Task.countDocuments({ status: 'active' });
    console.log('Active tasks count:', activeTasksCount);

    return NextResponse.json({
      totalWithdrawn,
      activeTasksCount
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
