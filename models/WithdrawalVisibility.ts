import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawalVisibility extends Document {
  isVisible: boolean;
  lastUpdatedBy?: mongoose.Types.ObjectId;
  lastUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalVisibilitySchema: Schema<IWithdrawalVisibility> = new Schema({
  isVisible: {
    type: Boolean,
    default: true,
    required: true
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure there's only one document in this collection
WithdrawalVisibilitySchema.pre('save', async function(next) {
  const count = await mongoose.models.WithdrawalVisibility?.countDocuments();
  if (count && count > 0 && this.isNew) {
    const error = new Error('Only one withdrawal visibility setting can exist');
    return next(error);
  }
  next();
});

export default (mongoose.models && mongoose.models.WithdrawalVisibility) || mongoose.model<IWithdrawalVisibility>('WithdrawalVisibility', WithdrawalVisibilitySchema);
