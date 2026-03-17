const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function updateSaffola() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not found in environment');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('products').updateOne(
      { id_custom: 26 },
      { 
        $set: { 
          name: "Saffola Gold (1LTR)", 
          unit: "1 LTR",
          description: "Saffola Gold is a premium blended edible oil that contains the goodness of Rice Bran and Sunflower oil for a healthy heart journey. Equipped with Losorb technology, it ensures that your food absorbs significantly less oil, making your meals lighter and healthier for the whole family. It is rich in natural antioxidants and Oryzanol, which help in managing cholesterol levels effectively when part of a balanced diet. This 1-liter jar is a convenient and economical choice for households that prioritize both flavor and health."
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log('Successfully updated Saffola Gold in MongoDB');
    } else {
      console.log('Saffola Gold product not found in MongoDB');
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error updating Saffola Gold:', err);
    process.exit(1);
  }
}

updateSaffola();
