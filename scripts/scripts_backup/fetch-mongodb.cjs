const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function exportData() {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const collectionsList = ['Product', 'Category', 'Banner', 'BlogPost'];
    const exportData = {};

    for (const modelName of collectionsList) {
      console.log(`📦 Exporting ${modelName} collection...`);
      const model = mongoose.models[modelName] || mongoose.model(modelName, new mongoose.Schema({}, { strict: false }));
      const data = await model.find({}).lean();
      exportData[modelName] = data;
    }

    const dataDir = path.join(__dirname, '../seed-data/MongoDB-data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const targetFile = path.join(dataDir, 'seed-data.json');
    fs.writeFileSync(targetFile, JSON.stringify(exportData, null, 2));
    console.log(`\n✅ Data exported successfully to ${targetFile}`);

  } catch (err) {
    console.error('❌ Error during export:', err);
  } finally {
    await mongoose.disconnect();
  }
}

exportData();
