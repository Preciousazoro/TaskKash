import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

// GET - Fetch single campaign by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const campaign = await Campaign.findById(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if campaign is active
    if (campaign.status !== 'active') {
      return NextResponse.json(
        { error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    // Transform campaign to match the frontend interface
    const transformedCampaign = {
      id: campaign._id.toString(),
      title: campaign.title,
      description: campaign.description,
      creatorName: campaign.creatorName,
      creatorAvatar: campaign.creatorAvatar,
      platform: campaign.platform,
      campaignType: campaign.campaignType,
      mediaUrl: campaign.mediaUrl,
      embedUrl: campaign.embedUrl,
      thumbnailUrl: campaign.thumbnailUrl,
      reward: campaign.reward,
      completionType: campaign.completionType,
      requiredDuration: campaign.requiredDuration,
      requiredPercentage: campaign.requiredPercentage,
      allowSkipping: campaign.allowSkipping,
      totalDuration: campaign.totalDuration,
      coverArt: campaign.coverArt,
    };

    return NextResponse.json({
      success: true,
      campaign: transformedCampaign,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}
