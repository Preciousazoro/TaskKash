import User from '@/models/User';
import Submission from '@/models/Submission';

const REFERRAL_REWARD = 500; // XP reward per qualified referral
const QUALIFICATION_THRESHOLD = 10; // Tasks needed to qualify

export async function checkAndQualifyReferral(userId: string) {
  try {
    // Get the user who just completed a task
    const user = await User.findById(userId);
    if (!user || !user.referredBy) {
      return { qualified: false, reason: 'User not found or not referred' };
    }

    // Count approved submissions for this user
    const approvedTasksCount = await Submission.countDocuments({
      userId: userId,
      status: 'approved'
    });

    // Check if user has reached qualification threshold
    if (approvedTasksCount < QUALIFICATION_THRESHOLD) {
      return { qualified: false, reason: 'Not enough tasks completed', currentTasks: approvedTasksCount };
    }

    // Get the referrer
    const referrer = await User.findById(user.referredBy);
    if (!referrer) {
      return { qualified: false, reason: 'Referrer not found' };
    }

    // Check if this referral has already been qualified
    if (referrer.referralStats?.qualifiedReferrals?.includes(userId)) {
      return { qualified: false, reason: 'Already qualified' };
    }

    // Update referrer's stats - move 500 XP from pending to unlocked
    const updateResult = await User.findByIdAndUpdate(
      referrer._id,
      {
        $inc: {
          'referralStats.unlockedRewards': REFERRAL_REWARD,
          'referralStats.pendingRewards': -REFERRAL_REWARD,
          'referralStats.qualified': 1,
          'referralStats.activeUsers': 1,
          'referralStats.pending': -1,
          'taskPoints': REFERRAL_REWARD // Add to main taskPoints balance
        },
        $push: {
          'referralStats.qualifiedReferrals': userId
        }
      },
      { new: true }
    );

    if (!updateResult) {
      return { qualified: false, reason: 'Failed to update referrer' };
    }

    return {
      qualified: true,
      referrerId: referrer._id.toString(),
      reward: REFERRAL_REWARD,
      newUnlockedRewards: updateResult.referralStats?.unlockedRewards || 0,
      newTaskPoints: updateResult.taskPoints || 0
    };

  } catch (error) {
    console.error('Error in referral qualification:', error);
    return { qualified: false, reason: 'Server error' };
  }
}

export async function getReferralStatsForUser(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    // Get all users referred by this user
    const referredUsers = await User.find({ referredBy: userId });
    
    // Count active users (those with 10+ approved tasks)
    let activeUsersCount = 0;
    const qualifiedReferrals = user.referralStats?.qualifiedReferrals || [];
    
    for (const referredUser of referredUsers) {
      const approvedTasksCount = await Submission.countDocuments({
        userId: referredUser._id,
        status: 'approved'
      });
      
      if (approvedTasksCount >= QUALIFICATION_THRESHOLD) {
        activeUsersCount++;
      }
    }

    // Recalculate stats based on actual data
    const totalInvites = referredUsers.length;
    const pending = totalInvites - qualifiedReferrals.length;
    const qualified = qualifiedReferrals.length;
    const activeUsers = activeUsersCount;

    return {
      totalInvites,
      activeUsers,
      pending,
      qualified,
      unlockedRewards: user.referralStats?.unlockedRewards || 0,
      pendingRewards: user.referralStats?.pendingRewards || 0
    };

  } catch (error) {
    console.error('Error getting referral stats:', error);
    return null;
  }
}
