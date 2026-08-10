import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';

// PUT - Update marketplace campaign status
export async function PUT(
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

    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either "draft" or "published"' },
        { status: 400 }
      );
    }

    const campaign = await MarketplaceCampaign.findByIdAndUpdate(
      params.id,
      { visibility: status },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { error: 'Marketplace campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
      message: `Campaign status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating marketplace campaign status:', error);
    return NextResponse.json(
      { error: 'Failed to update marketplace campaign status' },
      { status: 500 }
    );
  }
}
