import mongoose, { Document, Schema } from 'mongoose';

export interface IBroadcast extends Document {
  title: string;
  message: string;
  sentViaEmail: boolean;
  sentViaInApp: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastSchema: Schema<IBroadcast> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a broadcast title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a broadcast message'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  sentViaEmail: {
    type: Boolean,
    required: true,
    default: false
  },
  sentViaInApp: {
    type: Boolean,
    required: true,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the admin ID who created this broadcast'],
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
BroadcastSchema.index({ createdAt: -1 });
BroadcastSchema.index({ createdBy: 1, createdAt: -1 });
BroadcastSchema.index({ sentViaEmail: 1, sentViaInApp: 1 });

export default mongoose.models.Broadcast || mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);
