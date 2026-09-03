import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Submission from '@/models/Submission';
import { getReferralStatsForUser } from '@/lib/referralService';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Calculate overall referral stats
    const users = await User.find({ referredBy: { $ne: null } })
      .select('name email username referredBy createdAt tasksCompleted taskPoints referralStats')
      .lean();

    // Get referrer information for each referred user
    const referredUserIds = users.map(u => u._id.toString());
    const referrerIds = [...new Set(users.map(u => u.referredBy).filter(Boolean))];
    
    const referrers = await User.find({ 
      _id: { $in: referrerIds } 
    }).select('name username referralStats').lean();

    const referrerMap = new Map(
      referrers.map(r => [r._id.toString(), r])
    );

    // Build referral records
    const referrals = users.map(user => {
      const referrer = referrerMap.get(user.referredBy as string);
      const referrerName = referrer?.name || referrer?.username || 'Unknown';
      const referrerId = referrer?._id?.toString() || user.referredBy || 'Unknown';
      
      // Calculate days since join
      const joinedDate = new Date(user.createdAt);
      const today = new Date();
      const activeDays = Math.floor((today.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check if this user is qualified (in referrer's qualifiedReferrals array)
      const isQualified = referrer?.referralStats?.qualifiedReferrals?.includes(user._id.toString());
      
      // Determine status based on qualification
      let status: "qualified" | "pending" = "pending";
      if (isQualified) {
        status = "qualified";
      }

      // Calculate rewards (assuming 500 XP per referral when qualified)
      const rewardEarned = status === "qualified" ? 500 : 0;
      const pendingReward = status === "pending" ? 500 : 0;

      return {
        id: user._id.toString(),
        referrerId,
        referrerName,
        referredUserId: user._id.toString(),
        referredUserName: user.name || user.username || 'Unknown',
        referredUserEmail: user.email,
        status,
        joinedDate: joinedDate.toISOString().split('T')[0],
        activeDays,
        tasksCompleted: user.tasksCompleted,
        rewardEarned,
        pendingReward
      };
    });

    // Calculate overall stats using the referral service
    const totalReferrals = users.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newReferrals = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;
    const qualified = referrals.filter(r => r.status === "qualified").length;
    const pending = referrals.filter(r => r.status === "pending").length;
    const flagged = 0; // TODO: Implement flagged user logic
    
    // Calculate active referred users (those with 10+ approved tasks)
    let activeReferredUsers = 0;
    for (const user of users) {
      const approvedTasksCount = await Submission.countDocuments({
        userId: user._id,
        status: 'approved'
      });
      if (approvedTasksCount >= 10) {
        activeReferredUsers++;
      }
    }

    // Calculate rewards from all referrers
    let totalUnlockedRewards = 0;
    let totalPendingRewards = 0;
    
    referrers.forEach(referrer => {
      if (referrer.referralStats) {
        totalUnlockedRewards += referrer.referralStats.unlockedRewards || 0;
        totalPendingRewards += referrer.referralStats.pendingRewards || 0;
      }
    });

    const stats = {
      totalReferrals,
      newReferrals,
      qualified,
      pending,
      activeReferredUsers,
      unlockedRewards: totalUnlockedRewards,
      pendingRewards: totalPendingRewards,
      flagged
    };

    return NextResponse.json({
      stats,
      referrals: referrals.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()).slice(0, 50) // Return last 50 referrals
    });

  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}
