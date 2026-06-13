// Achievement definitions based on available database fields
export const ACHIEVEMENT_DEFINITIONS = {
  welcome: [
    {
      id: 'welcome-bonus',
      title: 'Welcome Bonus',
      description: 'Claimed your welcome bonus on first login',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.welcomeBonusGranted === true
    },
    {
      id: 'first-crypto-address',
      title: 'Crypto Starter',
      description: 'Connected my first crypto address',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.cryptoPayoutAddresses?.length >= 1
    },
    {
      id: '3-crypto-addresses',
      title: 'Crypto Enthusiast',
      description: 'Connected up to 3 crypto addresses',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.userData?.cryptoPayoutAddresses?.length >= 3
    },
    {
      id: '5-crypto-addresses',
      title: 'Crypto Master',
      description: 'Connected all the 5 crypto addresses',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.userData?.cryptoPayoutAddresses?.length >= 5
    },
    {
      id: 'verify-kyc',
      title: 'Verify KYC',
      description: 'Completed KYC verification with approved status',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.kycData?.status === 'approved'
    }
  ],
  withdrawals: [
    {
      id: 'first-withdrawal',
      title: 'First Cash Out',
      description: 'Completed your first withdrawal',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.count >= 1
    },
    {
      id: '3-withdrawals',
      title: 'Frequent Withdrawer',
      description: 'Completed up to 3 withdrawals',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.count >= 3
    },
    {
      id: 'withdraw-5',
      title: 'Pocket Money',
      description: 'Withdrew up to $5 in total',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.totalAmount >= 5
    },
    {
      id: 'withdraw-15',
      title: 'Half Thousand',
      description: 'Withdrew up to $15 in total',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.totalAmount >= 15
    },
    {
      id: 'withdraw-20',
      title: 'Grand Exit',
      description: 'Withdrew up to $20 in total',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.totalAmount >= 20
    },
    {
      id: 'withdraw-50',
      title: 'Big Liquidator',
      description: 'Withdrew up to $50 in total',
      rarity: 'legendary' as const,
      xp: 0,
      check: (data: any) => data.withdrawalData?.totalAmount >= 50
    }
  ],
  gifts: [
    {
      id: 'first-gift-received',
      title: 'First Gift',
      description: 'Received your first gift',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.giftData?.receivedCount >= 1
    },
    {
      id: '3-gifts-received',
      title: 'Gift Collector',
      description: 'Received up to 3 gifts',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.giftData?.receivedCount >= 3
    },
    {
      id: 'first-gift-sent',
      title: 'Generous Soul',
      description: 'Sent your first gift to someone',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.giftData?.sentCount >= 1
    },
    {
      id: '3-gifts-sent',
      title: 'Gift Giver',
      description: 'Sent up to 3 gifts',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.giftData?.sentCount >= 3
    },
    {
      id: 'gift-sent-10',
      title: 'Thoughtful',
      description: 'Sent a gift worth 10 TP',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 10
    },
    {
      id: 'gift-sent-30',
      title: 'Big Heart',
      description: 'Sent a gift worth 30 TP',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 30
    },
    {
      id: 'gift-sent-50',
      title: 'Benefactor',
      description: 'Sent a gift worth 50 TP',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 50
    },
    {
      id: 'gift-sent-100',
      title: 'Patron',
      description: 'Sent a gift worth 100 TP',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 100
    },
    {
      id: 'gift-sent-150',
      title: 'Grand Patron',
      description: 'Sent a gift worth 150 TP',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 150
    },
    {
      id: 'gift-sent-200',
      title: 'Legendary Giver',
      description: 'Sent a gift worth 200 TP',
      rarity: 'legendary' as const,
      xp: 0,
      check: (data: any) => data.giftData?.maxSentAmount >= 200
    }
  ],
  tasks: [
    {
      id: 'first-task',
      title: 'First Task',
      description: 'Completed your first task',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.tasksCompleted >= 1
    },
    {
      id: '10-tasks',
      title: 'Task Runner',
      description: 'Completed up to 10 tasks',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.tasksCompleted >= 10
    },
    {
      id: '50-tasks',
      title: 'Task Master',
      description: 'Completed up to 50 tasks',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.userData?.tasksCompleted >= 50
    },
    {
      id: '100-tasks',
      title: 'Task Legend',
      description: 'Completed up to 100 tasks',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.userData?.tasksCompleted >= 100
    },
    {
      id: '500-tasks',
      title: 'Task God',
      description: 'Completed up to 500 tasks',
      rarity: 'legendary' as const,
      xp: 0,
      check: (data: any) => data.userData?.tasksCompleted >= 500
    }
  ],
  taskPoints: [
    {
      id: 'task-points-50',
      title: 'Point Starter',
      description: 'Earned up to 50 TP from a task',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 50
    },
    {
      id: 'task-points-100',
      title: 'Point Collector',
      description: 'Earned up to 100 TP from a task',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 100
    },
    {
      id: 'task-points-200',
      title: 'Point Hunter',
      description: 'Earned up to 200 TP from a task',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 200
    },
    {
      id: 'task-points-300',
      title: 'Point Master',
      description: 'Earned up to 300 TP from a task',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 300
    },
    {
      id: 'task-points-500',
      title: 'Point Legend',
      description: 'Earned up to 500 TP from a task',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 500
    },
    {
      id: 'task-points-1000',
      title: 'Point God',
      description: 'Earned up to 1000 TP from a task',
      rarity: 'legendary' as const,
      xp: 0,
      check: (data: any) => data.maxTaskPoints >= 1000
    }
  ],
  points: [
    {
      id: '500-points',
      title: 'Point Starter',
      description: 'Earned 500 task points',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 500
    },
    {
      id: '1000-points',
      title: 'Point Collector',
      description: 'Earned 1,000 task points',
      rarity: 'common' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 1000
    },
    {
      id: '2000-points',
      title: 'Point Hunter',
      description: 'Earned 2,000 task points',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 2000
    },
    {
      id: '3000-points',
      title: 'Point Master',
      description: 'Earned 3,000 task points',
      rarity: 'rare' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 3000
    },
    {
      id: '3500-points',
      title: 'Point Expert',
      description: 'Earned 3,500 task points',
      rarity: 'epic' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 3500
    },
    {
      id: '5000-points',
      title: 'Point Legend',
      description: 'Earned 5,000 task points',
      rarity: 'legendary' as const,
      xp: 0,
      check: (data: any) => data.userData?.taskPoints >= 5000
    }
  ]
};

export const CATEGORY_CONFIG = {
  welcome: {
    iconBg: "bg-gradient-to-br from-indigo-600/20 to-indigo-400/10",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/30",
    label: "Welcome"
  },
  withdrawals: {
    iconBg: "bg-gradient-to-br from-orange-600/20 to-orange-400/10",
    iconColor: "text-orange-400",
    border: "border-orange-500/30",
    label: "Withdrawals"
  },
  gifts: {
    iconBg: "bg-gradient-to-br from-pink-600/20 to-pink-400/10",
    iconColor: "text-pink-400",
    border: "border-pink-500/30",
    label: "Gifts"
  },
  tasks: {
    iconBg: "bg-gradient-to-br from-green-600/20 to-green-400/10",
    iconColor: "text-green-400",
    border: "border-green-500/30",
    label: "Tasks"
  },
  taskPoints: {
    iconBg: "bg-gradient-to-br from-teal-600/20 to-teal-400/10",
    iconColor: "text-teal-400",
    border: "border-teal-500/30",
    label: "Task Points"
  },
  points: {
    iconBg: "bg-gradient-to-br from-violet-600/20 to-violet-400/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/30",
    label: "Points"
  }
};
