import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Feedback, { FeedbackStatus } from '@/models/Feedback';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// POST - Submit feedback
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { starRating, subject, message, anonymous } = body;

    // Validate required fields
    if (!starRating || starRating < 1 || starRating > 5) {
      return NextResponse.json(
        { error: 'Valid star rating (1-5) is required' },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject cannot be more than 200 characters' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message cannot be more than 1000 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Create new feedback
    const feedback = await Feedback.create({
      userId: session.user.id,
      starRating,
      subject: subject.trim(),
      message: message.trim(),
      anonymous: Boolean(anonymous),
      status: FeedbackStatus.PENDING
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback._id,
        starRating: feedback.starRating,
        subject: feedback.subject,
        status: feedback.status,
        createdAt: feedback.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
