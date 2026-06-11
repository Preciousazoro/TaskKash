import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Transaction from '@/models/Transaction';
import Submission from '@/models/Submission';
import Activity from '@/models/Activity';
import Withdrawal from '@/models/Withdrawal';
import Gift from '@/models/Gift';
import ContactMessage from '@/models/ContactMessage';
import Booking from '@/models/Booking';
import Broadcast from '@/models/Broadcast';
import AdminNotification from '@/models/AdminNotification';
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

    // Calculate weekly users (users registered this week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    // Get all metrics in parallel for better performance with timeouts
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalTasks,
      activeTasks,
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      totalWithdrawals,
      pendingWithdrawals,
      approvedWithdrawals,
      rejectedWithdrawals,
      totalGifts,
      completedGifts,
      pendingGifts,
      totalContactMessages,
      newContactMessages,
      respondedContactMessages,
      totalBookings,
      pendingBookings,
      contactedBookings,
      totalBroadcasts,
      totalAdminNotifications,
      unreadAdminNotifications,
      tasksCompletedAggregate,
      totalTaskPointsAggregate
    ] = await Promise.all([
      // User stats
      withTimeout(User.countDocuments(), 3000),
      withTimeout(User.countDocuments({ status: 'active' }), 3000),
      withTimeout(User.countDocuments({ status: 'suspended' }), 3000),
      
      // Task stats
      withTimeout(Task.countDocuments(), 3000),
      withTimeout(Task.countDocuments({ status: 'active' }), 3000),
      
      // Submission stats
      withTimeout(Submission.countDocuments(), 3000),
      withTimeout(Submission.countDocuments({ status: 'pending' }), 3000),
      withTimeout(Submission.countDocuments({ status: 'approved' }), 3000),
      withTimeout(Submission.countDocuments({ status: 'rejected' }), 3000),
      
      // Withdrawal stats
      withTimeout(Withdrawal.countDocuments(), 3000),
      withTimeout(Withdrawal.countDocuments({ status: 'pending' }), 3000),
      withTimeout(Withdrawal.countDocuments({ status: 'approved' }), 3000),
      withTimeout(Withdrawal.countDocuments({ status: 'rejected' }), 3000),
      
      // Gift stats
      withTimeout(Gift.countDocuments(), 3000),
      withTimeout(Gift.countDocuments({ status: 'completed' }), 3000),
      withTimeout(Gift.countDocuments({ status: 'pending' }), 3000),
      
      // Contact message stats
      withTimeout(ContactMessage.countDocuments(), 3000),
      withTimeout(ContactMessage.countDocuments({ status: 'new' }), 3000),
      withTimeout(ContactMessage.countDocuments({ status: 'responded' }), 3000),
      
      // Booking stats
      withTimeout(Booking.countDocuments(), 3000),
      withTimeout(Booking.countDocuments({ status: 'pending' }), 3000),
      withTimeout(Booking.countDocuments({ status: 'contacted' }), 3000),
      
      // Broadcast stats
      withTimeout(Broadcast.countDocuments(), 3000),
      
      // Admin notification stats
      withTimeout(AdminNotification.countDocuments(), 3000),
      withTimeout(AdminNotification.countDocuments({ isRead: false }), 3000),
      
      // Aggregated stats
      aggregateWithTimeout(User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$tasksCompleted' }
          }
        }
      ]), 5000),
      
      aggregateWithTimeout(User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$taskPoints' }
          }
        }
      ]), 5000)
    ]);

    // Extract values from aggregation results
    const totalTasksCompleted = tasksCompletedAggregate[0]?.total || 0;
    const totalTaskPoints = totalTaskPointsAggregate[0]?.total || 0;

    // Calculate total withdrawal amount (in USD)
    const totalWithdrawalAmount = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$convertedAmount' } } }
    ]).then(result => result[0]?.total || 0);

    // Calculate pending withdrawal amount
    const pendingWithdrawalAmount = await Withdrawal.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$convertedAmount' } } }
    ]).then(result => result[0]?.total || 0);

    // Get user growth data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format user growth data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowthLabels = [];
    const userGrowthValues = [];
    
    // Get the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      const monthNum = date.getMonth() + 1;
      
      userGrowthLabels.push(monthName);
      
      // Find the count for this month
      const monthData = userGrowthData.find(d => d._id.year === year && d._id.month === monthNum);
      userGrowthValues.push(monthData ? monthData.count : 0);
    }

    const stats = [
      { label: "Total Users", value: totalUsers, icon: "Users", color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Weekly Users", value: weeklyUsers, icon: "TrendingUp", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Active Users", value: activeUsers, icon: "UserCheck", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Suspended Users", value: suspendedUsers, icon: "UserMinus", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Total Tasks", value: totalTasks, icon: "Layers", color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Active Tasks", value: activeTasks, icon: "TrendingUp", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Tasks Completed", value: totalTasksCompleted, icon: "CheckCircle", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Total Submissions", value: totalSubmissions, icon: "FileText", color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Pending Reviews", value: pendingSubmissions, icon: "Clock", color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Approved Submissions", value: approvedSubmissions, icon: "CheckCircle", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Rejected Submissions", value: rejectedSubmissions, icon: "XCircle", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Total Withdrawals", value: totalWithdrawals, icon: "ArrowDownLeft", color: "text-primary", bg: "bg-primary/10" },
      { label: "Pending Withdrawals", value: pendingWithdrawals, icon: "ArrowUpRight", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Approved Withdrawals", value: approvedWithdrawals, icon: "CheckCircle", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Rejected Withdrawals", value: rejectedWithdrawals, icon: "XCircle", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Total Gifts", value: totalGifts, icon: "Gift", color: "text-pink-500", bg: "bg-pink-500/10" },
      { label: "Completed Gifts", value: completedGifts, icon: "Trophy", color: "text-yellow-500", bg: "bg-yellow-500/10" },
      { label: "Pending Gifts", value: pendingGifts, icon: "Clock", color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Contact Messages", value: totalContactMessages, icon: "MessageSquare", color: "text-cyan-500", bg: "bg-cyan-500/10" },
      { label: "New Messages", value: newContactMessages, icon: "Mail", color: "text-blue-500", bg: "bg-blue-500/10" },
    ];

    const metrics = {
      stats,
      totalUsers,
      tasksCompleted: totalTasksCompleted,
      pendingReviews: pendingSubmissions,
      rejectedSubmissions,
      totalWithdrawalAmount: `$${totalWithdrawalAmount.toFixed(2)}`,
      pendingWithdrawalAmount: `$${pendingWithdrawalAmount.toFixed(2)}`,
      totalTaskPoints,
      userGrowthLabels,
      userGrowthValues,
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
