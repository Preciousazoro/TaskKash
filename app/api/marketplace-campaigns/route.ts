import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';

// GET - Fetch published campaigns for user marketplace
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch only published campaigns
    const campaigns = await MarketplaceCampaign.find({ 
      visibility: 'published' 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error('Error fetching marketplace campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}