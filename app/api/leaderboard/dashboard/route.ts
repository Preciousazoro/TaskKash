import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get limit parameter (default 20)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get top users sorted by tasksCompleted (for dashboard)
    const topTaskers = await User.find({})
      .select('username name email avatarUrl taskPoints tasksCompleted createdAt')
      .sort({ tasksCompleted: -1, taskPoints: -1, createdAt: 1 })
      .limit(limit)
      .lean();

    // Transform data for frontend
    const transformUser = (user: any, rank: number) => ({
      rank,
      username: user.username || user.name || `User${user._id.toString().slice(-6)}`,
      email: user.email || "",
      avatar: user.avatarUrl || null,
      taskPoints: user.taskPoints || 0,
      tasksCompleted: user.tasksCompleted || 0,
    });

    const leaderboard = topTaskers.map((user, index) => transformUser(user, index + 1));

    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
      }
    });

  } catch (error) {
    console.error('Dashboard leaderboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
