# Task Cleanup System Setup Guide

## Overview

The TaskKash Task History/Archive system includes automatic cleanup functionality to manage expired and archived tasks. This guide explains how to set up and configure the cleanup system.

## Components

### 1. Task History Model
- **Location**: `/models/TaskHistory.ts`
- **Purpose**: Stores archived task data with retention periods
- **Features**: Automatic cleanup via MongoDB TTL index

### 2. Task Expiry Handler
- **Location**: `/lib/taskExpiryHandler.ts`
- **Purpose**: Handles automatic expiry and archiving logic
- **Methods**: 
  - `handleExpiredTasks()` - Archives expired tasks
  - `handleDisabledTasks()` - Archives disabled tasks
  - `runFullCleanup()` - Comprehensive cleanup process

### 3. Cleanup API Endpoint
- **Location**: `/app/api/admin/tasks/cleanup/route.ts`
- **Purpose**: HTTP endpoint for manual or automated cleanup
- **Authentication**: Session auth or API key

### 4. Cleanup Script
- **Location**: `/scripts/task-cleanup.ts`
- **Purpose**: Standalone script for cron job execution
- **Usage**: Direct database access or API-based cleanup

## Environment Variables

Add these to your `.env` file:

```env
# Task retention period (default: 90 days)
TASK_RETENTION_DAYS=90

# API key for cleanup endpoint authentication
CLEANUP_API_KEY=your_secure_api_key_here

# Include disabled tasks in cleanup (optional)
INCLUDE_DISABLED_IN_CLEANUP=false

# Base URL for API-based cleanup (if using remote execution)
BASE_URL=https://your-domain.com
```

## Setup Options

### Option 1: Cron Job with Direct Database Access

1. **Create a cron job** that runs the cleanup script:

```bash
# Edit crontab
crontab -e

# Add daily cleanup at 2:00 AM
0 2 * * * cd /path/to/your/project && node scripts/task-cleanup.ts >> /var/log/taskkash-cleanup.log 2>&1

# Add weekly cleanup with disabled tasks
0 3 * * 0 cd /path/to/your/project && node scripts/task-cleanup.ts --include-disabled >> /var/log/taskkash-cleanup.log 2>&1
```

2. **Install dependencies**:

```bash
npm install dotenv
# or if using TypeScript directly
npm install -g ts-node
```

3. **Test the script**:

```bash
# Dry run (test mode)
node scripts/task-cleanup.ts --retention=30

# Include disabled tasks
node scripts/task-cleanup.ts --include-disabled

# Use API endpoint instead of direct DB access
node scripts/task-cleanup.ts --api
```

### Option 2: Cron Job with API Endpoint

1. **Set up the API key** in your environment variables:

```env
CLEANUP_API_KEY=your_secure_random_string_here
```

2. **Create a cron job** that calls the API endpoint:

```bash
# Edit crontab
crontab -e

# Add daily cleanup via API
0 2 * * * curl -X GET "https://your-domain.com/api/admin/tasks/cleanup?api_key=your_secure_api_key_here" >> /var/log/taskkash-cleanup.log 2>&1

# Add cleanup with disabled tasks
0 3 * * 0 curl -X GET "https://your-domain.com/api/admin/tasks/cleanup?api_key=your_secure_api_key_here&include_disabled=true" >> /var/log/taskkash-cleanup.log 2>&1
```

### Option 3: Serverless Function (Vercel/Netlify)

1. **Create a scheduled function** (Vercel Cron Jobs example):

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/admin/tasks/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

2. **Set the API key** in your hosting provider's environment variables.

### Option 4: Docker Container with Cron

1. **Create a Dockerfile** for the cleanup service:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Add cron script
RUN echo "0 2 * * * cd /app && node scripts/task-cleanup.ts >> /var/log/cleanup.log 2>&1" > /etc/crontabs/root

CMD ["crond", "-f"]
```

2. **Run as a separate container** in your docker-compose setup.

## Manual Cleanup

### Via Admin Interface

1. Navigate to **Admin Dashboard** → **Manage Tasks** → **Task History**
2. Use the bulk actions to extend retention or permanently delete tasks

### Via API Endpoint

```bash
# Manual cleanup with custom retention
curl -X POST "https://your-domain.com/api/admin/tasks/cleanup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_session_token" \
  -d '{
    "includeDisabled": false,
    "expiredRetentionDays": 60,
    "disabledRetentionDays": 90
  }'
```

### Via Direct Script

```bash
# Run with custom options
node scripts/task-cleanup.ts --retention=60 --include-disabled
```

## Monitoring and Logging

### Log Files

- **Default location**: `/var/log/taskkash-cleanup.log`
- **Rotation**: Set up logrotate to manage log files
- **Format**: Timestamped entries with success/failure status

### Monitoring Commands

```bash
# Check recent cleanup logs
tail -f /var/log/taskkash-cleanup.log

# Check cleanup statistics
grep "Cleanup Results" /var/log/taskkash-cleanup.log | tail -10

# Monitor for errors
grep -i error /var/log/taskkash-cleanup.log | tail -10
```

### Health Check

Create a simple health check endpoint:

```typescript
// app/api/admin/tasks/cleanup/health/route.ts
import { NextResponse } from 'next/server';
import TaskHistory from '@/models/TaskHistory';

export async function GET() {
  try {
    const stats = {
      totalArchived: await TaskHistory.countDocuments(),
      expiringSoon: await TaskHistory.countDocuments({
        deleteAfter: { 
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          $gt: new Date()
        }
      }),
      expired: await TaskHistory.countDocuments({
        deleteAfter: { $lte: new Date() }
      })
    };

    return NextResponse.json({ 
      status: 'healthy',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Check `MONGODB_URI` environment variable
   - Verify database accessibility
   - Check network connectivity

2. **API Key Authentication Issues**
   - Ensure `CLEANUP_API_KEY` is set and matches
   - Check API key is passed correctly in requests
   - Verify no special characters in API key

3. **Permission Errors**
   - Ensure script has execute permissions
   - Check file ownership and permissions
   - Verify cron job user has necessary permissions

4. **Memory Issues**
   - Monitor script memory usage
   - Consider processing in batches for large datasets
   - Adjust timeout values if needed

### Debug Mode

Run the script with additional logging:

```bash
# Enable debug logging
DEBUG=taskkash:* node scripts/task-cleanup.ts --retention=7
```

## Best Practices

1. **Schedule Timing**: Run cleanup during low-traffic hours (e.g., 2:00 AM)
2. **Retention Periods**: Use longer retention periods (90+ days) for compliance
3. **Backups**: Ensure database backups before cleanup operations
4. **Monitoring**: Set up alerts for cleanup failures
5. **Testing**: Test cleanup scripts in staging environment first
6. **Documentation**: Document any custom retention policies

## Security Considerations

1. **API Keys**: Use strong, randomly generated API keys
2. **Network Security**: Restrict cleanup endpoint access to internal networks
3. **Audit Trail**: Log all cleanup operations with user attribution
4. **Data Privacy**: Ensure compliance with data protection regulations
5. **Access Control**: Limit who can trigger manual cleanups

## Performance Optimization

1. **Batch Processing**: Process tasks in batches to avoid memory issues
2. **Indexing**: Ensure proper database indexes on cleanup queries
3. **Timeouts**: Set appropriate timeout values for long-running operations
4. **Resource Limits**: Monitor and limit resource usage during cleanup
5. **Parallel Processing**: Consider parallel processing for large datasets

## Compliance and Legal

1. **Data Retention**: Configure retention periods based on legal requirements
2. **GDPR**: Ensure right to erasure is respected
3. **Audit Logs**: Maintain audit trails for cleanup operations
4. **Documentation**: Document cleanup policies and procedures
5. **Review**: Regularly review and update cleanup policies
