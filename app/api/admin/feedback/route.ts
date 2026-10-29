import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllFeedbacks } from '@/lib/services/feedbackService';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET - Fetch all feedbacks with filters
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || undefined;
    const star = searchParams.get('star') ? parseInt(searchParams.get('star')!) : undefined;

    const result = await getAllFeedbacks({ page, limit, status, star });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
