import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEmailVerification extends Document {
  _id: Types.ObjectId;
  email: string;
  otpCode: string;
  name?: string;
  password?: string;
  username?: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  otpCode: {
    type: String,
    required: [true, 'OTP code is required'],
    minlength: [6, 'OTP code must be 6 digits'],
    maxlength: [6, 'OTP code must be 6 digits']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  password: {
    type: String,
    minlength: [6, 'Password should be at least 6 characters long']
  },
  username: {
    type: String,
    trim: true,
    minlength: [3, 'Username should be at least 3 characters long'],
    maxlength: [20, 'Username cannot be more than 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
  }
}, {
  timestamps: true
});

// Index for efficient queries
EmailVerificationSchema.index({ email: 1 });
EmailVerificationSchema.index({ otpCode: 1 });
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired documents

// Clean up expired documents periodically
EmailVerificationSchema.pre('find', function() {
  this.where({ expiresAt: { $gt: new Date() } });
});

EmailVerificationSchema.pre('findOne', function() {
  this.where({ expiresAt: { $gt: new Date() } });
});

export default mongoose.models.EmailVerification || mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);
