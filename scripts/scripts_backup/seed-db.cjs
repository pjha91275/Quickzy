const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function seedDb() {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const dataPath = path.join(__dirname, '../seed-data/MongoDB-data/seed-data.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error('❌ seed-data.json not found in seed-data/MongoDB-data/');
    }

    const exportData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const collectionsList = ['Product', 'Category', 'Banner', 'BlogPost'];

    for (const modelName of collectionsList) {
      if (!exportData[modelName]) continue;

      console.log(`🧹 Clearing ${modelName} collection...`);
      const model = mongoose.models[modelName] || mongoose.model(modelName, new mongoose.Schema({}, { strict: false }));
      await model.deleteMany({});

      console.log(`🌱 Seeding ${exportData[modelName].length} items into ${modelName}...`);
      await model.insertMany(exportData[modelName]);
    }

    console.log('\n✅ Database Seeding Complete!');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedDb();
