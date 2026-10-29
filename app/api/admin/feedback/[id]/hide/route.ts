import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { hideReview } from '@/lib/services/feedbackService';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// PATCH - Hide feedback
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

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const result = await hideReview(id);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error hiding feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
