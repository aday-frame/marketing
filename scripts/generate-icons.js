/**
 * Generates the complete favicon / app-icon set for frameops.io
 *
 * Output (all go into assets/):
 *   favicon-16x16.png
 *   favicon-32x32.png
 *   icon-192x192.png
 *   icon-512x512.png
 *   icon-512x512-maskable.png
 *   apple-touch-icon.png   ← paper background variant per brand spec
 *
 * Root copies (browsers look here first):
 *   favicon.ico            (copy of 32px PNG — browsers accept PNG in .ico slot)
 *   apple-touch-icon.png
 */

'use strict';
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

/* ── SVG sources ─────────────────────────────────────── */

// Dark-background variant (favicons, PWA icons, maskable)
const svgDark = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0A0E1A"/>
  <rect x="112" y="172" width="288" height="32" rx="16" fill="white" fill-opacity="0.22"/>
  <rect x="112" y="240" width="196" height="32" rx="16" fill="white" fill-opacity="0.55"/>
  <rect x="112" y="308" width="122" height="32" rx="16" fill="#FF6A00"/>
</svg>`;

// Maskable variant — full-bleed dark fill so Android safe-area mask looks right
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0A0E1A"/>
  <rect x="112" y="172" width="288" height="32" rx="16" fill="white" fill-opacity="0.22"/>
  <rect x="112" y="240" width="196" height="32" rx="16" fill="white" fill-opacity="0.55"/>
  <rect x="112" y="308" width="122" height="32" rx="16" fill="#FF6A00"/>
</svg>`;

// Paper-background variant — used for apple-touch-icon per brand spec
// Dark ink bars so the F-mark reads on the warm paper background
const svgPaper = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#F1EDE4"/>
  <rect x="112" y="172" width="288" height="32" rx="16" fill="#0A0E1A" fill-opacity="0.22"/>
  <rect x="112" y="240" width="196" height="32" rx="16" fill="#0A0E1A" fill-opacity="0.55"/>
  <rect x="112" y="308" width="122" height="32" rx="16" fill="#FF6A00"/>
</svg>`;

/* ── Icon manifest ───────────────────────────────────── */
const icons = [
  // Standard favicons → assets/
  { dest: path.join(ASSETS_DIR, 'favicon-16x16.png'), size: 16,  svg: svgDark },
  { dest: path.join(ASSETS_DIR, 'favicon-32x32.png'), size: 32,  svg: svgDark },
  // PWA icons → assets/
  { dest: path.join(ASSETS_DIR, 'icon-192x192.png'),           size: 192, svg: svgDark },
  { dest: path.join(ASSETS_DIR, 'icon-512x512.png'),           size: 512, svg: svgDark },
  { dest: path.join(ASSETS_DIR, 'icon-512x512-maskable.png'),  size: 512, svg: svgMaskable },
  // Apple touch icon → assets/ (paper background per brand spec)
  { dest: path.join(ASSETS_DIR, 'apple-touch-icon.png'),       size: 180, svg: svgPaper },
];

(async () => {
  for (const icon of icons) {
    await sharp(Buffer.from(icon.svg))
      .resize(icon.size, icon.size)
      .png()
      .toFile(icon.dest);
    console.log(`✓  ${icon.dest}`);
  }

  // favicon.ico — browsers look for this at the root
  const ico32 = path.join(ASSETS_DIR, 'favicon-32x32.png');
  const favicoRoot = path.join(__dirname, '..', 'favicon.ico');
  fs.copyFileSync(ico32, favicoRoot);
  console.log(`✓  ${favicoRoot}  (copy of 32px PNG)`);

  // apple-touch-icon.png at root (fallback for older iOS)
  const atiRoot = path.join(__dirname, '..', 'apple-touch-icon.png');
  fs.copyFileSync(path.join(ASSETS_DIR, 'apple-touch-icon.png'), atiRoot);
  console.log(`✓  ${atiRoot}  (root copy)`);

  console.log('\nAll icons generated.');
})().catch(e => { console.error(e); process.exit(1); });
