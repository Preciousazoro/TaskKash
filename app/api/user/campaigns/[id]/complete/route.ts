import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import User from '@/models/User';
import { MongoClient, ObjectId } from 'mongodb';

// POST - Complete campaign and reward user
export async function POST(
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

    const campaignId = params.id;
    const body = await request.json();
    const { secondsElapsed, percentageWatched } = body;

    // Fetch campaign
    const campaign = await Campaign.findById(campaignId);
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

    // Verify completion based on campaign rules
    const isDuration = campaign.completionType.includes('duration');
    const required = isDuration ? (campaign.requiredDuration ?? 60) : (campaign.requiredPercentage ?? 80);
    const current = isDuration ? secondsElapsed : percentageWatched;
    const isComplete = current >= required;

    if (!isComplete) {
      return NextResponse.json(
        { error: 'Campaign requirements not met' },
        { status: 400 }
      );
    }

    // Check if user has already completed this campaign (prevent duplicate rewards)
    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    const db = mongoClient.db();

    const existingCompletion = await db.collection('campaign_completions').findOne({
      userId: new ObjectId(session.user.id),
      campaignId: new ObjectId(campaignId),
    });

    if (existingCompletion) {
      await mongoClient.close();
      return NextResponse.json(
        { error: 'Campaign already completed' },
        { status: 400 }
      );
    }

    // Record completion with full user progress data
    await db.collection('campaign_completions').insertOne({
      userId: new ObjectId(session.user.id),
      campaignId: new ObjectId(campaignId),
      secondsElapsed,
      percentageWatched,
      reward: campaign.reward,
      campaignTitle: campaign.title,
      campaignType: campaign.campaignType,
      platform: campaign.platform,
      creatorName: campaign.creatorName,
      completedAt: new Date(),
      status: 'completed',
    });

    // Update user's taskPoints
    const user = await User.findById(session.user.id);
    if (!user) {
      await mongoClient.close();
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.taskPoints = (user.taskPoints || 0) + campaign.reward;
    user.tasksCompleted = (user.tasksCompleted || 0) + 1;
    await user.save();

    await mongoClient.close();

    return NextResponse.json({
      success: true,
      reward: campaign.reward,
      newBalance: user.taskPoints,
      message: `You earned ${campaign.reward} task points!`,
    });
  } catch (error) {
    console.error('Error completing campaign:', error);
    return NextResponse.json(
      { error: 'Failed to complete campaign' },
      { status: 500 }
    );
  }
}
