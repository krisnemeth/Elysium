/*
  The edge studio's shared scene (runs in headless Chrome, see render.mts).

  Every theme's frame is made the same way, so the six feel like one family:
  - a rim: one 9-slice image (the panel's border), the same width and the same
    rounded, lumpy profile for every theme, wrapped in the theme's material;
  - optional ornaments along the top and bottom edges (one wide strip each);
  - one light rig: the light source sits in the middle of the panel, in front
    of it, so every piece is lit from the panel's side, plus a dim fill.
  A theme (themes/<skin>.js) supplies the material, the light's colour and the
  ornaments. Units are CSS pixels; pieces render at `SUPERSAMPLE` x 2.
*/
import * as THREE from 'three';

export const SUPERSAMPLE = 4;
// The rim image: RIM_SIZE square, RIM_WIDTH of it is the border (CSS px).
export const RIM_SIZE = 224;
export const RIM_WIDTH = 16;

// Seeded randomness, so a render is repeatable.
export function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A wobble that repeats every `period` (so a 9-slice edge tiles seamlessly), in about [-1, 1].
export function periodicNoise(seed, period, octaves = 10) {
  const rnd = random(seed);
  const waves = Array.from({ length: octaves }, (_, i) => ({ k: i + 1, a: 1 / (i + 1) ** 0.9, p: rnd() * Math.PI * 2 }));
  const norm = waves.reduce((s, w) => s + w.a, 0) * 0.55;
  return (t) => waves.reduce((s, w) => s + w.a * Math.sin((2 * Math.PI * w.k * t) / period + w.p), 0) / norm;
}

// Smooth 3D value noise in [-1, 1], for lumps on ornaments.
export function noise3(seed) {
  const rnd = random(seed);
  const perm = Array.from({ length: 256 }, (_, i) => i).sort(() => rnd() - 0.5);
  const val = Array.from({ length: 256 }, () => rnd() * 2 - 1);
  const h = (x, y, z) => val[perm[(perm[(perm[x & 255] + y) & 255] + z) & 255]];
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = s(x - xi), yf = s(y - yi), zf = s(z - zi);
    const l = (a, b, t) => a + (b - a) * t;
    return l(
      l(l(h(xi, yi, zi), h(xi + 1, yi, zi), xf), l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), xf), yf),
      l(l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), xf), l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), xf), yf),
      zf,
    );
  };
}

const loader = new THREE.TextureLoader();
const cache = new Map();
async function texture(id, kind, srgb) {
  const key = `${id}/${kind}`;
  if (!cache.has(key)) cache.set(key, loader.loadAsync(`/materials/${key}.jpg`));
  const t = (await cache.get(key)).clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 16;
  t.needsUpdate = true;
  return t;
}

/*
  A CC0 PBR material (ambientCG id) at a given scale: `repeat` texture tiles per
  `size` CSS px, starting at `origin`.
*/
export async function pbr(id, { tile = 192, origin = [0, 0], stretch = [1, 1], tint = '#ffffff', roughness = 1, normalScale = 1.4, ...rest } = {}) {
  const maps = await Promise.all([texture(id, 'Color', true), texture(id, 'NormalGL'), texture(id, 'Roughness'), texture(id, 'AmbientOcclusion')]);
  return (size) => {
    const repeat = [size[0] / tile / stretch[0], size[1] / tile / stretch[1]];
    const ms = maps.map((m) => {
      const t = m.clone();
      t.repeat.set(...repeat);
      t.offset.set((-origin[0] / size[0]) * repeat[0], (-origin[1] / size[1]) * repeat[1]);
      t.needsUpdate = true;
      return t;
    });
    return new THREE.MeshStandardMaterial({
      map: ms[0],
      normalMap: ms[1],
      normalScale: new THREE.Vector2(normalScale, normalScale),
      roughnessMap: ms[2],
      roughness,
      aoMap: ms[3],
      color: tint,
      transparent: true,
      ...rest,
    });
  };
}

/*
  The light rig, the same for every theme: the source sits at `centre` (the
  panel's middle, in front of it) in the theme's colour, plus a dim fill.
*/
export function lights(scene, { centre, colour, intensity, fill = ['#29323d', '#140c06'], fillIntensity = 0.5, front = 0.35 }) {
  const key = new THREE.PointLight(colour, intensity, 0, 1);
  key.position.set(...centre);
  // A soft light from the viewer's side, so slopes facing away aren't black.
  const soft = new THREE.DirectionalLight(colour, front);
  soft.position.set(0, 0, 1);
  scene.add(key, soft, new THREE.HemisphereLight(fill[0], fill[1], fillIntensity));
}

/*
  The rim: a square ring with a rounded, lumpy profile and rough inner and
  outer edges. Along each edge the shape repeats every RIM_SIZE - 2 x RIM_WIDTH,
  so the 9-slice image tiles (border-image `round`).
*/
export async function rim(scene, { material, seed = 1, height = 3, lit }) {
  const S = RIM_SIZE, B = RIM_WIDTH, L = S - 2 * B;
  const inner = periodicNoise(seed, L, 12);
  const outer = periodicNoise(seed + 1, L, 12);
  const swell = periodicNoise(seed + 2, L, 6);
  // Where a point sits across the rim: 0 at the outer edge, 1 at the inner, null outside.
  const across = (x, y) => {
    const d = Math.min(x, y, S - x, S - y);
    const t = d === x || d === S - x ? y - B : x - B;
    const o = 0.6 + 0.6 * outer(t);
    const i = B * (0.74 + 0.2 * inner(t));
    return { u: (d - o) / (i - o), t };
  };

  const geometry = new THREE.PlaneGeometry(S, S, S * 2, S * 2);
  const pos = geometry.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k) + S / 2, y = pos.getY(k) + S / 2;
    const { u, t } = across(x, y);
    const c = Math.min(1, Math.max(0, u));
    pos.setZ(k, height * Math.sin(Math.PI * c) ** 0.9 * (0.8 + 0.35 * swell(t)));
  }
  geometry.computeVertexNormals();

  // The shape itself, exact to the pixel: an alpha map.
  const R = S * SUPERSAMPLE;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = R;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(R, R);
  for (let py = 0; py < R; py++)
    for (let px = 0; px < R; px++) {
      const { u } = across((px + 0.5) / SUPERSAMPLE, S - (py + 0.5) / SUPERSAMPLE);
      const edge = Math.min(u, 1 - u) * B * SUPERSAMPLE * 0.7;
      const a = Math.max(0, Math.min(1, edge + 0.5)) * 255;
      const o = (py * R + px) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = a;
      img.data[o + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  const alpha = new THREE.CanvasTexture(canvas);

  const mesh = new THREE.Mesh(geometry, material([S, S]));
  mesh.material.alphaMap = alpha;
  mesh.position.set(S / 2, S / 2, 0);
  scene.add(mesh);
  lights(scene, { centre: [S / 2, S / 2, 70], ...lit });
}

// A tapering, lumpy spike (a stalactite, a stalagmite, a thorn…) along +y from the origin.
export function spike({ length, radius, seed, power = 1.6, bend = 0, lump = 0.18, segments = 28 }) {
  const n = noise3(seed);
  const rows = Math.max(12, Math.round(length / 1.5));
  const profile = [];
  for (let i = 0; i <= rows; i++) {
    const s = i / rows;
    // A rounded tip, a flared base, rings of flowstone along the way.
    const r = radius * ((1 - s) ** power + 0.06 * Math.sin(s * 9 + seed)) * (1 + 0.35 * Math.max(0, 1 - s * 6) ** 2);
    profile.push(new THREE.Vector2(Math.max(0.05, i === rows ? 0 : r), s * length));
  }
  const geometry = new THREE.LatheGeometry(profile, segments);
  const pos = geometry.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k);
    const s = y / length;
    const f = 1 + lump * n(x * 0.35, y * 0.12, z * 0.35);
    pos.setXYZ(k, x * f + bend * s * s * length * 0.15, y, z * f);
  }
  geometry.computeVertexNormals();
  return geometry;
}
