/**
 * Generates OG social images for frameops.io
 *
 * Output:
 *   assets/og-image.jpg        1200×630  (Twitter/LinkedIn/Facebook)
 *   assets/og-image-square.jpg 1080×1080 (Instagram/profile)
 */

'use strict';
const sharp = require('sharp');
const path  = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');
const PHOTO  = path.join(ASSETS, 'sd90-underway.jpeg');

/* ── Brand colours ─────────────────────────────────────── */
const INK    = '#0A0E1A';
const PAPER  = '#F1EDE4';
const ORANGE = '#FF6A00';

/* ── SVG overlay factory ────────────────────────────────
   Produces the gradient + F-mark + headline text layer.
   All measurements are in image-pixels so the result is
   crisp at every output size.
────────────────────────────────────────────────────────── */
function makeSVG(w, h, layout) {
  const {
    mX, mY,             // F-mark top-left
    mW,                 // F-mark full-bar width (px)
    mH, mGap,          // bar height, inter-bar gap
    brandX, brandY,    // FRAME wordmark baseline
    brandSize,         // wordmark font-size
    h1Y, h2Y, h3Y,    // headline line baselines
    headSize,          // headline font-size
    headTracking,      // headline letter-spacing
    footY,             // footer label baseline
    footSize,          // footer font-size
  } = layout;

  return Buffer.from(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- left → right: deep dark to transparent (text legibility zone) -->
    <linearGradient id="gL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${INK}" stop-opacity="0.94"/>
      <stop offset="52%"  stop-color="${INK}" stop-opacity="0.74"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.15"/>
    </linearGradient>
    <!-- top → bottom: subtle darkening at base -->
    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${INK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.46"/>
    </linearGradient>
  </defs>

  <!-- gradient overlays -->
  <rect width="${w}" height="${h}" fill="url(#gL)"/>
  <rect width="${w}" height="${h}" fill="url(#gB)"/>

  <!-- ── F-mark (3 bars) ── -->
  <rect x="${mX}" y="${mY}"              width="${mW}"          height="${mH}" rx="${mH/2}" fill="white"       fill-opacity="0.22"/>
  <rect x="${mX}" y="${mY + mGap}"       width="${mW * 0.68}"   height="${mH}" rx="${mH/2}" fill="white"       fill-opacity="0.55"/>
  <rect x="${mX}" y="${mY + mGap * 2}"   width="${mW * 0.42}"   height="${mH}" rx="${mH/2}" fill="${ORANGE}"/>

  <!-- ── FRAME wordmark ── -->
  <text x="${brandX}" y="${brandY}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${brandSize}" font-weight="700" letter-spacing="${Math.round(brandSize * 0.28)}"
    fill="white">FRAME</text>

  <!-- ── Headline ── -->
  <text x="${mX}" y="${h1Y}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${headSize}" font-weight="400" letter-spacing="${headTracking}"
    fill="${PAPER}">Built for</text>

  <text x="${mX}" y="${h2Y}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${headSize}" font-weight="400" letter-spacing="${headTracking}"
    fill="rgba(241,237,228,0.50)">private</text>

  <text x="${mX}" y="${h3Y}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${headSize}" font-weight="400" letter-spacing="${headTracking}"
    fill="${ORANGE}">operations.</text>

  <!-- ── Footer label ── -->
  <text x="${mX}" y="${footY}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${footSize}" font-weight="600" letter-spacing="${Math.round(footSize * 0.28)}"
    fill="rgba(241,237,228,0.36)">PRIVATE OPERATIONS PLATFORM</text>
</svg>`);
}

/* ── Layout presets ─────────────────────────────────────── */

// 1200 × 630 — landscape OG card
const LAYOUT_1200 = {
  mX: 72,  mY: 68,  mW: 56, mH: 7, mGap: 13,
  brandX: 142, brandY: 90, brandSize: 17,
  headSize: 90, headTracking: -2,
  h1Y: 232, h2Y: 338, h3Y: 444,
  footY: 598, footSize: 11,
};

// 1080 × 1080 — square social card
const LAYOUT_1080 = {
  mX: 80,  mY: 80,  mW: 56, mH: 7, mGap: 13,
  brandX: 150, brandY: 102, brandSize: 17,
  headSize: 88, headTracking: -2,
  h1Y: 430, h2Y: 534, h3Y: 638,
  footY: 1020, footSize: 11,
};

/* ── Render ─────────────────────────────────────────────── */
async function render(outFile, w, h, layout) {
  const overlay = makeSVG(w, h, layout);

  await sharp(PHOTO)
    .resize({ width: w, height: h, fit: 'cover', position: 'center' })
    .composite([{ input: overlay, blend: 'over' }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outFile);

  console.log(`✓  ${outFile}  (${w}×${h})`);
}

(async () => {
  await render(path.join(ASSETS, 'og-image.jpg'),        1200, 630,  LAYOUT_1200);
  await render(path.join(ASSETS, 'og-image-square.jpg'), 1080, 1080, LAYOUT_1080);
  console.log('\nOG images done.');
})().catch(e => { console.error(e); process.exit(1); });
