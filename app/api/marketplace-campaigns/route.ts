import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';

// GET - Fetch published campaigns for user marketplace
export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for debugging
    // const session = await auth();
    // 
    // console.log('Session:', session);
    // 
    // if (!session?.user) {
    //   console.log('Unauthorized - no session');
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    console.log('Connected to DB');

    // Fetch only published campaigns
    const campaigns = await MarketplaceCampaign.find({ 
      visibility: 'published' 
    }).sort({ createdAt: -1 });

    console.log('Found campaigns:', campaigns.length, campaigns);

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error('Error fetching marketplace campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}