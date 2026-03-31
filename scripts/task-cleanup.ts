#!/usr/bin/env node

/**
 * Task Cleanup Script
 * 
 * This script handles automatic cleanup of expired and archived tasks.
 * It should be run periodically (e.g., daily) via a cron job.
 * 
 * Usage:
 *   node scripts/task-cleanup.ts
 * 
 * Environment variables:
 *   - TASK_RETENTION_DAYS: Default retention period for archived tasks (default: 90)
 *   - CLEANUP_API_KEY: API key for authentication (optional)
 *   - MONGODB_URI: MongoDB connection string
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TaskExpiryHandler from '../lib/taskExpiryHandler';

// Load environment variables
dotenv.config();

interface CleanupOptions {
  expiredRetentionDays?: number;
  disabledRetentionDays?: number;
  includeDisabled?: boolean;
}

class TaskCleanupScript {
  private static async connectToDatabase(): Promise<void> {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }
  }

  private static async disconnectFromDatabase(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }

  static async runCleanup(options: CleanupOptions = {}): Promise<{
    success: boolean;
    results: any;
    error?: string;
  }> {
    try {
      console.log('=== Starting Task Cleanup Script ===');
      console.log('Timestamp:', new Date().toISOString());
      
      // Connect to database
      await this.connectToDatabase();

      // Set default options from environment variables
      const cleanupOptions = {
        expiredRetentionDays: parseInt(process.env.TASK_RETENTION_DAYS || '90'),
        disabledRetentionDays: parseInt(process.env.TASK_RETENTION_DAYS || '90'),
        includeDisabled: process.env.INCLUDE_DISABLED_IN_CLEANUP === 'true',
        ...options
      };

      console.log('Cleanup Options:', cleanupOptions);

      // Run the full cleanup process
      const results = await TaskExpiryHandler.runFullCleanup(cleanupOptions);

      console.log('=== Cleanup Results ===');
      console.log(`Expired tasks processed: ${results.expiredTasks.processed}`);
      if (results.disabledTasks) {
        console.log(`Disabled tasks processed: ${results.disabledTasks.processed}`);
      }
      console.log(`Old archives cleaned up: ${results.cleanupExpired}`);
      console.log(`Total errors: ${results.totalErrors.length}`);

      if (results.totalErrors.length > 0) {
        console.log('Errors encountered:');
        results.totalErrors.forEach((error, index) => {
          console.log(`${index + 1}. ${error}`);
        });
      }

      return {
        success: true,
        results
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Cleanup script failed:', errorMessage);
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack available');
      
      return {
        success: false,
        results: null,
        error: errorMessage
      };
    } finally {
      await this.disconnectFromDatabase();
    }
  }

  static async runViaAPI(options: CleanupOptions = {}): Promise<{
    success: boolean;
    results: any;
    error?: string;
  }> {
    try {
      console.log('=== Running Cleanup via API ===');
      
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const apiKey = process.env.CLEANUP_API_KEY;
      
      if (!apiKey) {
        throw new Error('CLEANUP_API_KEY environment variable is required for API mode');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (options.expiredRetentionDays) {
        params.append('expired_retention_days', options.expiredRetentionDays.toString());
      }
      if (options.disabledRetentionDays) {
        params.append('disabled_retention_days', options.disabledRetentionDays.toString());
      }
      if (options.includeDisabled) {
        params.append('include_disabled', 'true');
      }
      params.append('api_key', apiKey);

      const url = `${baseUrl}/api/admin/tasks/cleanup?${params.toString()}`;
      
      console.log('Making request to:', url.replace(/api_key=[^&]+/, 'api_key=***'));

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const results = await response.json();
      console.log('API Cleanup Results:', results);

      return {
        success: true,
        results
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('API cleanup failed:', errorMessage);
      
      return {
        success: false,
        results: null,
        error: errorMessage
      };
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const useAPI = args.includes('--api');
  const includeDisabled = args.includes('--include-disabled');
  
  const options: CleanupOptions = {
    includeDisabled
  };

  // Parse custom retention days from arguments
  const retentionIndex = args.findIndex(arg => arg.startsWith('--retention='));
  if (retentionIndex !== -1) {
    const retentionDays = parseInt(args[retentionIndex].split('=')[1]);
    if (!isNaN(retentionDays)) {
      options.expiredRetentionDays = retentionDays;
      options.disabledRetentionDays = retentionDays;
    }
  }

  let result;
  if (useAPI) {
    result = await TaskCleanupScript.runViaAPI(options);
  } else {
    result = await TaskCleanupScript.runCleanup(options);
  }

  if (result.success) {
    console.log('✅ Cleanup completed successfully');
    process.exit(0);
  } else {
    console.error('❌ Cleanup failed:', result.error);
    process.exit(1);
  }
}

// Export for use in other modules
export default TaskCleanupScript;

// Run if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Script execution failed:', error);
    process.exit(1);
  });
}
