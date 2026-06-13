import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { MongoClient, ObjectId } from 'mongodb';

// GET - Fetch all active campaigns for users
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
    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    const db = mongoClient.db();

    // Fetch active and completed campaigns (exclude draft and paused)
    const campaigns = await Campaign.find({ 
      status: { $in: ['active', 'completed'] } 
    }).sort({ createdAt: -1 });

    // Fetch user's campaign completions
    const completions = await db.collection('campaign_completions')
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    // Create a map of campaignId to completion data
    const completionMap = new Map();
    completions.forEach(comp => {
      completionMap.set(comp.campaignId.toString(), comp);
    });

    // Transform campaigns to match the frontend interface
    const transformedCampaigns = campaigns.map(campaign => {
      const completion = completionMap.get(campaign._id.toString());
      return {
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
        status: completion ? 'completed' : 'available',
        progress: completion?.percentageWatched || 0,
        secondsCompleted: completion?.secondsElapsed || 0,
      };
    });

    await mongoClient.close();

    return NextResponse.json({
      success: true,
      campaigns: transformedCampaigns,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
