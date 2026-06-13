import mongoose, { Schema, Document, Model } from 'mongoose';

export type CampaignType = 'music' | 'video';
export type Platform = 'youtube' | 'spotify' | 'audiomack' | 'apple_music';
export type CompletionType = 'watch_duration' | 'watch_percentage' | 'listen_duration' | 'listen_percentage';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface ICampaign extends Document {
  title: string;
  description: string;
  creatorName: string;
  creatorAvatar?: string;
  platform: Platform;
  campaignType: CampaignType;
  mediaUrl: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  reward: number;
  totalBudget: number;
  completionType: CompletionType;
  requiredDuration?: number;
  requiredPercentage?: number;
  allowSkipping: boolean;
  countPaused: boolean;
  repeatLimit: number;
  status: CampaignStatus;
  totalDuration?: number;
  coverArt?: string;
  coverArtPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema<ICampaign> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    creatorName: {
      type: String,
      required: true,
      trim: true
    },
    creatorAvatar: {
      type: String,
      default: 'https://i.postimg.cc/59XZ1skK/LOGO.jpg'
    },
    platform: {
      type: String,
      enum: ['youtube', 'spotify', 'audiomack', 'apple_music'],
      required: true
    },
    campaignType: {
      type: String,
      enum: ['music', 'video'],
      required: true
    },
    mediaUrl: {
      type: String,
      required: true,
      trim: true
    },
    embedUrl: {
      type: String,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      trim: true
    },
    thumbnailPublicId: {
      type: String,
      trim: true
    },
    reward: {
      type: Number,
      required: true,
      min: 1
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 1
    },
    completionType: {
      type: String,
      enum: ['watch_duration', 'watch_percentage', 'listen_duration', 'listen_percentage'],
      required: true
    },
    requiredDuration: {
      type: Number,
      min: 1
    },
    requiredPercentage: {
      type: Number,
      min: 1,
      max: 100
    },
    allowSkipping: {
      type: Boolean,
      default: false
    },
    countPaused: {
      type: Boolean,
      default: false
    },
    repeatLimit: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed'],
      default: 'draft'
    },
    totalDuration: {
      type: Number,
      min: 1
    },
    coverArt: {
      type: String,
      trim: true
    },
    coverArtPublicId: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
CampaignSchema.index({ status: 1, createdAt: -1 });
CampaignSchema.index({ platform: 1, campaignType: 1 });
CampaignSchema.index({ creatorName: 1 });

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
