# Mission Control redesign — frameops.io

**Date:** 2026-06-09
**Status:** Approved by Albert (direction A prototype, iterated: no boot screen, decluttered mobile, deep pages linked)
**Reference:** `proto-mission-control.html` (homepage prototype, kept until merge)

## Goal

Replace the cream-paper editorial design with a dark "mission control" design (SpaceX-caliber) across all pages: `index.html`, `vessels/index.html`, `properties/index.html`. All existing content/copy is preserved and translated into the new language — nothing is dropped.

## Design system

**Tokens**
- Background: `--void #04060B`, panels `#070B12` / `#0A0F18`
- Rules: `rgba(255,255,255,.08)` and `.04`
- Text: `--white #F4F4F0`, dim `rgba(244,244,240,.55)`, faint `.34`
- Accents: orange `#FF6A00` (brand, kept), green `#2FD96E` (nominal), amber `#E8A352` (attention), red `#E24B4A` (overdue)
- Type: **Archivo** 500–900 for display (uppercase, tight tracking, ghost-outline variant via `-webkit-text-stroke`), **IBM Plex Mono** for telemetry, labels, small body. Cormorant Garamond is retired.

**Recurring motifs**
- Fixed dark nav: `FRAME_` brand (blinking cursor), center status `● ALL SYSTEMS NOMINAL`, live UTC clock, `REQUEST ACCESS` outline CTA, sign-in (→ app.frameops.io), mobile menu overlay
- Orange scroll-progress bar; faint vertical gridlines (desktop only)
- HUD corner brackets on featured panels; status dots; mono labels with wide tracking
- Telemetry panels: label + mono value + animated bar; count-up numbers on scroll
- Photo treatment: desaturated/darkened with gradient falloff + mono caption tag (e.g. `VSL-02 · UNDERWAY`)
- Numbering: sections `SEC / 0n`, systems `SYS-0n`, modules `MOD-0n`
- Ops ticker (homepage only)
- Scroll reveals (IntersectionObserver), `prefers-reduced-motion` respected

**Architecture**
- Shared `assets/mission.css` (design system) + `assets/mission.js` (nav, clock, reveals, count-up, mobile menu). Page-specific CSS stays inline per page.
- Static HTML, no frameworks. React/Babel dev scripts removed from index.html.
- All SEO head matter preserved per page (title, description, OG, canonical, favicons); `theme-color` → `#04060B`.

## Pages

**index.html** — from prototype: hero (EVERY ASSET. / ONE COMMAND. + SD90 photo + portfolio telemetry panel), ops ticker, three systems rows (Estates → `properties/`, Vessels → `vessels/`, Aircraft `◐ IN DEVELOPMENT — Q3 2026`, unlinked; photo slot awaiting aircraft image from Albert), 14-module console grid, count-up stats band ($50B+ / 14 / 98.2% / 24/7), REQUEST ACCESS finale, console footer.

**vessels/index.html** — same content, restyled: hero with Lady M photo + vessel data plaque as HUD telemetry panel; readiness brief (owner arrives 14:00) as countdown checklist; PMS ledger as mono ledger with status-coded rows (over/up/done); procedure trace as numbered vertical sequence; logbook entries as terminal-style log; knowledge strata; risk command cards; onboarding CTA + spec table.

**properties/index.html** — same content, restyled: hero with Aspen photo + `EST-01 · ASPEN` plaque; arrival readiness rows with status pills; paper→indexed→guided knowledge transition; vendor/staff roster as access-control manifest; seasonal operations timeline; risk cards; onboarding CTA + spec table.

**Mobile:** full-bleed dimmed hero photo, trimmed telemetry (top rows only), descriptions collapse, no gridlines. Verified at 375px.

## Out of scope (later)

- Aircraft deep page (waiting on photo + launch)
- Real telemetry data feeds (current numbers are illustrative)
- OG image regeneration to match new design (`scripts/generate-og-images.js`)

## Ship plan

Build on branch `redesign/mission-control`, verify locally (desktop + mobile, all 3 pages), Albert reviews in browser, merge + push to deploy via Vercel only on his go.
