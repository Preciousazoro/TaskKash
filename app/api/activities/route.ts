import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Activity from '@/models/Activity';
import TaskHistory from '@/models/TaskHistory';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const type = searchParams.get('type');
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

    // Build query
    const query: any = {};
    
    // Filter by activity type if specified
    if (type) {
      query.type = type;
    }
    
    // Filter by status if specified
    if (status) {
      query.status = status;
    }

    // Get user's email from session and find their activities
    const userId = session.user.id || session.user.email;
    
    // If we have email but not ID, we need to find the user first
    let userObjectId;
    if (typeof userId === 'string' && userId.includes('@')) {
      // This is an email, we need to find the user
      const User = mongoose.models.User;
      const user = await User.findOne({ email: userId }).select('_id');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userObjectId = user._id;
    } else if (userId) {
      userObjectId = new mongoose.Types.ObjectId(userId as string);
    } else {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 });
    }

    query.userId = userObjectId;

    // Get total count for pagination
    const total = await Activity.countDocuments(query);

    // Fetch activities with pagination
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // For each activity, try to resolve task details from both active tasks and archived tasks
    const formattedActivities = await Promise.all(activities.map(async (activity) => {
      let taskDetails = null;
      
      if (activity.taskId) {
        // First try to find the active task
        try {
          const Task = mongoose.models.Task;
          const activeTask = await Task.findById(activity.taskId)
            .select('title category rewardPoints')
            .lean() as any;
          
          if (activeTask) {
            taskDetails = {
              title: activeTask.title,
              category: activeTask.category,
              rewardPoints: activeTask.rewardPoints
            };
          } else {
            // If not found in active tasks, check archived tasks
            const TaskHistoryModel = TaskHistory as any;
            const archivedTask = await TaskHistoryModel.findByOriginalTaskId(activity.taskId);
            if (archivedTask) {
              taskDetails = {
                title: archivedTask.title,
                category: archivedTask.category,
                rewardPoints: archivedTask.rewardPoints
              };
            }
          }
        } catch (error) {
          console.error('Error resolving task details for activity:', activity._id, error);
        }
      }

      return {
        _id: activity._id,
        type: activity.type,
        status: activity.status,
        title: activity.title,
        description: activity.description,
        rewardPoints: activity.rewardPoints,
        taskDetails: taskDetails || {
          title: activity.metadata?.taskTitle || 'Archived Task',
          category: activity.metadata?.taskCategory,
          rewardPoints: activity.rewardPoints
        },
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      };
    }));

    return NextResponse.json({
      activities: formattedActivities,
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
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
