import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get total count of users - use lean() for better performance
    const totalUsers = await User.countDocuments().lean();
    
    // Get counts for each filter category
    const [adminCount, suspendedCount, activeCount] = await Promise.all([
      User.countDocuments({ role: 'admin' }).lean(),
      User.countDocuments({ status: 'suspended' }).lean(),
      User.countDocuments({ status: 'active' }).lean()
    ]);
    
    // Get all users with optimized query (no pagination)
    type LeanUser = { 
      _id: any;
      name: string;
      email: string;
      username?: string;
      avatarUrl?: string;
      role?: string;
      status?: string;
      taskPoints?: number;
      tasksCompleted?: number;
      createdAt: Date;
      updatedAt: Date;
      socialLinks?: any;
    };

    const users = await User.find({})
      .select('-password -passwordResetToken -passwordResetExpires') // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .lean<LeanUser[]>()
      .maxTimeMS(10000); // Add timeout to prevent hanging
    
    // Transform users to match expected format
    const transformedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username || null,
      avatarUrl: user.avatarUrl || null,
      role: user.role || 'user',
      status: user.status || 'active',
      points: user.taskPoints || 0,
      tasksCompleted: user.tasksCompleted || 0,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      socialLinks: user.socialLinks || {}
    }));
    
    return NextResponse.json({
      users: transformedUsers,
      filterCounts: {
        all: totalUsers,
        admins: adminCount,
        suspended: suspendedCount,
        active: activeCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
