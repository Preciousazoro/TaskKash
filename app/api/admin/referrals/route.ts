import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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

      // Determine status based on tasks completed (you can adjust this logic)
      // For now: qualified if 10+ tasks, pending if less
      // TODO: Implement flagged status logic for suspicious accounts
      let status: "qualified" | "pending" = "pending";
      if (user.tasksCompleted >= 10) {
        status = "qualified";
      }

      // Calculate rewards (assuming 100 XP per referral when qualified)
      const rewardEarned = status === "qualified" ? 100 : 0;
      const pendingReward = status === "pending" ? 100 : 0;

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

    // Calculate overall stats
    const totalReferrals = users.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newReferrals = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;
    const qualified = referrals.filter(r => r.status === "qualified").length;
    const pending = referrals.filter(r => r.status === "pending").length;
    const flagged = 0; // TODO: Implement flagged user logic
    
    // Calculate active referred users (active in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeReferredUsers = users.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length;

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
