
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get count parameter (default to 4 users)
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '4');

    // Only fetch users with valid avatars
    const usersWithAvatarsCount = await User.countDocuments({
      avatarUrl: { $exists: true, $ne: null, $nin: [""] }
    });

    if (usersWithAvatarsCount === 0) {
      return NextResponse.json({
        success: true,
        users: []
      });
    }

    // Fetch random users with avatars
    const avatarCount = Math.min(count, usersWithAvatarsCount);
    const randomSkip = Math.floor(Math.random() * Math.max(0, usersWithAvatarsCount - avatarCount));

    const users = await User.find({
      avatarUrl: { $exists: true, $ne: null, $nin: [""] }
    })
      .select('name email avatarUrl taskPoints tasksCompleted username')
      .skip(randomSkip)
      .limit(avatarCount)
      .lean();

    // Transform user data for frontend
    const transformedUsers = users.map((user: any) => ({
      name: user.name || user.username || `User${user._id.toString().slice(-6)}`,
      email: user.email || "",
      avatarUrl: user.avatarUrl || null,
      taskPoints: user.taskPoints || 0,
      tasksCompleted: user.tasksCompleted || 0
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers
    });

  } catch (error) {
    console.error('Random users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch random users' },
      { status: 500 }
    );
  }
}
