const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const SOURCE_DIR = path.join(__dirname, '../seed-data/Cloudinary-assets');

async function seedCloudinary() {
  try {
    console.log('📡 Seeding 60 images to Cloudinary from seed-data/Cloudinary-assets/ ...');
    const folders = ['products', 'banners', 'blog', 'logo_without_name'];

    for (const folder of folders) {
      const subDir = path.join(SOURCE_DIR, folder);
      if (!fs.existsSync(subDir)) continue;

      const files = fs.readdirSync(subDir);
      for (const file of files) {
        const filePath = path.join(subDir, file);
        const fileName = path.parse(file).name;
        
        let publicId = `quickzy/${folder}/${fileName}`;
        if (folder === 'logo_without_name') publicId = `quickzy/brand/${fileName}`;

        console.log(`📤 Uploading [${file}] to ${publicId}...`);
        await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
          resource_type: 'auto'
        });
      }
    }
    console.log('\n✅ Cloudinary Seeding Complete!');
  } catch (err) { console.error('❌ Seeding failed:', err); }
}

seedCloudinary();
