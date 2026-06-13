import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

// GET - Fetch campaign stats for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch stats
    const totalMusic = await Campaign.countDocuments({ campaignType: 'music' });
    const totalVideo = await Campaign.countDocuments({ campaignType: 'video' });
    const active = await Campaign.countDocuments({ status: 'active' });
    const completed = await Campaign.countDocuments({ status: 'completed' });

    return NextResponse.json({
      success: true,
      stats: {
        totalMusic,
        totalVideo,
        active,
        completed,
      },
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign stats' },
      { status: 500 }
    );
  }
}
