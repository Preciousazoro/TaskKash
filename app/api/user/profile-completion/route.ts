import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { MongoClient, ObjectId } from 'mongodb';

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

    // Connect to MongoDB for KYC data
    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    const db = mongoClient.db();

    // Get KYC data - check if user has any approved KYC
    const approvedKyc = await db.collection('kyc')
      .findOne({ 
        userId: new ObjectId(session.user.id),
        status: 'approved'
      });

    console.log('Session user ID:', session.user.id);
    console.log('Querying for approved KYC with userId:', new ObjectId(session.user.id));
    console.log('Approved KYC found:', approvedKyc);

    await mongoClient.close();

    // Calculate completion
    const socialLinks = user.socialLinks || {};
    const completionData = {
      socialLinks: {
        twitter: !!socialLinks.twitter,
        linkedin: !!socialLinks.linkedin,
        whatsapp: !!socialLinks.whatsapp,
        telegram: !!socialLinks.telegram,
        instagram: !!socialLinks.instagram,
        facebook: !!socialLinks.facebook,
        tiktok: !!socialLinks.tiktok,
        discord: !!socialLinks.discord
      },
      profileSettings: {
        phone: !!user.phone,
        telegramUsername: !!user.telegramUsername,
        country: !!user.country || !!approvedKyc?.country
      },
      cryptoPayout: {
        solana: user.cryptoPayoutAddresses?.some((c: any) => c.crypto?.symbol === 'SOL'),
        btc: user.cryptoPayoutAddresses?.some((c: any) => c.crypto?.symbol === 'BTC'),
        ethereum: user.cryptoPayoutAddresses?.some((c: any) => c.crypto?.symbol === 'ETH'),
        tether: user.cryptoPayoutAddresses?.some((c: any) => c.crypto?.symbol === 'USDT'),
        usdCoin: user.cryptoPayoutAddresses?.some((c: any) => c.crypto?.symbol === 'USDC')
      },
      kyc: !!approvedKyc
    };

    // Calculate percentage
    const totalItems = 8 + 3 + 5 + 1; // 17 total items
    const completedItems = 
      Object.values(completionData.socialLinks).filter(Boolean).length +
      Object.values(completionData.profileSettings).filter(Boolean).length +
      Object.values(completionData.cryptoPayout).filter(Boolean).length +
      (completionData.kyc ? 1 : 0);

    const completionPercentage = Math.round((completedItems / totalItems) * 100);

    return NextResponse.json({
      success: true,
      completionData,
      completionPercentage,
      completedItems,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching profile completion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile completion' },
      { status: 500 }
    );
  }
}
