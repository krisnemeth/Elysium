// Adds images from the official Dark Pack asset pack to the image library.
//
//   node scripts/add-library-images.mts <manifest.json> [--dry-run]
//
// The asset pack is extracted (git-ignored) in brand-assets/ at the repo root.
// The manifest lists the images to add, with paths relative to brand-assets/:
//
//   [
//     { "file": "Illustrations/Locations/some-haven.jpg",
//       "label": "Rooftop haven",          // what the picker shows
//       "game": "vampire",                  // vampire | werewolf | hunter | any
//       "kind": "location",                 // character | antagonist | location | scene
//       "tags": ["rooftop", "city"],        // optional, free-form
//       "id": "rooftop-haven" }             // optional; default: the file's name
//   ]
//
// For each entry the script
//   1. checks the pack's terms: the image has to come from brand-assets/ (the
//      official pack), never from elsewhere; entries are recorded as
//      source "dark-pack". Skim brand-assets/README.md first: some pack files
//      (fonts, logos, a few illustrations) carry extra conditions. Leave those
//      out of the manifest.
//   2. converts it to WebP into public/library/<kind>/<id>.webp: characters
//      and antagonists at most 1200 × 1600, locations and scenes at most 2400
//      wide (quality 82). Existing files are overwritten.
//   3. appends an entry to app/lib/image-library-pack.json (the library merges
//      it with the built-in list in app/lib/image-library.ts). An entry with the
//      same id is replaced, so re-running with a fixed manifest is safe.
//
// Needs `sharp`, which Next.js already installs; run `npm install` first. No
// new dependency is added to package.json. Runs with Node's built-in
// TypeScript support (Node 24).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PACK_DIR = join(ROOT, 'brand-assets');
const OUT_DIR = join(ROOT, 'public', 'library');
const DATA_FILE = join(ROOT, 'app', 'lib', 'image-library-pack.json');

const GAMES = ['vampire', 'werewolf', 'hunter', 'any'];
const KINDS = ['character', 'antagonist', 'location', 'scene'];
const TALL = new Set(['character', 'antagonist']);
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

type Entry = { file: string; label: string; game: string; kind: string; tags?: string[]; id?: string };
type LibraryImage = { id: string; src: string; label: string; game: string; kind: string; source: 'dark-pack'; tags?: string[]; width: number; height: number };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const manifestPath = args.find((a) => !a.startsWith('--'));

function fail(message: string): never {
  console.error(`add-library-images: ${message}`);
  process.exit(1);
}

if (!manifestPath) fail('usage: node scripts/add-library-images.mts <manifest.json> [--dry-run]');
if (!existsSync(PACK_DIR)) fail('brand-assets/ not found. Extract the Dark Pack asset pack there first (see CLAUDE.md, "Licensing").');

let sharp: typeof import('sharp');
try {
  sharp = (await import('sharp')).default;
} catch {
  fail('the `sharp` package is missing. Run `npm install` (Next.js installs it) and try again.');
}

const entries: Entry[] = JSON.parse(readFileSync(resolve(manifestPath), 'utf8'));
if (!Array.isArray(entries)) fail('the manifest has to be a JSON array.');

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const existing: LibraryImage[] = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')) : [];
const byId = new Map(existing.map((i) => [i.id, i]));

for (const [n, e] of entries.entries()) {
  const where = `entry ${n + 1} (${e.file ?? '?'})`;
  if (!e.file || !e.label) fail(`${where}: "file" and "label" are required.`);
  if (!GAMES.includes(e.game)) fail(`${where}: "game" must be one of ${GAMES.join(', ')}.`);
  if (!KINDS.includes(e.kind)) fail(`${where}: "kind" must be one of ${KINDS.join(', ')}.`);

  // Only files inside the official pack may be added.
  const input = resolve(PACK_DIR, e.file);
  if (relative(PACK_DIR, input).startsWith('..')) fail(`${where}: the file has to be inside brand-assets/.`);
  if (!existsSync(input)) fail(`${where}: not found in brand-assets/.`);
  if (!SOURCE_EXTENSIONS.has(extname(input).toLowerCase())) fail(`${where}: unsupported file type (use JPEG, PNG, WebP or TIFF).`);

  const id = slug(e.id ?? basename(e.file, extname(e.file)));
  if (!id) fail(`${where}: couldn't make an id from that name; set "id".`);
  const out = join(OUT_DIR, e.kind, `${id}.webp`);
  const src = `/library/${e.kind}/${id}.webp`;

  const image = sharp(input).rotate(); // honour EXIF orientation; re-encoding drops the metadata
  const { width = 0, height = 0 } = await image.metadata();
  const box = TALL.has(e.kind) ? { width: 1200, height: 1600 } : { width: 2400, height: 2400 };
  const resized = image.resize({ ...box, fit: 'inside', withoutEnlargement: true });

  if (dryRun) {
    console.log(`would add ${src} (${width}×${height} source)`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    const info = await resized.webp({ quality: 82 }).toFile(out);
    console.log(`added ${src} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
    byId.set(`library/${e.kind}/${id}`, {
      id: `library/${e.kind}/${id}`,
      src,
      label: e.label,
      game: e.game,
      kind: e.kind,
      source: 'dark-pack',
      ...(e.tags?.length ? { tags: e.tags } : {}),
      width: info.width,
      height: info.height,
    });
  }
}

if (!dryRun) {
  writeFileSync(DATA_FILE, JSON.stringify([...byId.values()], null, 2) + '\n');
  console.log(`\nWrote ${byId.size} entries to ${relative(ROOT, DATA_FILE)}. Review the diff, then commit public/library/ and the JSON.`);
}
