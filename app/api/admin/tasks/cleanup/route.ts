import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import TaskExpiryHandler from '@/lib/taskExpiryHandler';

// This endpoint should be called by a cron job for automated task management
// GET /api/admin/tasks/cleanup - Run task cleanup and expiry handling
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // For cron jobs, we might want to use a special API key instead of session
    // For now, we'll support both session auth and API key auth
    
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key');
    const includeDisabled = searchParams.get('include_disabled') === 'true';
    const expiredRetentionDays = parseInt(searchParams.get('expired_retention_days') || '90');
    const disabledRetentionDays = parseInt(searchParams.get('disabled_retention_days') || '90');

    let isAdmin = false;

    // Method 1: API Key authentication (for cron jobs)
    if (apiKey === process.env.CLEANUP_API_KEY) {
      isAdmin = true;
      console.log('Authenticated via API key for cleanup task');
    } 
    // Method 2: Session authentication (for manual runs)
    else {
      const session = await auth();
      if (session?.user?.email) {
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          // For development, allow any authenticated user
          // In production, you might want to check for admin role
          isAdmin = true;
          console.log(`Authenticated via session for cleanup task: ${session.user.email}`);
        }
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the full cleanup process
    const cleanupResult = await TaskExpiryHandler.runFullCleanup({
      expiredRetentionDays,
      disabledRetentionDays,
      includeDisabled
    });

    return NextResponse.json({
      success: true,
      message: 'Task cleanup completed successfully',
      results: {
        expiredTasks: cleanupResult.expiredTasks,
        disabledTasks: cleanupResult.disabledTasks,
        cleanupExpired: cleanupResult.cleanupExpired,
        totalErrors: cleanupResult.totalErrors.length,
        errors: cleanupResult.totalErrors
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error in cleanup task:', error);
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Cleanup task failed', 
          details: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { 
        error: 'Cleanup task failed', 
        details: 'An unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual cleanup triggers
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

    // Get options from request body
    const body = await request.json();
    const {
      includeDisabled = false,
      expiredRetentionDays = 90,
      disabledRetentionDays = 90
    } = body;

    // Run the cleanup process
    const cleanupResult = await TaskExpiryHandler.runFullCleanup({
      expiredRetentionDays,
      disabledRetentionDays,
      includeDisabled
    });

    return NextResponse.json({
      success: true,
      message: 'Manual task cleanup completed successfully',
      results: {
        expiredTasks: cleanupResult.expiredTasks,
        disabledTasks: cleanupResult.disabledTasks,
        cleanupExpired: cleanupResult.cleanupExpired,
        totalErrors: cleanupResult.totalErrors.length,
        errors: cleanupResult.totalErrors
      },
      triggeredBy: session.user.email,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error in manual cleanup task:', error);
    
    // Handle generic Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Manual cleanup task failed', 
          details: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Handle unknown error types
    return NextResponse.json(
      { 
        error: 'Manual cleanup task failed', 
        details: 'An unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
