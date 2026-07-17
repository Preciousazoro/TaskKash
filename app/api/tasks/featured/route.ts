import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import mongoose from 'mongoose';
import { withTimeout, aggregateWithTimeout } from '@/lib/timeout';

// GET /api/tasks/featured - Return 20 random active tasks for the user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Connect to database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Fetch all active tasks with timeout
    const tasks = await Task.find({ status: 'active' })
      .select('title description category rewardPoints validationType instructions taskLink alternateUrl deadline status createdAt updatedAt')
      .lean();

    // Fetch user's submissions for these tasks with timeout
    const submissions = aggregateWithTimeout(Submission.aggregate([
      {
        $match: {
          userId: userId
        }
      },
      {
        $sort: {
          submittedAt: -1
        }
      },
      {
        $group: {
          _id: '$taskId',
          latestSubmission: {
            $first: {
              id: '$_id',
              status: '$status',
              submittedAt: '$submittedAt',
              createdAt: '$createdAt'
            }
          }
        }
      }
    ]), 5000);

    const submissionData = await submissions;
    
    // Create a map of taskId to latest submission
    const submissionMap = new Map();
    submissionData.forEach((sub: any) => {
      submissionMap.set(sub._id.toString(), sub.latestSubmission);
    });

    // Combine tasks with submission data and derive userTaskStatus
    const tasksWithStatus = tasks.map(task => {
      const taskId = (task._id as mongoose.Types.ObjectId).toString();
      const latestSubmission = submissionMap.get(taskId);
      
      let userTaskStatus: 'pending' | 'approved' | 'rejected' | 'available';
      
      if (latestSubmission) {
        userTaskStatus = latestSubmission.status;
      } else {
        userTaskStatus = 'available';
      }

      return {
        ...task,
        latestSubmission: latestSubmission || null,
        userTaskStatus
      };
    });

    // Randomly select up to 20 tasks
    const shuffled = tasksWithStatus.sort(() => 0.5 - Math.random());
    const selectedTasks = shuffled.slice(0, 20);

    return NextResponse.json({ 
      tasks: selectedTasks
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching featured tasks:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
