/**
 * Generates OG social images for frameops.io — MISSION CONTROL edition
 *
 * Output:
 *   assets/og-image.jpg        1200×630  (Twitter/LinkedIn/Facebook/iMessage)
 *   assets/og-image-square.jpg 1080×1080 (Instagram/profile)
 */

'use strict';
const sharp = require('sharp');
const path  = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');
const PHOTO  = path.join(ASSETS, 'sd90-underway.jpeg');

/* ── Brand colours (mission control) ───────────────────── */
const VOID   = '#04060B';
const WHITE  = '#F4F4F0';
const ORANGE = '#FF6A00';
const GREEN  = '#2FD96E';

const DISPLAY = `'Arial Black', 'Helvetica Neue', Arial, sans-serif`;
const MONO    = `'Courier New', Courier, monospace`;

/* ── SVG overlay factory ────────────────────────────────── */
function makeSVG(w, h, L) {
  const {
    pad,                  // outer padding
    eyebrowY, eyebrowSize,
    h1Y, h2Y, headSize,   // headline baselines + size
    subY, subSize,        // sub line
    brandSize,
  } = L;

  const bracket = 34;     // HUD corner bracket arm length
  const bStroke = 5;

  return Buffer.from(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${VOID}" stop-opacity="0.96"/>
      <stop offset="55%"  stop-color="${VOID}" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="${VOID}" stop-opacity="0.30"/>
    </linearGradient>
    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${VOID}" stop-opacity="0.55"/>
      <stop offset="35%"  stop-color="${VOID}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${VOID}" stop-opacity="0.62"/>
    </linearGradient>
  </defs>

  <!-- gradient overlays -->
  <rect width="${w}" height="${h}" fill="url(#gL)"/>
  <rect width="${w}" height="${h}" fill="url(#gB)"/>

  <!-- faint vertical gridlines -->
  <rect x="${w * 0.25}" y="0" width="1.5" height="${h}" fill="white" fill-opacity="0.06"/>
  <rect x="${w * 0.50}" y="0" width="1.5" height="${h}" fill="white" fill-opacity="0.06"/>
  <rect x="${w * 0.75}" y="0" width="1.5" height="${h}" fill="white" fill-opacity="0.06"/>

  <!-- HUD corner brackets -->
  <path d="M ${pad} ${pad + bracket} V ${pad} H ${pad + bracket}" fill="none" stroke="${ORANGE}" stroke-width="${bStroke}"/>
  <path d="M ${w - pad - bracket} ${h - pad} H ${w - pad} V ${h - pad - bracket}" fill="none" stroke="${ORANGE}" stroke-width="${bStroke}"/>

  <!-- ── FRAME_ wordmark (top, inside bracket) ── -->
  <text x="${pad + 28}" y="${pad + 30}"
    font-family="${DISPLAY}" font-size="${brandSize}" font-weight="900" letter-spacing="${Math.round(brandSize * 0.30)}"
    fill="${WHITE}">FRAME</text>
  <text x="${pad + 28 + brandSize * 5.7}" y="${pad + 30}"
    font-family="${DISPLAY}" font-size="${brandSize}" font-weight="900"
    fill="${ORANGE}">_</text>

  <!-- live dot, top right -->
  <circle cx="${w - pad - 150}" cy="${pad + 22}" r="7" fill="${GREEN}"/>
  <text x="${w - pad - 130}" y="${pad + 30}"
    font-family="${MONO}" font-size="20" font-weight="bold" letter-spacing="4"
    fill="rgba(244,244,240,0.6)">LIVE</text>

  <!-- ── eyebrow ── -->
  <rect x="${pad}" y="${eyebrowY - 9}" width="44" height="6" fill="${ORANGE}"/>
  <text x="${pad + 62}" y="${eyebrowY}"
    font-family="${MONO}" font-size="${eyebrowSize}" font-weight="bold" letter-spacing="${Math.round(eyebrowSize * 0.32)}"
    fill="${ORANGE}">MISSION: PRIVATE OPERATIONS</text>

  <!-- ── headline ── -->
  <text x="${pad - 6}" y="${h1Y}"
    font-family="${DISPLAY}" font-size="${headSize}" font-weight="900" letter-spacing="-3"
    fill="${WHITE}">EVERY ASSET.</text>

  <text x="${pad - 6}" y="${h2Y}"
    font-family="${DISPLAY}" font-size="${headSize}" font-weight="900" letter-spacing="-3"
    fill="none" stroke="rgba(244,244,240,0.55)" stroke-width="2.5">ONE COMMAND.</text>

  <!-- ── sub line ── -->
  <text x="${pad}" y="${subY}"
    font-family="${MONO}" font-size="${subSize}" font-weight="bold" letter-spacing="${Math.round(subSize * 0.18)}"
    fill="rgba(244,244,240,0.78)">ESTATES &#183; VESSELS &#183; AIRCRAFT &#8212; <tspan fill="${ORANGE}">$50B+</tspan> UNDER OPERATION</text>

  ${L.showUrl ? `<text x="${w - pad - 28}" y="${h - pad - 26}" text-anchor="end"
    font-family="${MONO}" font-size="22" font-weight="bold" letter-spacing="5"
    fill="rgba(244,244,240,0.55)">FRAMEOPS.IO</text>` : ''}
</svg>`);
}

/* ── Layout presets ─────────────────────────────────────── */

// 1200 × 630 — landscape OG card
const LAYOUT_1200 = {
  pad: 64,
  brandSize: 26,
  eyebrowY: 248, eyebrowSize: 21,
  headSize: 108, h1Y: 366, h2Y: 478,
  subY: 545, subSize: 21,
  showUrl: false,
};

// 1080 × 1080 — square social card
const LAYOUT_1080 = {
  pad: 72,
  brandSize: 26,
  eyebrowY: 524, eyebrowSize: 21,
  headSize: 96, h1Y: 632, h2Y: 732,
  subY: 800, subSize: 19,
  showUrl: true,
};

/* ── Render ─────────────────────────────────────────────── */
async function render(outFile, w, h, layout) {
  const overlay = makeSVG(w, h, layout);

  await sharp(PHOTO)
    .resize({ width: w, height: h, fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.72, saturation: 0.82 })
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
