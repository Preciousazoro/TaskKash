import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ success: true, users: [] });
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Search users by email or username, excluding current user
    // Match anywhere in the string (not just start)
    const users = await User.find({
      $and: [
        { _id: { $ne: session.user.id } },
        {
          $or: [
            { email: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
          ]
        },
        { status: 'active' }
      ]
    })
    .select('_id name email username avatarUrl')
    .limit(10);

    console.log('Search query:', query);
    console.log('Found users:', users.length);

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    }));

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to search users' }, { status: 500 });
  }
}
