const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const TARGET_DIR = path.join(__dirname, '../seed-data/Cloudinary-assets');
if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(); });
      } else { reject(new Error(`Failed ${res.statusCode}`)); }
    }).on('error', reject);
  });
}

// 60 Assets Map
const assetsMapping = [];
for (let i = 1; i <= 49; i++) assetsMapping.push({ pid: `quickzy/products/product-${i}`, folder: 'products' });
for (let i = 1; i <= 5; i++) assetsMapping.push({ pid: `quickzy/banners/hero-banner-${i}`, folder: 'banners' });
assetsMapping.push({ pid: `quickzy/banners/footer-banner`, folder: 'banners' });
for (let i = 1; i <= 4; i++) assetsMapping.push({ pid: `quickzy/blog/blog-post-${i}`, folder: 'blog' });
assetsMapping.push({ pid: `quickzy/logo_without_name`, folder: 'logo_without_name' });

async function fetchAll() {
  try {
    console.log('📡 Downloading 60 images to seed-data/Cloudinary-assets/ ...');
    for (const item of assetsMapping) {
      try {
        let info;
        try {
            info = await cloudinary.api.resource(item.pid, { resource_type: 'image' });
        } catch (e) {
            info = await cloudinary.api.resource(item.pid, { resource_type: 'raw' });
        }

        const subDir = path.join(TARGET_DIR, item.folder);
        if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
        
        const ext = info.format || 'png';
        const filePath = path.join(subDir, `${path.basename(item.pid)}.${ext}`);
        
        console.log(`📥 Downloading ${item.pid}...`);
        await download(info.secure_url, filePath);
      } catch (err) { console.error(`❌ Error ${item.pid}: ${err.message}`); }
    }
    console.log('\n✅ 60 assets downloaded successfully!');
  } catch (err) { console.error('❌ Fetch failed:', err); }
}

fetchAll();
