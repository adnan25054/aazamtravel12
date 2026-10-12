import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

async function generateAssets() {
  console.log('Generating high-resolution PNG brand assets with sharp...');
  
  const iconSvgPath = path.join(publicDir, 'logo-icon.svg');
  const ogSvgPath = path.join(publicDir, 'og-image.svg');
  
  const iconSvg = fs.readFileSync(iconSvgPath);
  const ogSvg = fs.readFileSync(ogSvgPath);

  // 1. Google Search 48x48 Favicon (as mandated by Google Search Favicon guidelines)
  await sharp(iconSvg)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon-48x48.png'));
  console.log('✓ Created public/favicon-48x48.png');

  // 2. Apple Touch Icon 180x180
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created public/apple-touch-icon.png');

  // 3. Android PWA Icon 192x192
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo-192x192.png'));
  console.log('✓ Created public/logo-192x192.png');

  // 4. Schema.org / High-res Icon 512x512
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-512x512.png'));
  console.log('✓ Created public/logo-512x512.png');

  // 5. OpenGraph & Twitter Social Card 1200x630
  await sharp(ogSvg)
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ Created public/og-image.png');

  // 6. Copy 48x48 png to favicon.ico fallback for standard browsers
  const favicon48Buffer = await sharp(iconSvg).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon48Buffer);
  console.log('✓ Created public/favicon.ico');

  console.log('All image assets generated successfully!');
}

generateAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
