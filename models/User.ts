import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface SocialMedia {
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
  discord?: string | null;
}

export interface CryptoAddress {
  id: string;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  address: string;
}

// Define subdocument schema for crypto addresses
const CryptoAddressSchema = new Schema<CryptoAddress>({
  id: { type: String, required: true },
  crypto: {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    icon: { type: String, required: true }
  },
  address: { type: String, required: true }
}, { _id: false });

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  username?: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  taskPoints: number;
  welcomeBonusGranted: boolean;
  lastLoginBonusAt?: Date;
  tasksCompleted: number;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  socialLinks?: SocialMedia;
  cryptoPayoutAddresses?: CryptoAddress[];
  dailyStreak: number;
  lastStreakDate?: Date;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  withdrawalOTP?: string | null;
  otpExpiration?: Date | null;
  emailVerified: boolean;
  phone?: string | null;
  country?: string | null;
  telegramUsername?: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters long'],
    select: false
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: [3, 'Username should be at least 3 characters long'],
    maxlength: [20, 'Username cannot be more than 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  avatarUrl: {
    type: String,
    default: null
  },
  avatarPublicId: {
    type: String,
    default: null
  },
  taskPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  welcomeBonusGranted: {
    type: Boolean,
    default: false
  },
  lastLoginBonusAt: {
    type: Date,
    default: null
  },
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  socialLinks: {
    twitter: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid Twitter/X URL'
      }
    },
    instagram: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid Instagram URL'
      }
    },
    linkedin: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid LinkedIn URL'
      }
    },
    facebook: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?facebook\.com\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid Facebook URL'
      }
    },
    whatsapp: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?wa\.me\/.+/i.test(trimmed) || /^https?:\/\/(www\.)?whatsapp\.com\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid WhatsApp URL'
      }
    },
    tiktok: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?tiktok\.com\/@.+/i.test(trimmed);
        },
        message: 'Please provide a valid TikTok URL'
      }
    },
    telegram: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?t\.me\/.+/i.test(trimmed) || /^https?:\/\/(www\.)?telegram\.me\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid Telegram URL'
      }
    },
    discord: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const trimmed = v.trim();
          return !trimmed || /^https?:\/\/(www\.)?discord\.gg\/.+/i.test(trimmed) || /^https?:\/\/(www\.)?discord\.com\/.+/i.test(trimmed);
        },
        message: 'Please provide a valid Discord URL'
      }
    }
  },
  cryptoPayoutAddresses: {
    type: [CryptoAddressSchema],
    default: []
  },
  dailyStreak: {
    type: Number,
    default: 0,
    min: 0,
    max: 7
  },
  lastStreakDate: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    default: null,
    select: false
  },
  withdrawalOTP: {
    type: String,
    default: null,
    select: false
  },
  otpExpiration: {
    type: Date,
    default: null,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    default: null,
    trim: true
  },
  country: {
    type: String,
    default: null,
    trim: true
  },
  telegramUsername: {
    type: String,
    default: null,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
// Note: email and username already have unique indexes from schema definition
UserSchema.index({ role: 1 }); // Role-based queries
UserSchema.index({ status: 1 }); // Status-based queries
UserSchema.index({ createdAt: -1 }); // Sort by creation date
UserSchema.index({ role: 1, status: 1 }); // Compound index for admin queries

// Add missing indexes for better performance
UserSchema.index({ taskPoints: -1 }); // For leaderboard queries
UserSchema.index({ tasksCompleted: -1 }); // For user ranking
UserSchema.index({ dailyStreak: -1 }); // For streak queries
UserSchema.index({ emailVerified: 1 }); // For verification queries
UserSchema.index({ welcomeBonusGranted: 1 }); // For bonus queries

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
