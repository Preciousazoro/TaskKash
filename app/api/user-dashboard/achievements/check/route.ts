import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Achievement from '@/models/Achievement';
import { MongoClient, ObjectId } from 'mongodb';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements-config';

export async function POST(request: NextRequest) {
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

    // Get existing achievements
    const existingAchievements = await Achievement.find({ userId: session.user.id });
    const existingMap = new Map(existingAchievements.map(a => [a.achievementId, a]));

    // Check for new achievements to unlock
    const newAchievements: any[] = [];

    for (const [category, categoryAchievements] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      for (const achievementDef of categoryAchievements) {
        const existing = existingMap.get(achievementDef.id);

        // Skip if already unlocked
        if (existing && existing.unlocked) {
          continue;
        }

        // Check if should be unlocked
        let shouldUnlock = false;
        try {
          shouldUnlock = achievementDef.check({
            userData,
            withdrawalData,
            giftData,
            kycData: kyc,
            maxTaskPoints
          });
        } catch (error) {
          console.error(`Error checking achievement ${achievementDef.id}:`, error);
          shouldUnlock = false;
        }

        if (shouldUnlock) {
          // Create or update achievement record
          if (existing) {
            await Achievement.findByIdAndUpdate(existing._id, {
              unlocked: true,
              unlockedAt: new Date(),
              updatedAt: new Date()
            });
          } else {
            await Achievement.create({
              userId: session.user.id,
              achievementId: achievementDef.id,
              category,
              title: achievementDef.title,
              description: achievementDef.description,
              rarity: achievementDef.rarity,
              xp: achievementDef.xp,
              unlocked: true,
              unlockedAt: new Date()
            });
          }

          newAchievements.push({
            id: achievementDef.id,
            title: achievementDef.title,
            description: achievementDef.description,
            rarity: achievementDef.rarity,
            xp: achievementDef.xp
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      newAchievements,
      count: newAchievements.length
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json(
      { error: 'Failed to check achievements' },
      { status: 500 }
    );
  }
}
