import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Transaction from '@/models/Transaction';
import Submission from '@/models/Submission';
import Activity from '@/models/Activity';
import { withTimeout, aggregateWithTimeout } from '@/lib/timeout';

// Simple in-memory cache for metrics (3 minutes TTL)
const metricsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const cached = metricsCache.get('dashboard-metrics');
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: cached.data
      });
    }

    // Connect to database
    await connectDB();

    // Get all metrics in parallel for better performance with timeouts
    const [
      totalUsers,
      tasksCompleted,
      pendingReviews,
      recentActivity
    ] = await Promise.all([
      // Total Users - Count all registered users
      withTimeout(User.countDocuments(), 3000),
      
      // Tasks Completed - Sum of tasksCompleted field across all users
      aggregateWithTimeout(User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$tasksCompleted' }
          }
        }
      ]), 5000),
      
      // Pending Reviews - Count pending submissions
      withTimeout(Submission.countDocuments({ status: 'pending' }), 3000),
      
      // Recent Activity - Count activities in last 24 hours
      withTimeout(Activity.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }), 3000)
    ]);

    // Extract values from aggregation results
    const totalTasksCompleted = tasksCompleted[0]?.total || 0;

    const metrics = {
      totalUsers,
      tasksCompleted: totalTasksCompleted,
      pendingReviews,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    metricsCache.set('dashboard-metrics', { data: metrics, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard metrics' 
      },
      { status: 500 }
    );
  }
}
