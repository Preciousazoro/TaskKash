import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ISubmissionData {
  [key: string]: string; // Dynamic field for verification data (tx hash, wallet address, etc.)
}

export interface ICampaignSubmission extends Document {
  campaignId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  submissionData: ISubmissionData;
  status: SubmissionStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSubmissionSchema: Schema<ICampaignSubmission> = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'MarketplaceCampaign',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submissionData: {
      type: Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewNotes: {
      type: String,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
CampaignSubmissionSchema.index({ campaignId: 1, userId: 1 });
CampaignSubmissionSchema.index({ userId: 1, status: 1 });
CampaignSubmissionSchema.index({ status: 1, createdAt: -1 });
CampaignSubmissionSchema.index({ campaignId: 1, status: 1 });

const CampaignSubmission: Model<ICampaignSubmission> = mongoose.models.CampaignSubmission || mongoose.model<ICampaignSubmission>('CampaignSubmission', CampaignSubmissionSchema);

export default CampaignSubmission;