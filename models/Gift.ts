import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGift extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    commission: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
GiftSchema.index({ senderId: 1 });
GiftSchema.index({ receiverId: 1 });
GiftSchema.index({ status: 1 });
GiftSchema.index({ createdAt: -1 });

export default mongoose.models.Gift || mongoose.model<IGift>('Gift', GiftSchema);
