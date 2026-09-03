import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';

// GET - Test endpoint to fetch campaigns without auth
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    console.log('Test: Connected to DB');

    // Fetch all campaigns (not just published) for testing
    const allCampaigns = await MarketplaceCampaign.find({}).sort({ createdAt: -1 });
    console.log('Test: Found all campaigns:', allCampaigns.length);
    
    // Log the first campaign with all its details
    if (allCampaigns.length > 0) {
      console.log('Test: First campaign details:', JSON.stringify(allCampaigns[0], null, 2));
    }

    // Fetch only published campaigns
    const publishedCampaigns = await MarketplaceCampaign.find({ 
      visibility: 'published' 
    }).sort({ createdAt: -1 });
    console.log('Test: Found published campaigns:', publishedCampaigns.length);

    return NextResponse.json({ 
      allCampaignsCount: allCampaigns.length,
      publishedCampaignsCount: publishedCampaigns.length,
      allCampaigns,
      publishedCampaigns 
    }, { status: 200 });
  } catch (error) {
    console.error('Test: Error fetching marketplace campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}