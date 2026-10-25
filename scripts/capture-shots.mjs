// Saves a preview picture of every project into website/shots/.
// Run on your own computer (needs Node 18+):  npm i playwright && npx playwright install chromium && node scripts/capture-shots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const SITES = {
  sojourn: 'https://sojourn.ng',
  qumi: 'https://qumifashion.com/',
  citygirl: 'https://citygirlwardrobe-bw-3.vercel.app/',
  primusige: 'https://primusige.com',
  driversatwork: 'https://drivers-work.vercel.app/',
  sequencepro: 'https://sequence-pro-ah4k.vercel.app/',
  neoconsult: 'https://www.theneoconsult.com/',
  ekostreets: 'https://eko-streets.onrender.com/',
};

mkdirSync('website/shots', { recursive: true });
const browser = await chromium.launch();
for (const [slug, url] of Object.entries(SITES)) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3500); // let intros / hero animations settle
    await page.screenshot({ path: `website/shots/${slug}.jpg`, type: 'jpeg', quality: 82 });
    console.log('saved', slug);
  } catch (e) { console.log('FAILED', slug, e.message); }
  await page.close();
}
await browser.close();
