import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import TaskExpiryHandler from '@/lib/taskExpiryHandler';

// GET /api/tasks - Return only active tasks for users
export const runtime = "nodejs";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Automatically update expired tasks before fetching
    try {
      await TaskExpiryHandler.handleExpiredTasks();
    } catch (error) {
      console.error('Error updating expired tasks:', error);
      // Continue with request even if expiry update fails
    }

    // Fetch only active tasks sorted by creation date
    const tasks = await Task.find({ 
      status: 'active',
      // Filter out tasks with expired deadlines
      $or: [
        { deadline: null },
        { deadline: { $gt: new Date() } }
      ]
    })
    .select('title description category rewardPoints validationType instructions taskLink alternateUrl deadline status createdAt updatedAt')
    .sort({ createdAt: -1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching active tasks:', error);
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: error.message },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
