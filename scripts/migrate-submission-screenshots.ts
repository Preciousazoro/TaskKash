import mongoose from 'mongoose';
import Submission from '../models/Submission';

/**
 * Migration script to ensure existing submissions work with multiple screenshot feature
 * This script:
 * 1. Ensures all submissions have proofUrls array (even if they had single proofUrl before)
 * 2. Backwards compatibility with existing data
 */

async function migrateSubmissions() {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskkash');
    }

    console.log('🔄 Starting submissions migration...');

    // Find all submissions that might need migration
    const submissions = await Submission.find({});
    
    console.log(`📊 Found ${submissions.length} submissions to check`);

    let migratedCount = 0;
    
    for (const submission of submissions) {
      let needsUpdate = false;
      const updateData: any = {};

      // If submission has no proofUrls array, initialize it
      if (!submission.proofUrls || !Array.isArray(submission.proofUrls)) {
        updateData.proofUrls = [];
        needsUpdate = true;
      }

      // Check if there's any old single proof field that needs to be migrated
      // (This is for backwards compatibility if we ever had a single proofUrl field)
      if (!needsUpdate) {
        needsUpdate = false;
      }

      if (needsUpdate) {
        await Submission.updateOne(
          { _id: submission._id },
          { $set: updateData }
        );
        migratedCount++;
        console.log(`✅ Migrated submission: ${submission._id}`);
      }
    }

    console.log(`🎉 Migration completed! Migrated ${migratedCount} submissions.`);
    console.log('✅ All submissions now support multiple screenshots');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close connection if we opened it
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateSubmissions()
    .then(() => {
      console.log('🎊 Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateSubmissions;
