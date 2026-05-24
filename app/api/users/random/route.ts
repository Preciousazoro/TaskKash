
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get count parameter (default to 4 users)
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '4');

    // Count users with and without avatars
    const usersWithAvatarsCount = await User.countDocuments({
      avatarUrl: { $exists: true, $ne: null, $nin: [""] }
    });
    const usersWithoutAvatarsCount = await User.countDocuments({ 
      $or: [
        { avatarUrl: { $exists: false } },
        { avatarUrl: null },
        { avatarUrl: "" }
      ]
    });

    if (usersWithAvatarsCount === 0 && usersWithoutAvatarsCount === 0) {
      return NextResponse.json({
        success: true,
        users: []
      });
    }

    let users: any[] = [];
    let remainingCount = count;

    // First, try to get users with avatars
    if (usersWithAvatarsCount > 0) {
      const avatarCount = Math.min(remainingCount, usersWithAvatarsCount);
      const randomSkip = Math.floor(Math.random() * Math.max(0, usersWithAvatarsCount - avatarCount));
      
      const usersWithAvatars = await User.find({
        avatarUrl: { $exists: true, $ne: null, $nin: [""] }
      })
        .select('name email avatarUrl taskPoints tasksCompleted username')
        .skip(randomSkip)
        .limit(avatarCount)
        .lean();
      
      users = usersWithAvatars;
      remainingCount -= usersWithAvatars.length;
    }

    // If we still need more users, fetch users without avatars
    if (remainingCount > 0 && usersWithoutAvatarsCount > 0) {
      const randomSkip = Math.floor(Math.random() * Math.max(0, usersWithoutAvatarsCount - remainingCount));
      
      const usersWithoutAvatars = await User.find({ 
        $or: [
          { avatarUrl: { $exists: false } },
          { avatarUrl: null },
          { avatarUrl: "" }
        ]
      })
        .select('name email avatarUrl taskPoints tasksCompleted username')
        .skip(randomSkip)
        .limit(remainingCount)
        .lean();
      
      users = [...users, ...usersWithoutAvatars];
    }

    // Shuffle the combined array to mix users with and without avatars
    users = users.sort(() => Math.random() - 0.5);

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
