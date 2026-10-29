import Feedback, { FeedbackStatus } from '@/models/Feedback';
import mongoose from 'mongoose';

// Get all feedbacks with optional filters
export async function getAllFeedbacks(params: {
  page?: number;
  limit?: number;
  status?: string;
  star?: number;
}) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const { page = 1, limit = 100, status, star } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) {
      query.status = status.toLowerCase();
    }
    if (star) {
      query.starRating = star;
    }

    const feedbacks = await Feedback.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments(query);

    return {
      success: true,
      data: feedbacks,
      total,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
}

// Approve feedback
export async function approveReview(id: string) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status: FeedbackStatus.APPROVED },
      { new: true }
    );

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return {
      success: true,
      data: feedback
    };
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
}

// Hide feedback (change status to REJECTED to hide)
export async function hideReview(id: string) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status: FeedbackStatus.REJECTED },
      { new: true }
    );

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return {
      success: true,
      data: feedback
    };
  } catch (error) {
    console.error('Error hiding review:', error);
    throw error;
  }
}

// Delete feedback permanently
export async function deleteReview(id: string) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return {
      success: true,
      message: 'Feedback deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}
