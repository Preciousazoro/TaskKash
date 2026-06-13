import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Achievement from '@/models/Achievement';
import { MongoClient, ObjectId } from 'mongodb';
import { ACHIEVEMENT_DEFINITIONS, CATEGORY_CONFIG } from '@/lib/achievements-config';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Connect to MongoDB for additional data
    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    const db = mongoClient.db();

    // Get withdrawal data
    const withdrawals = await db.collection('withdrawals')
      .find({ userId: new ObjectId(session.user.id), status: 'approved' })
      .toArray();
    const withdrawalCount = withdrawals.length;
    const withdrawalTotalAmount = withdrawals.reduce((sum: number, w: any) => sum + (w.convertedAmount || 0), 0);

    // Get gift data
    const giftsReceived = await db.collection('gifts')
      .find({ receiverId: new ObjectId(session.user.id), status: 'completed' })
      .toArray();
    const giftsSent = await db.collection('gifts')
      .find({ senderId: new ObjectId(session.user.id), status: 'completed' })
      .toArray();
    const giftReceivedCount = giftsReceived.length;
    const giftSentCount = giftsSent.length;
    const maxSentAmount = giftsSent.length > 0 ? Math.max(...giftsSent.map((g: any) => g.amount || 0)) : 0;

    // Get KYC data
    const kyc = await db.collection('kyc')
      .findOne({ userId: new ObjectId(session.user.id) });

    // Get submission data for max task points
    const submissions = await db.collection('submissions')
      .find({ userId: new ObjectId(session.user.id), status: 'approved' })
      .toArray();
    const maxTaskPoints = submissions.length > 0 ? Math.max(...submissions.map((s: any) => s.awardedPoints || 0)) : 0;

    await mongoClient.close();

    // Prepare data for achievement checks
    const userData = {
      ...user.toObject(),
      cryptoPayoutAddresses: user.cryptoPayoutAddresses || []
    };

    const withdrawalData = {
      count: withdrawalCount,
      totalAmount: withdrawalTotalAmount
    };

    const giftData = {
      receivedCount: giftReceivedCount,
      sentCount: giftSentCount,
      maxSentAmount
    };

    // Get or create achievement records
    const existingAchievements = await Achievement.find({ userId: session.user.id });
    const existingMap = new Map(existingAchievements.map(a => [a.achievementId, a]));

    // Build achievements array
    const achievements: any[] = [];

    for (const [category, categoryAchievements] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      for (const achievementDef of categoryAchievements) {
        let unlocked = false;
        let unlockedAt: Date | undefined;

        // Check if already unlocked
        const existing = existingMap.get(achievementDef.id);
        if (existing && existing.unlocked) {
          unlocked = true;
          unlockedAt = existing.unlockedAt;
        } else {
          // Check if should be unlocked based on data
          try {
            unlocked = achievementDef.check({
              userData,
              withdrawalData,
              giftData,
              kycData: kyc,
              maxTaskPoints
            });
          } catch (error) {
            console.error(`Error checking achievement ${achievementDef.id}:`, error);
            unlocked = false;
          }
        }

        achievements.push({
          id: achievementDef.id,
          achievementId: achievementDef.id,
          category,
          title: achievementDef.title,
          description: achievementDef.description,
          rarity: achievementDef.rarity,
          xp: achievementDef.xp,
          unlocked,
          unlockedAt
        });
      }
    }

    // Get unlocked achievement IDs
    const achievementsUnlocked = achievements.filter(a => a.unlocked).map(a => a.achievementId);

    return NextResponse.json({
      success: true,
      achievements,
      achievementsUnlocked,
      categories: Object.keys(ACHIEVEMENT_DEFINITIONS)
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
