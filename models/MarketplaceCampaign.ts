import mongoose, { Schema, Document, Model } from 'mongoose';

export type CampaignStatus = 'draft' | 'published';

export interface IRequirement {
  id: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
}

export interface IStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface IVerificationField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface IFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IAudienceTargeting {
  country: string;
  language: string;
  walletType: string;
  minLevel: string;
  kycRequired: boolean;
  returningUsers: boolean;
  newUsers: boolean;
  vipUsers: boolean;
  referralRequired: boolean;
}

export interface IMedia {
  logo?: string;
  banner?: string;
  gallery?: string[];
  video?: string;
  whitepaper?: string;
  attachments?: string[];
}

export interface IMarketplaceCampaign extends Document {
  name: string;
  brandName: string;
  brandLogo?: string;
  website?: string;
  description: string;
  shortDescription: string;
  type: string;
  category: string;
  subcategory?: string;
  tags?: string;
  featured: boolean;
  trending: boolean;
  visibility: CampaignStatus;
  endsAt?: Date;
  
  // Reward Settings
  rewardAmount: number;
  rewardPool?: number;
  maxParticipants?: number;
  maxClaimsPerUser: number;
  rewardDelay: number;
  rewardExpiration: number;
  distributionMethod: string;
  
  // Complex fields
  requirements: IRequirement[];
  steps: IStep[];
  verificationMode: string;
  verificationFields: IVerificationField[];
  faqs: IFaq[];
  audience: IAudienceTargeting;
  media: IMedia;
  
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema({
  id: { type: String },
  type: { type: String },
  title: { type: String },
  description: { type: String },
  required: { type: Boolean, default: true }
});

const StepSchema = new Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String },
  order: { type: Number }
});

const VerificationFieldSchema = new Schema({
  id: { type: String },
  label: { type: String },
  type: { type: String },
  required: { type: Boolean, default: true }
});

const FaqSchema = new Schema({
  id: { type: String },
  question: { type: String },
  answer: { type: String }
});

const AudienceTargetingSchema = new Schema({
  country: { type: String, default: 'all' },
  language: { type: String, default: 'all' },
  walletType: { type: String, default: 'any' },
  minLevel: { type: String, default: '1' },
  kycRequired: { type: Boolean, default: false },
  returningUsers: { type: Boolean, default: false },
  newUsers: { type: Boolean, default: false },
  vipUsers: { type: Boolean, default: false },
  referralRequired: { type: Boolean, default: false }
});

const MediaSchema = new Schema({
  logo: { type: String, default: null },
  banner: { type: String, default: null },
  gallery: { type: String, default: null }, // Single URL for now, can be expanded to array later
  video: { type: String, default: null },
  whitepaper: { type: String, default: null },
  attachments: { type: String, default: null } // Single URL for now, can be expanded to array later
});

const MarketplaceCampaignSchema: Schema<IMarketplaceCampaign> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    brandName: {
      type: String,
      trim: true,
      default: ''
    },
    brandLogo: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    shortDescription: {
      type: String,
      trim: true,
      maxLength: 100,
      default: ''
    },
    type: {
      type: String,
      enum: ['social', 'content', 'referral', 'trading', 'utility', 'other'],
      default: 'social'
    },
    category: {
      type: String,
      default: 'General'
    },
    subcategory: {
      type: String,
      trim: true,
      default: ''
    },
    tags: {
      type: String,
      trim: true,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    trending: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    endsAt: {
      type: Date,
      default: null
    },
    
    // Reward Settings
    rewardAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    rewardPool: {
      type: Number,
      min: 0,
      default: 0
    },
    maxParticipants: {
      type: Number,
      min: 1,
      default: null
    },
    maxClaimsPerUser: {
      type: Number,
      default: 1,
      min: 1
    },
    rewardDelay: {
      type: Number,
      default: 0,
      min: 0
    },
    rewardExpiration: {
      type: Number,
      default: 90,
      min: 1
    },
    distributionMethod: {
      type: String,
      default: 'Automatic',
      enum: ['Automatic', 'Manual']
    },
    
    // Complex fields
    requirements: {
      type: [RequirementSchema],
      default: []
    },
    steps: {
      type: [StepSchema],
      default: []
    },
    verificationMode: {
      type: String,
      default: 'manual',
      enum: ['manual', 'automatic', 'hybrid']
    },
    verificationFields: {
      type: [VerificationFieldSchema],
      default: []
    },
    faqs: {
      type: [FaqSchema],
      default: []
    },
    audience: {
      type: AudienceTargetingSchema,
      default: () => ({
        country: 'all',
        language: 'all',
        walletType: 'any',
        minLevel: '1',
        kycRequired: false,
        returningUsers: false,
        newUsers: false,
        vipUsers: false,
        referralRequired: false
      })
    },
    media: {
      type: MediaSchema,
      default: () => ({
        logo: null,
        banner: null,
        gallery: null,
        video: null,
        whitepaper: null,
        attachments: null
      })
    } as any
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
MarketplaceCampaignSchema.index({ visibility: 1, createdAt: -1 });
MarketplaceCampaignSchema.index({ category: 1, type: 1 });
MarketplaceCampaignSchema.index({ featured: 1, trending: 1 });
MarketplaceCampaignSchema.index({ brandName: 1 });

const MarketplaceCampaign: Model<IMarketplaceCampaign> = mongoose.models.MarketplaceCampaign || mongoose.model<IMarketplaceCampaign>('MarketplaceCampaign', MarketplaceCampaignSchema);

export default MarketplaceCampaign;
