import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

// PATCH - Update campaign status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { status } = body;

    const campaign = await Campaign.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign status' },
      { status: 500 }
    );
  }
}
