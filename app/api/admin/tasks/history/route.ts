import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskHistory from '@/models/TaskHistory';
import User from '@/models/User';
import { ArchiveReason } from '@/models/TaskHistory';

// GET /api/admin/tasks/history - Fetch archived tasks for admin panel
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      console.log('No session or email found:', session);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user is admin - for development, allow any authenticated user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    console.log('Admin access granted to:', session.user.email);
    
    // Get query parameters for filtering and search
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason');
    const retention = searchParams.get('retention');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter object
    const filter: any = {};

    // Archive reason filter
    if (reason && reason !== 'all') {
      filter.archiveReason = reason;
    }

    // Retention period filter
    if (retention && retention !== 'all') {
      const now = new Date();
      let deleteAfterFilter: any;

      switch (retention) {
        case '30days':
          deleteAfterFilter = { $lte: new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) };
          break;
        case '60days':
          deleteAfterFilter = { $lte: new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)) };
          break;
        case '90days':
          deleteAfterFilter = { $lte: new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)) };
          break;
        case 'expired':
          deleteAfterFilter = { $lte: now };
          break;
        default:
          break;
      }

      if (deleteAfterFilter) {
        filter.deleteAfter = deleteAfterFilter;
      }
    }

    // Search filter (title and description)
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Fetch archived tasks with filters and pagination
    const skip = (page - 1) * limit;
    
    const [totalTasks, tasks] = await Promise.all([
      TaskHistory.countDocuments(filter).lean().maxTimeMS(3000),
      TaskHistory.find(filter)
        .populate('createdBy', 'name email')
        .populate('archivedBy', 'name email')
        .sort({ archivedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .maxTimeMS(5000)
    ]);

    // Format tasks for frontend
    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      category: task.category,
      rewardPoints: task.rewardPoints,
      validationType: task.validationType,
      instructions: task.instructions,
      taskLink: task.taskLink,
      alternateUrl: task.alternateUrl,
      deadline: task.deadline,
      originalStatus: task.originalStatus,
      createdBy: (task as any).createdBy,
      originalCreatedAt: task.originalCreatedAt,
      originalUpdatedAt: task.originalUpdatedAt,
      archiveReason: task.archiveReason,
      archivedAt: task.archivedAt,
      retentionDays: task.retentionDays,
      deleteAfter: task.deleteAfter,
      archivedBy: (task as any).archivedBy,
      archiveNotes: task.archiveNotes,
      // Computed fields
      daysUntilDeletion: Math.ceil((new Date(task.deleteAfter).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      isExpired: new Date(task.deleteAfter) <= new Date()
    }));

    return NextResponse.json({ 
      tasks: formattedTasks, 
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        limit,
        hasNextPage: page < Math.ceil(totalTasks / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching task history:', error);
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch task history', details: error.message },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { error: 'Failed to fetch task history', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tasks/history - Manual cleanup or extend retention
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    const body = await request.json();
    const { action, taskIds, additionalDays, notes } = body;

    if (action === 'extend_retention' && taskIds?.length > 0 && additionalDays > 0) {
      // Extend retention for selected tasks
      const TaskHistoryModel = TaskHistory as any;
      const results = await Promise.allSettled(
        taskIds.map(async (taskId: string) => {
          const task = await TaskHistoryModel.findById(taskId);
          if (task) {
            await task.extendRetention(additionalDays);
            if (notes) {
              task.archiveNotes = (task.archiveNotes || '') + `\n[${new Date().toISOString()}] Retention extended by ${additionalDays} days by ${user.name || user.email}: ${notes}`;
              await task.save();
            }
            return { success: true, taskId, newDeleteAfter: task.deleteAfter };
          }
          return { success: false, taskId, error: 'Task not found' };
        })
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;

      return NextResponse.json({
        message: `Extended retention for ${successful} tasks`,
        successful,
        failed,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
      }, { status: 200 });
    }

    if (action === 'delete_permanently' && taskIds?.length > 0) {
      // Permanent deletion (admin override)
      const result = await TaskHistory.deleteMany({ _id: { $in: taskIds } });
      
      return NextResponse.json({
        message: `Permanently deleted ${result.deletedCount} archived tasks`,
        deletedCount: result.deletedCount
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: unknown) {
    console.error('Error in task history action:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to perform action', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to perform action', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
