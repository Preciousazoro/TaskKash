import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';
import CampaignSubmission from '@/models/CampaignSubmission';

// POST - Submit task proof for a campaign
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId, submissionData } = body;

    if (!campaignId || !submissionData) {
      return NextResponse.json(
        { error: 'Campaign ID and submission data are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if campaign exists and is published
    const campaign = await MarketplaceCampaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.visibility !== 'published') {
      return NextResponse.json({ error: 'Campaign is not available' }, { status: 400 });
    }

    console.log('Campaign reward amount:', campaign.rewardAmount);

    // Check if user has already submitted for this campaign
    const existingSubmission = await CampaignSubmission.findOne({
      campaignId,
      userId: session.user.id
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted proof for this campaign' },
        { status: 400 }
      );
    }

    // Create new submission with reward amount
    const newSubmission = {
      campaignId,
      userId: session.user.id,
      submissionData,
      rewardAmount: campaign.rewardAmount,
      status: 'pending'
    };
    
    console.log('Creating submission with data:', newSubmission);
    
    const submission = await CampaignSubmission.create(newSubmission);
    
    console.log('Created submission:', submission);

    return NextResponse.json(
      { 
        message: 'Proof submitted successfully',
        submissionId: submission._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting campaign proof:', error);
    return NextResponse.json(
      { error: 'Failed to submit proof' },
      { status: 500 }
    );
  }
}