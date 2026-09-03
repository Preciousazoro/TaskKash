import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import CampaignSubmission from '@/models/CampaignSubmission';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';
import User from '@/models/User';
import Activity from '@/models/Activity';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET all marketplace campaign submissions for admin
export async function GET(request: NextRequest) {
  try {
    // Check authentication - should be admin
    const session = await auth();
    const adminCheck = await isAdmin();
    
    if (!session?.user?.email || !adminCheck) {
      console.log('Admin auth failed:', { session: !!session, adminCheck });
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query for submissions
    const query: any = {};
    
    // Filter by status if specified
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Get total count for pagination
    const total = await CampaignSubmission.countDocuments(query);

    // Fetch submissions with campaign and user data
    const submissions = await CampaignSubmission.find(query)
      .populate('userId', 'name email username avatarUrl')
      .populate('campaignId', 'name brandName brandLogo rewardAmount category type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Format submissions for frontend
    const formattedSubmissions = submissions.map((submission: any) => ({
      _id: submission._id,
      user: {
        _id: submission.userId?._id,
        name: submission.userId?.name || 'Unknown User',
        email: submission.userId?.email || 'unknown@example.com',
        username: submission.userId?.username,
        avatarUrl: submission.userId?.avatarUrl
      },
      campaign: {
        _id: submission.campaignId?._id,
        name: submission.campaignId?.name || 'Unknown Campaign',
        brandName: submission.campaignId?.brandName || 'Unknown Brand',
        brandLogo: submission.campaignId?.brandLogo,
        rewardAmount: submission.rewardAmount || submission.campaignId?.rewardAmount || 0,
        category: submission.campaignId?.category || 'general',
        type: submission.campaignId?.type || 'social'
      },
      submissionData: submission.submissionData,
      rewardAmount: submission.rewardAmount,
      status: submission.status,
      reviewedBy: submission.reviewedBy,
      reviewNotes: submission.reviewNotes,
      reviewedAt: submission.reviewedAt,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt
    }));

    return NextResponse.json({
      submissions: formattedSubmissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching marketplace submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update campaign submission status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    const adminCheck = await isAdmin();
    
    if (!session?.user?.email || !adminCheck) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, status, reviewNotes } = body;

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: submissionId, status' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the submission
    const submission = await CampaignSubmission.findById(submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.status !== 'pending') {
      return NextResponse.json(
        { error: 'Submission has already been reviewed' },
        { status: 400 }
      );
    }

    // Get user and campaign data
    const [user, campaign] = await Promise.all([
      User.findById(submission.userId).select('name email taskPoints'),
      MarketplaceCampaign.findById(submission.campaignId).select('name brandName rewardAmount category')
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update submission status
    submission.status = status.toLowerCase();
    submission.reviewedBy = new mongoose.Types.ObjectId(session.user.id);
    submission.reviewNotes = reviewNotes || '';
    submission.reviewedAt = new Date();
    await submission.save();

    // If approved, award points to user
    let awardedPoints = 0;
    if (status.toLowerCase() === 'approved') {
      const rewardPoints = submission.rewardAmount || 0;
      
      if (rewardPoints > 0) {
        // Update user's task points
        await User.findByIdAndUpdate(user._id, {
          $inc: { 
            taskPoints: rewardPoints,
            tasksCompleted: 1
          }
        });

        // Create approved activity record
        await Activity.create({
          userId: user._id,
          type: 'task_approved',
          status: 'completed',
          title: `Campaign Approved: ${campaign?.name || 'Unknown Campaign'}`,
          description: `You earned ${rewardPoints} TP!`,
          rewardPoints,
          metadata: {
            campaignName: campaign?.name,
            brandName: campaign?.brandName,
            category: campaign?.category,
            submissionId: submission._id
          }
        });

        awardedPoints = rewardPoints;
      }
    } else if (status.toLowerCase() === 'rejected') {
      // Create rejected activity record
      await Activity.create({
        userId: user._id,
        type: 'task_rejected',
        status: 'completed',
        title: `Campaign Rejected: ${campaign?.name || 'Unknown Campaign'}`,
        description: reviewNotes || 'Your submission was not approved',
        rewardPoints: 0,
        metadata: {
          campaignName: campaign?.name,
          brandName: campaign?.brandName,
          category: campaign?.category,
          reviewNotes,
          submissionId: submission._id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Submission ${status.toLowerCase()} successfully`,
      awardedPoints,
      newStatus: submission.status
    });

  } catch (error) {
    console.error('Error updating marketplace submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
