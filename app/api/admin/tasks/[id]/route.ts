import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import TaskHistory from '@/models/TaskHistory';
import User from '@/models/User';
import { validateTaskData } from '@/lib/validation';
import { ArchiveReason } from '@/models/TaskHistory';

// PUT /api/admin/tasks/[id] - Update a task
export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user is admin - for development, allow any authenticated user
    // In production, uncomment the admin email check
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Temporary: Allow any authenticated user for development
    // In production, uncomment: if (user.email !== process.env.ADMIN_EMAIL) {
    console.log('Admin access granted to:', session.user.email);

    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      rewardPoints, 
      validationType, 
      instructions, 
      taskLink, 
      alternateUrl, 
      deadline, 
      status 
    } = body;

    // Validate all task data
    const validation = validateTaskData({
      title,
      description,
      category,
      rewardPoints,
      validationType,
      instructions,
      taskLink,
      alternateUrl: alternateUrl || '',
      deadline: deadline || '',
      status: status || 'active'
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Find and update the task
    const task = await Task.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        category,
        rewardPoints,
        validationType: validationType.trim(),
        instructions: instructions.trim(),
        taskLink: taskLink.trim(),
        alternateUrl: alternateUrl?.trim() || '',
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'active'
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(
      { 
        message: 'Task updated successfully',
        task 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating task:', error);
    
    // Handle specific error types
    if (error && typeof error === 'object' && 'name' in error) {
      const errorObj = error as any;
      
      if (errorObj.name === 'ValidationError') {
        console.error('Mongoose validation error:', errorObj.errors);
        return NextResponse.json(
          { error: 'Validation error', details: Object.values(errorObj.errors || {}).map((e: any) => e.message) },
          { status: 400 }
        );
      }
    }
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update task', details: error.message },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { error: 'Failed to update task', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tasks/[id] - Archive a task (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user is admin - for development, allow any authenticated user
    // In production, uncomment the admin email check
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Temporary: Allow any authenticated user for development
    // In production, uncomment: if (user.email !== process.env.ADMIN_EMAIL) {
    console.log('Admin access granted to:', session.user.email);

    const { id } = await params;

    // Find the task first
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if task is already archived
    const TaskHistoryModel = TaskHistory as any;
    const existingHistory = await TaskHistoryModel.findByOriginalTaskId(task._id);
    if (existingHistory) {
      return NextResponse.json({ error: 'Task is already archived' }, { status: 400 });
    }

    try {
      // Archive the task before deleting
      const retentionDays = parseInt(process.env.TASK_RETENTION_DAYS || '90');
      
      // Prepare task data with proper timestamps
      const taskData = {
        ...task.toObject(),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };
      
      await TaskHistoryModel.archiveTask(
        taskData,
        ArchiveReason.DELETED,
        retentionDays,
        user._id,
        'Deleted by admin via manage tasks'
      );

      // Now safely delete the original task
      await Task.findByIdAndDelete(id);

      console.log(`Task archived and deleted: ${task.title} (ID: ${task._id})`);

      return NextResponse.json(
        { 
          message: 'Task archived successfully',
          archivedTask: {
            title: task.title,
            archiveReason: 'deleted',
            retentionDays,
            deleteAfter: new Date(Date.now() + (retentionDays * 24 * 60 * 60 * 1000))
          }
        },
        { status: 200 }
      );
    } catch (archiveError) {
      console.error('Error archiving task:', archiveError);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to archive task. Task not deleted for safety.';
      if (archiveError instanceof Error) {
        if (archiveError.message.includes('required for archiving')) {
          errorMessage = `Archive failed: ${archiveError.message}`;
        } else if (archiveError.message.includes('duplicate key')) {
          errorMessage = 'Task is already archived';
        } else {
          errorMessage = `Archive failed: ${archiveError.message}`;
        }
      }
      
      // If archiving fails, don't delete the task
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error archiving task:', error);
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to archive task', details: error.message },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { error: 'Failed to archive task', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
