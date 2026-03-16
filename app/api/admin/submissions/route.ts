import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import Activity from '@/models/Activity';
import User from '@/models/User';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import mongoose from 'mongoose';
import { AdminNotifications } from '@/lib/adminNotifications';
import { UserNotifications } from '@/lib/userNotifications';
import { withTimeout, aggregateWithTimeout } from '@/lib/timeout';

// GET all submissions for admin
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

    // Connect to database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Build query for submissions
    const query: any = {};
    
    // Filter by status if specified
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    // Get total count for pagination
    const total = await Submission.countDocuments(query);

    // Fetch submissions with optimized aggregation instead of populate
    const submissions = aggregateWithTimeout(Submission.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
          pipeline: [
            { $project: { name: 1, email: 1, username: 1, avatarUrl: 1 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'taskId',
          pipeline: [
            { $project: { title: 1, description: 1, instructions: 1, rewardPoints: 1, category: 1 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'usertasks',
          localField: 'progressId',
          foreignField: '_id',
          as: 'progressId',
          pipeline: [
            { $project: { status: 1, startedAt: 1, submittedAt: 1, reviewedAt: 1 } }
          ]
        }
      },
      { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$taskId', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$progressId', preserveNullAndEmptyArrays: true } },
      { $limit: limit } // Final limit after joins
    ]), 10000); // 10 second timeout

    // Format submissions for frontend (handle aggregation results)
    const formattedSubmissions = (await submissions).map((submission: any) => ({
      _id: submission._id,
      userSnapshot: {
        _id: submission.userId?._id,
        name: submission.userId?.name || 'Unknown User',
        email: submission.userId?.email || 'unknown@example.com',
        username: submission.userId?.username,
        avatarUrl: submission.userId?.avatarUrl
      },
      taskSnapshot: {
        _id: submission.taskId,
        title: submission.taskId?.title || 'Unknown Task',
        description: submission.taskId?.description || '',
        instructions: submission.taskId?.instructions || '',
        rewardPoints: submission.taskId?.rewardPoints || 0,
        category: submission.taskId?.category || 'social'
      },
      status: submission.status,
      proofUrls: submission.proofUrls || [],
      proofLink: submission.proofLink || '',
      notes: submission.notes || '',
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt,
      rejectionReason: submission.rejectionReason,
      awardedPoints: submission.awardedPoints,
      progressId: submission.progressId
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
    console.error('Error fetching admin submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update submission status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    const adminCheck = await isAdmin();
    
    if (!session?.user?.email || !adminCheck) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, status, rejectionReason } = body;

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

    // Connect to database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find the submission with lean query
    const submission = await Submission.findById(submissionId)
      .lean()
      .maxTimeMS(5000);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if ((submission as any).status !== 'pending') {
      return NextResponse.json(
        { error: 'Submission has already been reviewed' },
        { status: 400 }
      );
    }

    // Get user and task data in parallel for better performance
    const [user, task] = await Promise.all([
      User.findById((submission as any).userId).select('name email taskPoints').lean().maxTimeMS(3000),
      Task.findById((submission as any).taskId).select('rewardPoints title category').lean().maxTimeMS(3000)
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update submission status with atomic operation
    await Submission.findByIdAndUpdate((submission as any)._id, {
      status: status.toLowerCase(),
      reviewedAt: new Date(),
      reviewedBy: new mongoose.Types.ObjectId(session.user.id),
      ...(status.toLowerCase() === 'rejected' && rejectionReason && { rejectionReason })
    }).maxTimeMS(5000);

    // If approved, award points to user
    let awardedPoints = 0;
    if (status.toLowerCase() === 'approved') {
      const rewardPoints = (task as any)?.rewardPoints || 0;
      
      if (rewardPoints > 0 && user) {
        // Update user's task points and tasks completed
        await User.findByIdAndUpdate((user as any)._id, {
          $inc: { 
            taskPoints: rewardPoints,
            tasksCompleted: 1
          }
        }).maxTimeMS(3000);

        // Update submission with awarded points
        await Submission.findByIdAndUpdate((submission as any)._id, {
          awardedPoints: rewardPoints
        }).maxTimeMS(3000);

        // Create approved activity record
        await withTimeout(Activity.create({
          userId: (user as any)._id,
          taskId: (submission as any).taskId,
          type: 'task_approved',
          status: 'completed',
          title: `Task Approved: ${(task as any)?.title}`,
          description: `You earned ${rewardPoints} TP!`,
          rewardPoints,
          metadata: {
            taskTitle: (task as any)?.title,
            taskCategory: (task as any)?.category,
            submissionId: (submission as any)._id
          }
        }), 3000);

        // Create admin notification for task approval
        try {
          await AdminNotifications.taskApproved(
            (submission as any)._id.toString(),
            (task as any)?.title,
            (user as any).name
          );
        } catch (error) {
          console.error('Failed to create task approval notification:', error);
          // Don't fail the request if notification fails
        }

        // Create user notification for task approval
        try {
          console.log('🔔 Creating approval notification for user:', (user as any)._id.toString());
          await UserNotifications.taskApproved(
            (user as any)._id.toString(),
            (task as any)?.title,
            rewardPoints
          );
          console.log('✅ Approval notification created successfully');
        } catch (error) {
          console.error('❌ Failed to create user task approval notification:', error);
          // Don't fail the request if notification fails
        }

        awardedPoints = rewardPoints;
      }
    } else if (status.toLowerCase() === 'rejected') {
      // Create rejected activity record
      await withTimeout(Activity.create({
        userId: (submission as any).userId,
        taskId: (submission as any).taskId,
        type: 'task_rejected',
        status: 'completed',
        title: `Task Rejected: ${(task as any)?.title}`,
        description: rejectionReason || 'Your submission was not approved',
        rewardPoints: 0,
        metadata: {
          taskTitle: (task as any)?.title,
          taskCategory: (task as any)?.category,
          rejectionReason,
          submissionId: (submission as any)._id
        }
      }), 3000);

      // Create admin notification for task rejection
      try {
        await AdminNotifications.taskRejected(
          (submission as any)._id.toString(),
          (task as any)?.title,
          (user as any).name
        );
      } catch (error) {
        console.error('Failed to create task rejection notification:', error);
        // Don't fail the request if notification fails
      }

      // Create user notification for task rejection
      try {
        console.log('🔔 Creating rejection notification for user:', (user as any)._id.toString());
        await UserNotifications.taskRejected(
          (user as any)._id.toString(),
          (task as any)?.title,
          rejectionReason
        );
        console.log('✅ Rejection notification created successfully');
      } catch (error) {
        console.error('❌ Failed to create user task rejection notification:', error);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Submission ${status.toLowerCase()} successfully`,
      awardedPoints,
      newStatus: (submission as any).status
    });

  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
