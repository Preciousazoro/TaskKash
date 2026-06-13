import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const kycCollection = db.collection('kyc');
    const userCollection = db.collection('users');

    // Fetch all KYC submissions with user profile data
    const kycSubmissions = await kycCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with user profile data
    const enrichedSubmissions = await Promise.all(
      kycSubmissions.map(async (kyc: any) => {
        // Convert userId to ObjectId for query
        const userId = typeof kyc.userId === 'string' ? new ObjectId(kyc.userId) : kyc.userId;
        const user = await userCollection.findOne({ _id: userId });

        console.log('KYC Admin - User lookup:', {
          kycUserId: kyc.userId,
          userId,
          userFound: !!user,
          userData: user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null
        });

        return {
          ...kyc,
          _id: kyc._id.toString(),
          userId: kyc.userId.toString(),
          userProfile: {
            _id: user?._id?.toString() || '',
            username: user?.name || 'Unknown',
            email: user?.email || 'Unknown',
            profileImage: user?.avatarUrl || 'https://github.com/shadcn.png',
            fullName: user?.name || 'Unknown User',
          },
        };
      })
    );

    await client.close();

    return NextResponse.json({
      success: true,
      kycSubmissions: enrichedSubmissions,
    });
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    await client.close();
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC submissions' },
      { status: 500 }
    );
  }
}
