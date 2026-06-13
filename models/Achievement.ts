import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAchievement extends Document {
  userId: Types.ObjectId;
  achievementId: string;
  category: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  achievementId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  xp: {
    type: Number,
    default: 0
  },
  unlocked: {
    type: Boolean,
    default: false,
    index: true
  },
  unlockedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for user + achievement
AchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
