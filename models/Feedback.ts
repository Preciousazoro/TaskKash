import mongoose, { Document, Schema } from 'mongoose';

export enum FeedbackStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IFeedback extends Document {
  userId: string;
  starRating: number;
  subject: string;
  message: string;
  anonymous: boolean;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  starRating: {
    type: Number,
    required: [true, 'Star rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(FeedbackStatus),
    default: FeedbackStatus.PENDING,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
