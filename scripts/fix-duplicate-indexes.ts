import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not found in environment variables');
}

async function fixDuplicateIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const usersCollection = db.collection('users');

    console.log('\nCurrent indexes on users collection:');
    const indexes = await usersCollection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Find and drop duplicate email and username indexes
    const indexesToDrop = indexes
      .filter((idx: any) => {
        const key = JSON.stringify(idx.key);
        // Drop indexes that are not the default _id index and are duplicates
        return (key === '{"email":1}' || key === '{"username":1}') && idx.name !== 'email_1' && idx.name !== 'username_1';
      })
      .map((idx: any) => idx.name);

    if (indexesToDrop.length === 0) {
      console.log('\nNo duplicate indexes found to drop');
    } else {
      console.log(`\nDropping ${indexesToDrop.length} duplicate indexes:`, indexesToDrop);
      
      for (const indexName of indexesToDrop) {
        try {
          await usersCollection.dropIndex(indexName);
          console.log(`✓ Dropped index: ${indexName}`);
        } catch (error: any) {
          if (error.code === 27) {
            console.log(`- Index ${indexName} does not exist (already dropped)`);
          } else {
            console.error(`✗ Error dropping index ${indexName}:`, error.message);
          }
        }
      }
    }

    console.log('\nFinal indexes on users collection:');
    const finalIndexes = await usersCollection.indexes();
    console.log(JSON.stringify(finalIndexes, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixDuplicateIndexes();
