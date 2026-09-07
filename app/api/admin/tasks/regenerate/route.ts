import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

async function generateTaskUrl(): Promise<string> {
  try {
    // Find the highest existing task number
    const lastTask = await Task.findOne({ taskurl: /^task\d+$/ })
      .sort({ taskurl: -1 })
      .select('taskurl')
      .lean() as any;
    
    let nextNumber = 1;
    if (lastTask && lastTask.taskurl) {
      const match = lastTask.taskurl.match(/task(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    return `task${nextNumber}`;
  } catch (error) {
    console.error('Error generating task URL:', error);
    // Fallback to timestamp-based if there's an error
    return `task${Date.now()}`;
  }
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Find all tasks that don't have a taskurl or have old format taskurls
    const tasksWithoutUrl = await Task.find({ 
      $or: [
        { taskurl: { $exists: false } },
        { taskurl: null },
        { taskurl: '' },
        { taskurl: { $not: /^task\d+$/ } } // Tasks with old format URLs
      ]
    });

    console.log(`Found ${tasksWithoutUrl.length} tasks without taskurl`);

    // Generate taskurl for each task sequentially to ensure unique numbers
    for (const task of tasksWithoutUrl) {
      const newTaskUrl = await generateTaskUrl();
      task.taskurl = newTaskUrl;
      await task.save();
      console.log(`Generated taskurl ${newTaskUrl} for task: ${task.title}`);
    }

    return NextResponse.json(
      { 
        message: `Successfully generated task URLs for ${tasksWithoutUrl.length} tasks (including old format URLs)`,
        updatedCount: tasksWithoutUrl.length
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error regenerating task URLs:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to regenerate task URLs', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to regenerate task URLs', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}