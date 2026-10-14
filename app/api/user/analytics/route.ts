import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import Submission from '@/models/Submission';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find the user
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all approved submissions for this user with task details
    const approvedSubmissions = await Submission.find({
      userId: user._id,
      status: 'approved',
      awardedPoints: { $gt: 0 }
    })
      .populate('taskId', 'category')
      .sort({ reviewedAt: 1 })
      .lean();

    // Build earnings data grouped by date (last 30 days)
    const earningsByDate = new Map<string, number>();
    const now = new Date();
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      earningsByDate.set(dateKey, 0);
    }

    // Aggregate earnings by date
    approvedSubmissions.forEach((submission: any) => {
      if (submission.reviewedAt) {
        const dateKey = new Date(submission.reviewedAt).toISOString().split('T')[0];
        const current = earningsByDate.get(dateKey) || 0;
        earningsByDate.set(dateKey, current + (submission.awardedPoints || 0));
      }
    });

    // Convert to array format
    const points = Array.from(earningsByDate.entries()).map(([date, value]) => ({
      date,
      value
    }));

    // Calculate total earnings
    const total = user.taskPoints || 0;

    // Calculate change percentage (compare last 7 days to previous 7 days)
    const pointsArray = points.map(p => p.value);
    const last7Days = pointsArray.slice(-7).reduce((a, b) => a + b, 0);
    const previous7Days = pointsArray.slice(-14, -7).reduce((a, b) => a + b, 0);
    const changePct = previous7Days > 0 
      ? ((last7Days - previous7Days) / previous7Days) * 100 
      : (last7Days > 0 ? 100 : 0);

    // Build breakdown by category
    const breakdownByCategory = new Map<string, number>();
    approvedSubmissions.forEach((submission: any) => {
      const task = submission.taskId as any;
      const category = task?.category || 'Other';
      const points = submission.awardedPoints || 0;
      const current = breakdownByCategory.get(category) || 0;
      breakdownByCategory.set(category.charAt(0).toUpperCase() + category.slice(1), current + points);
    });

    // Add referral bonus if available
    if (user.referralStats && user.referralStats.unlockedRewards > 0) {
      const current = breakdownByCategory.get('Referral Bonus') || 0;
      breakdownByCategory.set('Referral Bonus', current + user.referralStats.unlockedRewards);
    }

    const breakdown = Array.from(breakdownByCategory.entries()).map(([label, value]) => ({
      label,
      value
    }));

    // Fetch top earners from leaderboard (reuse existing logic)
    const topEarners = await User.find({})
      .select('username name email avatarUrl taskPoints tasksCompleted')
      .sort({ taskPoints: -1, tasksCompleted: -1, createdAt: 1 })
      .limit(4)
      .lean();

    const transformedEarners = topEarners.map((earner: any) => ({
      id: earner._id.toString(),
      name: earner.username || earner.name || `User${earner._id.toString().slice(-6)}`,
      email: earner.email || null,
      avatar: earner.avatarUrl || null,
      points: earner.taskPoints || 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        earnings: {
          points,
          total,
          changePct: parseFloat(changePct.toFixed(1)),
          breakdown
        },
        topEarners: transformedEarners
      }
    });

  } catch (error) {
    console.error('User analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
