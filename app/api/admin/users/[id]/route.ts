import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import Activity from '@/models/Activity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const user = await User.findById(id).select('-password').lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const transformedUser = {
      _id: (user as any)._id?.toString() || '',
      name: (user as any).name,
      email: (user as any).email,
      username: (user as any).username || null,
      avatarUrl: (user as any).avatarUrl || null,
      role: (user as any).role || 'user',
      status: (user as any).status || 'active',
      points: (user as any).taskPoints || 0,
      tasksCompleted: (user as any).tasksCompleted || 0,
      createdAt: (user as any).createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: (user as any).updatedAt?.toISOString() || new Date().toISOString(),
      socialLinks: (user as any).socialLinks || {}
    };

    return NextResponse.json(transformedUser);
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    console.log('Delete API - Session:', session);
    
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Delete API - Auth failed:', { session });
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    console.log('Delete API - Deleting user:', id);
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      console.log('Delete API - User not found:', id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Delete API - Found user:', user.email, 'Role:', user.role);

    // Prevent deletion of admin users (optional safety check)
    if (user.role === 'admin') {
      console.log('Delete API - Attempted to delete admin user');
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    console.log('Delete API - User deleted successfully');

    // Log the activity (with error handling)
    try {
      await Activity.create({
        userId: session.user.id,
        type: 'user_deleted',
        status: 'completed',
        title: 'User Deleted',
        description: `Admin deleted user: ${user.name} (${user.email})`,
        metadata: {
          deletedUserId: id,
          deletedUserName: user.name,
          deletedUserEmail: user.email
        }
      });
      console.log('Delete API - Activity logged successfully');
    } catch (activityError) {
      console.error('Delete API - Failed to log activity:', activityError);
      // Continue even if activity logging fails
    }

    console.log('Delete API - Returning success response');
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUserId: id
    });
    
  } catch (error) {
    console.error('Delete API - Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
