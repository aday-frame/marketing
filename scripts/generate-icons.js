const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICONS_DIR = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

// F-mark SVG — same design as favicon.svg, but larger base for PNG rendering
const svgSource = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0A0E1A"/>
  <rect x="112" y="172" width="288" height="32" rx="16" fill="white" fill-opacity="0.22"/>
  <rect x="112" y="240" width="196" height="32" rx="16" fill="white" fill-opacity="0.55"/>
  <rect x="112" y="308" width="122" height="32" rx="16" fill="#FF6A00"/>
</svg>`;

// Maskable version — icon fills more of the canvas for Android's safe-area mask
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0A0E1A"/>
  <rect x="112" y="172" width="288" height="32" rx="16" fill="white" fill-opacity="0.22"/>
  <rect x="112" y="240" width="196" height="32" rx="16" fill="white" fill-opacity="0.55"/>
  <rect x="112" y="308" width="122" height="32" rx="16" fill="#FF6A00"/>
</svg>`;

const icons = [
  { name: 'icon-192.png',          size: 192,  svg: svgSource },
  { name: 'icon-512.png',          size: 512,  svg: svgSource },
  { name: 'icon-512-maskable.png', size: 512,  svg: svgMaskable },
  { name: 'apple-touch-icon.png',  size: 180,  svg: svgSource },
  { name: 'apple-touch-icon-167.png', size: 167, svg: svgSource },
  { name: 'apple-touch-icon-152.png', size: 152, svg: svgSource },
  { name: 'apple-touch-icon-120.png', size: 120, svg: svgSource },
  { name: 'favicon-32.png',        size: 32,   svg: svgSource },
  { name: 'favicon-16.png',        size: 16,   svg: svgSource },
];

(async () => {
  for (const icon of icons) {
    const dest = icon.name === 'apple-touch-icon.png'
      ? path.join(__dirname, '..', icon.name)
      : path.join(ICONS_DIR, icon.name);
    await sharp(Buffer.from(icon.svg))
      .resize(icon.size, icon.size)
      .png()
      .toFile(dest);
    console.log(`✓ ${dest}`);
  }

  // favicon.ico = 32px png renamed (browsers accept PNG in .ico slot)
  const ico32 = path.join(ICONS_DIR, 'favicon-32.png');
  const faviconDest = path.join(__dirname, '..', 'favicon.ico');
  fs.copyFileSync(ico32, faviconDest);
  console.log(`✓ favicon.ico`);

  console.log('\nAll icons generated.');
})();
