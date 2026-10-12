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
  panel's middle, in front of it) in the theme's colour, plus a dim fill and,
  optionally, a light from above (`top`, e.g. daylight or a waterfall's glow).
*/
export function lights(scene, { centre, colour, intensity, fill = ['#29323d', '#140c06'], fillIntensity = 0.5, front = 0.35, top }) {
  const key = new THREE.PointLight(colour, intensity, 0, 1);
  key.position.set(...centre);
  // A soft light from the viewer's side, so slopes facing away aren't black.
  const soft = new THREE.DirectionalLight(colour, front);
  soft.position.set(0, 0, 1);
  scene.add(key, soft, new THREE.HemisphereLight(fill[0], fill[1], fillIntensity));
  if (top) {
    const above = new THREE.DirectionalLight(top.colour, top.intensity);
    above.position.set(0.2, 1, 0.7);
    scene.add(above);
  }
}

/*
  The rim: a square ring with a rounded, lumpy profile and rough inner and
  outer edges. Along each edge the shape repeats every RIM_SIZE - 2 x RIM_WIDTH,
  so the 9-slice image tiles (border-image `round`).
  `band` draws only the rim's inner part instead (e.g. a line of moss on the
  bark): from `from` (0-1 across the rim, wobbling by `wobble`) to the inner
  edge, raised by `lift`. Same seed, same rim shape. Lights come with `lit`.
*/
export async function rim(scene, { material, seed = 1, height = 3, lit, band }) {
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
    const u = (d - o) / (i - o);
    if (!band) return { u, t, w: i - o };
    const f = band.from + band.wobble * bandEdge(t);
    return { u: (u - f) / (1 - f), t, w: (i - o) * (1 - f) };
  };
  const bandEdge = periodicNoise(seed + 3, L, 14);

  const geometry = new THREE.PlaneGeometry(S, S, S * 2, S * 2);
  const pos = geometry.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k) + S / 2, y = pos.getY(k) + S / 2;
    const { u, t } = across(x, y);
    const c = Math.min(1, Math.max(0, u));
    pos.setZ(k, (band?.lift ?? 0) + height * Math.sin(Math.PI * c) ** 0.9 * (0.8 + 0.35 * swell(t)));
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
      const { u, w } = across((px + 0.5) / SUPERSAMPLE, S - (py + 0.5) / SUPERSAMPLE);
      const edge = Math.min(u, 1 - u) * w * SUPERSAMPLE;
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
  if (lit) lights(scene, { centre: [S / 2, S / 2, 70], ...lit });
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

// A lumpy mound (rock, a cushion of moss…), so ornaments grow out of the rim. `down` turns it over.
export function mound(material, x, y, w, h, seed, down) {
  const n = noise3(seed);
  const g = new THREE.SphereGeometry(1, 32, 16);
  const pos = g.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const f = 1 + 0.25 * n(pos.getX(k) * 2, pos.getY(k) * 2, pos.getZ(k) * 2);
    pos.setXYZ(k, pos.getX(k) * w * f, pos.getY(k) * h * f, pos.getZ(k) * h * 1.2 * f);
  }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, material([w * 4, h * 4]));
  m.position.set(x, y, 0);
  if (down) m.rotation.z = Math.PI;
  return m;
}

/*
  A gnarled, tapering limb (a branch, a root, a vine) along `points` ([x, y, z]
  in CSS px), from `radius[0]` at the start to `radius[1]` at the end.
*/
export function limb({ points, radius, seed, lump = 0.22, radial = 14 }) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const length = curve.getLength();
  const tubular = Math.max(24, Math.round(length / 1.5));
  const geometry = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const n = noise3(seed);
  const pos = geometry.attributes.position;
  const centre = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const s = i / tubular;
    curve.getPointAt(s, centre);
    const r = radius[0] + (radius[1] - radius[0]) * s ** 0.8;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      const v = new THREE.Vector3(pos.getX(k), pos.getY(k), pos.getZ(k)).sub(centre);
      const f = r * (1 + lump * n(pos.getX(k) * 0.3, pos.getY(k) * 0.3, j * 0.6));
      v.multiplyScalar(f).add(centre);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  geometry.computeVertexNormals();
  return { geometry, curve, length };
}

/*
  Leaves from a CC0 leaf atlas (ambientCG LeafSet…): `rects` are each leaf's
  box in the atlas ([x, y, w, h] px of `size`), tip up, stem at the bottom.
  Returns make(index, height) → a slightly curled leaf, its stem at the origin.
*/
export async function atlasLeaves(id, rects, { size = 1024, tint = '#ffffff', roughness = 0.6, curl = 0.035 } = {}) {
  const maps = await Promise.all([texture(id, 'Color', true), texture(id, 'NormalGL'), texture(id, 'Opacity'), texture(id, 'Roughness')]);
  return (index, height) => {
    const [x, y, w, h] = rects[index % rects.length];
    const width = (height * w) / h;
    const ms = maps.map((m) => {
      const t = m.clone();
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.repeat.set(w / size, h / size);
      t.offset.set(x / size, 1 - (y + h) / size);
      t.needsUpdate = true;
      return t;
    });
    const material = new THREE.MeshStandardMaterial({ map: ms[0], normalMap: ms[1], alphaMap: ms[2], roughnessMap: ms[3], roughness, color: tint, alphaTest: 0.5, side: THREE.DoubleSide });
    const geometry = new THREE.PlaneGeometry(width, height, 8, 8);
    geometry.translate(0, height / 2, 0);
    // Curled along the midrib and a little towards the tip.
    const pos = geometry.attributes.position;
    for (let k = 0; k < pos.count; k++) pos.setZ(k, -curl * pos.getX(k) ** 2 - 0.02 * pos.getY(k) ** 2 / height);
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry, material);
  };
}

// Colours by distance (0-1) through a list of stops, for banded or shaded parts.
function shade(geometry, stops, at) {
  const pos = geometry.attributes.position;
  const colours = [];
  const c = new THREE.Color(), a = new THREE.Color(), b = new THREE.Color();
  for (let k = 0; k < pos.count; k++) {
    const t = Math.min(0.999, Math.max(0, at(pos.getX(k), pos.getY(k), pos.getZ(k)))) * (stops.length - 1);
    const i = Math.floor(t);
    c.copy(a.set(stops[i])).lerp(b.set(stops[i + 1]), t - i);
    colours.push(c.r, c.g, c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3));
}

/*
  A bracket fungus: a banded half-shelf growing out of a trunk towards the
  viewer, tilted up so its top shows. Its attachment is at the origin.
*/
export function bracket({ radius, seed, bands = ['#2a2019', '#4c3f31', '#665a48', '#857a66'], tilt = -0.95 }) {
  const n = noise3(seed);
  const geometry = new THREE.SphereGeometry(radius, 28, 8, 0, Math.PI, 0, Math.PI);
  const pos = geometry.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k);
    const f = 1 + 0.12 * n(x * 0.5, 0, z * 0.5);
    pos.setXYZ(k, x * f, y * 0.26 + 0.04 * (x * x + z * z) / radius, z * f);
  }
  geometry.computeVertexNormals();
  // Bands from the attachment out to a pale rim.
  shade(geometry, bands.concat(bands.slice(1)), (x, y, z) => Math.hypot(x, z) / radius);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }));
  mesh.rotation.x = tilt;
  return mesh;
}

// A small capped mushroom (a bonnet, an inkcap…), its base at the origin, growing up +y.
export function mushroom({ height, cap, seed, colour = '#6e5a44', stem = '#6c6456', lean = 0 }) {
  const rnd = random(seed);
  const group = new THREE.Group();
  const s = new THREE.Mesh(new THREE.CylinderGeometry(cap * 0.16, cap * 0.24, height, 10, 4), new THREE.MeshStandardMaterial({ color: stem, roughness: 0.7 }));
  s.position.y = height / 2;
  const capGeometry = new THREE.SphereGeometry(cap, 24, 10, 0, Math.PI * 2, 0, Math.PI * (0.38 + rnd() * 0.12));
  capGeometry.scale(1, 0.75 + rnd() * 0.5, 1);
  // Darker at the crown, pale at the edge.
  shade(capGeometry, [new THREE.Color(colour).multiplyScalar(0.62).getStyle(), colour, '#8d7f69'], (x, y, z) => Math.hypot(x, z) / cap);
  const c = new THREE.Mesh(capGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, side: THREE.DoubleSide }));
  const top = capGeometry.boundingBox ?? (capGeometry.computeBoundingBox(), capGeometry.boundingBox);
  c.position.y = height - top.min.y * 0.6;
  group.add(s, c);
  group.rotation.z = lean;
  return group;
}
