import connectDB from './mongodb';
import Task from '@/models/Task';
import TaskHistory from '@/models/TaskHistory';
import { ArchiveReason } from '@/models/TaskHistory';

export class TaskExpiryHandler {
  /**
   * Find and archive expired tasks
   * This should be run periodically (e.g., daily cron job)
   */
  static async handleExpiredTasks(retentionDays: number = 90): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      await connectDB();
      
      // Find tasks that are past their deadline and still active
      const expiredTasks = await Task.find({
        status: 'active',
        deadline: { $lte: new Date() }
      });

      console.log(`Found ${expiredTasks.length} expired tasks to process`);

      for (const task of expiredTasks) {
        try {
          // Check if already archived
          const TaskHistoryModel = TaskHistory as any;
          const existingHistory = await TaskHistoryModel.findByOriginalTaskId(task._id);
          if (existingHistory) {
            console.log(`Task ${task.title} already archived, skipping...`);
            continue;
          }

          // Archive the expired task
          await TaskHistoryModel.archiveTask(
            task.toObject(),
            ArchiveReason.EXPIRED,
            retentionDays,
            undefined, // No specific admin for automated expiry
            'Task automatically expired due to deadline'
          );

          // Update task status to expired
          await Task.findByIdAndUpdate(task._id, { status: 'expired' });

          processed++;
          console.log(`Archived expired task: ${task.title}`);
        } catch (error) {
          const errorMsg = `Failed to archive task ${task.title}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      console.log(`Processed ${processed} expired tasks successfully`);
      if (errors.length > 0) {
        console.error(`Encountered ${errors.length} errors during expiry processing`);
      }

    } catch (error) {
      const errorMsg = `Failed to process expired tasks: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    return { processed, errors };
  }

  /**
   * Archive tasks with 'disabled' status
   * Optional: include disabled tasks in archive
   */
  static async handleDisabledTasks(retentionDays: number = 90): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      await connectDB();
      
      // Find disabled tasks that aren't already archived
      const disabledTasks = await Task.find({
        status: 'disabled'
      });

      console.log(`Found ${disabledTasks.length} disabled tasks to process`);

      for (const task of disabledTasks) {
        try {
          // Check if already archived
          const TaskHistoryModel = TaskHistory as any;
          const existingHistory = await TaskHistoryModel.findByOriginalTaskId(task._id);
          if (existingHistory) {
            console.log(`Task ${task.title} already archived, skipping...`);
            continue;
          }

          // Archive the disabled task
          await TaskHistoryModel.archiveTask(
            task.toObject(),
            ArchiveReason.DISABLED,
            retentionDays,
            undefined,
            'Task automatically archived due to disabled status'
          );

          processed++;
          console.log(`Archived disabled task: ${task.title}`);
        } catch (error) {
          const errorMsg = `Failed to archive disabled task ${task.title}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      console.log(`Processed ${processed} disabled tasks successfully`);

    } catch (error) {
      const errorMsg = `Failed to process disabled tasks: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    return { processed, errors };
  }

  /**
   * Comprehensive cleanup: handle expired, disabled, and cleanup old archived tasks
   */
  static async runFullCleanup(options: {
    expiredRetentionDays?: number;
    disabledRetentionDays?: number;
    includeDisabled?: boolean;
  } = {}): Promise<{
    expiredTasks: { processed: number; errors: string[] };
    disabledTasks: { processed: number; errors: string[] } | null;
    cleanupExpired: number;
    totalErrors: string[];
  }> {
    const {
      expiredRetentionDays = 90,
      disabledRetentionDays = 90,
      includeDisabled = false
    } = options;

    const totalErrors: string[] = [];

    // Handle expired tasks
    console.log('=== Processing Expired Tasks ===');
    const expiredTasksResult = await this.handleExpiredTasks(expiredRetentionDays);
    totalErrors.push(...expiredTasksResult.errors);

    // Handle disabled tasks (optional)
    let disabledTasksResult = null;
    if (includeDisabled) {
      console.log('=== Processing Disabled Tasks ===');
      disabledTasksResult = await this.handleDisabledTasks(disabledRetentionDays);
      totalErrors.push(...disabledTasksResult.errors);
    }

    // Cleanup old archived tasks
    console.log('=== Cleaning Up Old Archived Tasks ===');
    const TaskHistoryModel = TaskHistory as any;
    const cleanupExpired = await TaskHistoryModel.cleanupExpired();

    console.log('=== Cleanup Summary ===');
    console.log(`Expired tasks processed: ${expiredTasksResult.processed}`);
    if (disabledTasksResult) {
      console.log(`Disabled tasks processed: ${disabledTasksResult.processed}`);
    }
    console.log(`Old archives cleaned up: ${cleanupExpired}`);
    console.log(`Total errors: ${totalErrors.length}`);

    return {
      expiredTasks: expiredTasksResult,
      disabledTasks: disabledTasksResult,
      cleanupExpired,
      totalErrors
    };
  }

  /**
   * Check if a task is expired based on its deadline
   */
  static isTaskExpired(task: { deadline?: Date | null; status: string }): boolean {
    if (!task.deadline || task.status !== 'active') {
      return false;
    }
    return new Date() > new Date(task.deadline);
  }

  /**
   * Get tasks that will expire soon (e.g., within 24 hours)
   */
  static async getTasksExpiringSoon(hours: number = 24): Promise<any[]> {
    try {
      await connectDB();
      
      const soonExpiryDate = new Date(Date.now() + (hours * 60 * 60 * 1000));
      
      const expiringSoonTasks = await Task.find({
        status: 'active',
        deadline: {
          $gte: new Date(),
          $lte: soonExpiryDate
        }
      }).select('title deadline category rewardPoints').sort({ deadline: 1 });

      return expiringSoonTasks;
    } catch (error) {
      console.error('Error fetching tasks expiring soon:', error);
      return [];
    }
  }
}

export default TaskExpiryHandler;
