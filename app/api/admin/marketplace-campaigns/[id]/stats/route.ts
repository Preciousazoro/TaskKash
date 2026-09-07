import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';
import CampaignSubmission from '@/models/CampaignSubmission';

export const dynamic = 'force-dynamic';

// GET campaign statistics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    const adminCheck = await isAdmin();
    
    if (!session?.user?.email || !adminCheck) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const campaignId = params.id;
    await connectDB();

    // Get campaign details
    const campaign = await MarketplaceCampaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Count submissions by status
    const totalSubmissions = await CampaignSubmission.countDocuments({ campaignId });
    const approvedSubmissions = await CampaignSubmission.countDocuments({ 
      campaignId, 
      status: 'approved' 
    });
    const pendingSubmissions = await CampaignSubmission.countDocuments({ 
      campaignId, 
      status: 'pending' 
    });
    const rejectedSubmissions = await CampaignSubmission.countDocuments({ 
      campaignId, 
      status: 'rejected' 
    });

    // Calculate total rewards paid out
    const rewardsPaidOut = await CampaignSubmission.aggregate([
      { $match: { campaignId, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$rewardAmount' } } }
    ]);

    const totalRewardsPaid = rewardsPaidOut[0]?.total || 0;

    // Calculate progress percentages
    const participantsProgress = campaign.maxParticipants 
      ? (approvedSubmissions / campaign.maxParticipants) * 100 
      : 0;
    
    const poolProgress = campaign.rewardPool 
      ? (totalRewardsPaid / campaign.rewardPool) * 100 
      : 0;

    // Check if campaign is expired
    const isExpired = campaign.endsAt && new Date() > new Date(campaign.endsAt);

    // Determine campaign status
    let status = campaign.visibility;
    let statusReason = '';

    if (isExpired) {
      status = 'expired';
      statusReason = 'Campaign end date has passed';
    } else if (campaign.maxParticipants && approvedSubmissions >= campaign.maxParticipants) {
      status = 'max_participants_reached';
      statusReason = `Maximum participants (${campaign.maxParticipants}) reached`;
    } else if (campaign.rewardPool && totalRewardsPaid >= campaign.rewardPool) {
      status = 'reward_pool_reached';
      statusReason = `Reward pool (${campaign.rewardPool} TP) exhausted`;
    }

    return NextResponse.json({
      campaign: {
        id: campaign._id,
        name: campaign.name,
        brandName: campaign.brandName,
        visibility: campaign.visibility,
        status,
        statusReason,
        rewardAmount: campaign.rewardAmount,
        rewardPool: campaign.rewardPool,
        maxParticipants: campaign.maxParticipants,
        endsAt: campaign.endsAt
      },
      stats: {
        totalSubmissions,
        approvedSubmissions,
        pendingSubmissions,
        rejectedSubmissions,
        totalRewardsPaid,
        participantsProgress: Math.min(participantsProgress, 100),
        poolProgress: Math.min(poolProgress, 100),
        isExpired
      }
    });

  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}