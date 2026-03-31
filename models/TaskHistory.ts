import mongoose, { Document, Schema } from 'mongoose';

export enum ArchiveReason {
  EXPIRED = 'expired',
  DELETED = 'deleted',
  DISABLED = 'disabled'
}

export interface ITaskHistory extends Document {
  // Original task data (snapshot)
  title: string;
  description: string;
  category: 'social' | 'content' | 'commerce';
  rewardPoints: number;
  validationType: string;
  instructions: string;
  taskLink?: string;
  alternateUrl?: string;
  deadline?: Date;
  originalStatus: 'active' | 'expired' | 'disabled';
  createdBy: mongoose.Types.ObjectId;
  originalCreatedAt: Date
  originalUpdatedAt: Date;
  
  // Archive metadata
  originalTaskId: mongoose.Types.ObjectId;
  archiveReason: ArchiveReason;
  archivedAt: Date;
  retentionDays: number;
  deleteAfter: Date;
  
  // Additional metadata
  archivedBy?: mongoose.Types.ObjectId; // Admin who archived it
  archiveNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const TaskHistorySchema: Schema<ITaskHistory> = new Schema({
  // Original task data snapshot
  title: {
    type: String,
    required: [true, 'Task title is required for history'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required for history'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Task category is required for history'],
    enum: {
      values: ['social', 'content', 'commerce'],
      message: 'Category must be one of: social, content, commerce'
    }
  },
  rewardPoints: {
    type: Number,
    required: [true, 'Reward points are required for history'],
    min: [0, 'Reward points cannot be negative']
  },
  validationType: {
    type: String,
    required: [true, 'Validation type is required for history'],
    trim: true,
    maxlength: [100, 'Validation type cannot be more than 100 characters']
  },
  instructions: {
    type: String,
    required: [true, 'Task instructions are required for history'],
    trim: true,
    maxlength: [1000, 'Instructions cannot be more than 1000 characters']
  },
  taskLink: {
    type: String,
    trim: true,
    maxlength: [500, 'Task link cannot be more than 500 characters'],
    default: ''
  },
  alternateUrl: {
    type: String,
    trim: true,
    maxlength: [500, 'Alternate URL cannot be more than 500 characters'],
    default: ''
  },
  deadline: {
    type: Date,
    default: null
  },
  originalStatus: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'expired', 'disabled'],
      message: 'Status must be one of: active, expired, disabled'
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalCreatedAt: {
    type: Date,
    required: true
  },
  originalUpdatedAt: {
    type: Date,
    required: true
  },
  
  // Archive metadata
  originalTaskId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Original task ID is required for history'],
    index: true
  },
  archiveReason: {
    type: String,
    required: true,
    enum: {
      values: Object.values(ArchiveReason),
      message: 'Archive reason must be one of: expired, deleted, disabled'
    },
    index: true
  },
  archivedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  retentionDays: {
    type: Number,
    required: true,
    default: 90, // Default 90 days retention
    min: [1, 'Retention period must be at least 1 day'],
    max: [365, 'Retention period cannot exceed 365 days']
  },
  deleteAfter: {
    type: Date,
    required: false,
    index: true
  },
  
  // Additional metadata
  archivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  archiveNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Archive notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  collection: 'taskHistory'
});

// Compound indexes for efficient queries
TaskHistorySchema.index({ archiveReason: 1, archivedAt: -1 });
TaskHistorySchema.index({ deleteAfter: 1 }, { expireAfterSeconds: 0 }); // Auto-delete after retention
TaskHistorySchema.index({ originalTaskId: 1 }, { unique: true }); // One history record per task
TaskHistorySchema.index({ createdBy: 1, archivedAt: -1 });
TaskHistorySchema.index({ category: 1, archiveReason: 1 });
TaskHistorySchema.index({ title: 'text', description: 'text' }); // For search functionality

// Pre-save middleware to calculate deleteAfter date
TaskHistorySchema.pre('save', function(next) {
  if (this.isNew && !this.deleteAfter) {
    const archivedAt = this.archivedAt || new Date();
    const retentionDays = this.retentionDays || 90;
    this.deleteAfter = new Date(archivedAt.getTime() + (retentionDays * 24 * 60 * 60 * 1000));
    console.log('Pre-save middleware set deleteAfter to:', this.deleteAfter);
  }
  
  // Validate deleteAfter is set for new records
  if (this.isNew && !this.deleteAfter) {
    return next(new Error('deleteAfter is required but not set'));
  }
  
  next();
});

// Static method to archive a task
TaskHistorySchema.statics.archiveTask = async function(
  taskData: any,
  archiveReason: ArchiveReason,
  retentionDays: number = 90,
  archivedBy?: mongoose.Types.ObjectId,
  archiveNotes?: string
) {
  try {
    // Validate required fields
    if (!taskData._id) {
      throw new Error('Task ID is required for archiving');
    }
    if (!taskData.createdBy) {
      throw new Error('Task createdBy is required for archiving');
    }
    if (!taskData.createdAt) {
      throw new Error('Task createdAt is required for archiving');
    }
    if (!taskData.updatedAt) {
      throw new Error('Task updatedAt is required for archiving');
    }
    
    // Create history record
    const archivedAt = new Date();
    const deleteAfter = new Date(archivedAt.getTime() + (retentionDays * 24 * 60 * 60 * 1000));
    
    console.log('Creating TaskHistory with:', {
      archivedAt,
      deleteAfter,
      retentionDays,
      calculation: `${archivedAt.getTime()} + (${retentionDays} * 24 * 60 * 60 * 1000) = ${deleteAfter.getTime()}`
    });
    
    const historyRecord = new this({
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      rewardPoints: taskData.rewardPoints,
      validationType: taskData.validationType,
      instructions: taskData.instructions,
      taskLink: taskData.taskLink || '',
      alternateUrl: taskData.alternateUrl || '',
      deadline: taskData.deadline,
      originalStatus: taskData.status,
      createdBy: taskData.createdBy,
      originalCreatedAt: taskData.createdAt,
      originalUpdatedAt: taskData.updatedAt,
      originalTaskId: taskData._id,
      archiveReason,
      archivedAt,
      retentionDays,
      deleteAfter,
      archivedBy,
      archiveNotes
    });
    
    await historyRecord.save();
    return historyRecord;
  } catch (error) {
    console.error('Error archiving task:', error);
    throw error;
  }
};

// Static method to find archived task by original ID
TaskHistorySchema.statics.findByOriginalTaskId = function(originalTaskId: mongoose.Types.ObjectId) {
  return this.findOne({ originalTaskId });
};

// Static method to cleanup expired records
TaskHistorySchema.statics.cleanupExpired = async function() {
  try {
    const result = await this.deleteMany({
      deleteAfter: { $lte: new Date() }
    });
    console.log(`Cleaned up ${result.deletedCount} expired task history records`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired task history:', error);
    throw error;
  }
};

// Instance method to extend retention
TaskHistorySchema.methods.extendRetention = function(additionalDays: number) {
  this.retentionDays += additionalDays;
  this.deleteAfter = new Date(this.archivedAt.getTime() + (this.retentionDays * 24 * 60 * 60 * 1000));
  return this.save();
};

export default mongoose.models.TaskHistory || mongoose.model<ITaskHistory>('TaskHistory', TaskHistorySchema);
