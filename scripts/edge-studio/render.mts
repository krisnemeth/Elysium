/*
  The edge studio: renders a theme's frame with three.js in headless Chrome and
  saves the pieces as WebP in public/frames/<skin>/ (rim, top, bottom).

    node scripts/edge-studio/render.mts werewolf-light

  The shared scene is studio.js; each theme is themes/<skin>.js. Materials are
  CC0 from ambientCG, downloaded on first use into .cache/ (git-ignored).
  Needs Google Chrome installed.
*/
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const cache = join(here, '.cache');
const SUPERSAMPLE = 4;
// The saved images are twice the CSS size, for high-density screens.
const DENSITY = 2;

const skin = process.argv[2];
if (!skin) {
  console.error('Usage: node scripts/edge-studio/render.mts <skin>  (e.g. werewolf-light)');
  process.exit(1);
}

// ambientCG's 1K JPG set for a material, downloaded once.
const downloads = new Map<string, Promise<string>>();
const material = (id: string) => {
  if (!downloads.has(id)) downloads.set(id, download(id));
  return downloads.get(id)!;
};
async function download(id: string) {
  const dir = join(cache, id);
  if (existsSync(join(dir, 'material.zip'))) return dir;
  mkdirSync(dir, { recursive: true });
  const res = await fetch(`https://ambientcg.com/get?file=${id}_1K-JPG.zip`, { headers: { 'User-Agent': 'Elysium edge studio' } });
  if (!res.ok) throw new Error(`ambientCG ${id}: ${res.status}`);
  const zip = join(dir, 'material.zip');
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-o', '-q', zip, '-d', dir]);
  return dir;
}

const types: Record<string, string> = { js: 'text/javascript', html: 'text/html', jpg: 'image/jpeg' };

const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  page.on('console', (m) => console.log(`[studio] ${m.text()}`));
  page.on('pageerror', (e) => console.error(`[studio] ${e.message}`));
  // Everything is served from disk: the studio, three.js and the materials.
  await page.route('http://studio.local/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let file: string;
    const m = path.match(/^\/materials\/(\w+)\/(\w+)\.jpg$/);
    if (m) file = join(await material(m[1]), `${m[1]}_1K-JPG_${m[2]}.jpg`);
    else if (path === '/three.module.js') file = join(root, 'node_modules/three/build/three.module.js');
    else if (path === '/three.core.js') file = join(root, 'node_modules/three/build/three.core.js');
    else if (path === '/') file = join(here, 'studio.html');
    else file = join(here, path);
    if (!existsSync(file)) return route.fulfill({ status: 404 });
    await route.fulfill({ body: readFileSync(file), contentType: types[file.split('.').pop()!] ?? 'application/octet-stream' });
  });
  await page.goto('http://studio.local/');
  await page.waitForFunction(() => (window as unknown as { studioReady?: boolean }).studioReady);

  const out = join(root, 'public/frames', skin);
  mkdirSync(out, { recursive: true });
  const names: string[] = await page.evaluate((s) => (window as unknown as { pieceNames: (s: string) => Promise<string[]> }).pieceNames(s), skin);
  for (const name of names) {
    const url: string = await page.evaluate(([s, n]) => (window as unknown as { renderPiece: (s: string, n: string) => Promise<string> }).renderPiece(s, n), [skin, name]);
    const png = Buffer.from(url.split(',')[1], 'base64');
    const { width = 0 } = await sharp(png).metadata();
    const file = join(out, `${name}.webp`);
    await sharp(png)
      .resize(Math.round((width / SUPERSAMPLE) * DENSITY), null, { kernel: 'lanczos3' })
      .webp({ quality: 86, alphaQuality: 90, effort: 6 })
      .toFile(file);
    console.log(`${skin}/${name}.webp`);
  }
} finally {
  await browser.close();
}
