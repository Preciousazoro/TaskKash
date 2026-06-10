import { NextResponse } from 'next/server';
import WithdrawalVisibility from '@/models/WithdrawalVisibility';

// GET - Fetch current withdrawal visibility (public endpoint for users)
export async function GET() {
  try {
    let visibility = await WithdrawalVisibility.findOne();
    
    // Create default visibility if none exists
    if (!visibility) {
      visibility = await WithdrawalVisibility.create({
        isVisible: true
      });
    }

    return NextResponse.json({ isVisible: visibility.isVisible });
  } catch (error) {
    console.error('Error fetching withdrawal visibility:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal visibility' },
      { status: 500 }
    );
  }
}
