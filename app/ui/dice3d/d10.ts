import * as THREE from 'three';
import type { DieKind, Game } from '@/app/lib/dice/rules';

/*
  A real d10: a pentagonal trapezohedron with ten kite-shaped faces.
  Two rings of five vertices sit just above and below the equator, offset by
  36°, between two apexes. The apex height that keeps every kite flat is
  h = a·(1 + cos 36°) / (1 − cos 36°) for ring height a.
*/

const RING_HEIGHT = 0.105;
const COS36 = Math.cos(Math.PI / 5);
const APEX = (RING_HEIGHT * (1 + COS36)) / (1 - COS36);

export type FaceInfo = { value: number; normal: THREE.Vector3; up: THREE.Vector3 };

const ATLAS_COLS = 5;
const ATLAS_ROWS = 2;
const CELL = 256;

const ring = (i: number, offset: number, y: number) => {
  const t = ((i * 72 + offset) * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(t), y, Math.sin(t));
};

// Kite in its own plane, scaled into a texture cell (canvas coords, y down).
type Kite2D = { apex: [number, number]; s1: [number, number]; far: [number, number]; s2: [number, number] };

function buildGeometry() {
  const top = new THREE.Vector3(0, APEX, 0);
  const bottom = new THREE.Vector3(0, -APEX, 0);
  const U = Array.from({ length: 5 }, (_, i) => ring(i, 0, RING_HEIGHT));
  const L = Array.from({ length: 5 }, (_, i) => ring(i, 36, -RING_HEIGHT));

  // [apex, side, far, side, value]
  const kites: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3, number][] = [];
  for (let i = 0; i < 5; i++) {
    kites.push([top, U[i], L[i], U[(i + 1) % 5], 2 * i + 1]);
    kites.push([bottom, L[i], U[(i + 1) % 5], L[(i + 1) % 5], 2 * i + 2]);
  }

  // Each face as seen from outside: apex up, "right" = normal × down-axis.
  const frame = (apex: THREE.Vector3, s1: THREE.Vector3, far: THREE.Vector3, s2: THREE.Vector3) => {
    const centroid = apex.clone().add(s1).add(far).add(s2).multiplyScalar(0.25);
    let normal = s1.clone().sub(apex).cross(far.clone().sub(apex)).normalize();
    if (normal.dot(centroid) < 0) normal = normal.negate();
    const down = far.clone().sub(apex).normalize();
    const right = new THREE.Vector3().crossVectors(normal, down).normalize();
    const to2d = (p: THREE.Vector3) => {
      const d = p.clone().sub(apex);
      return [d.dot(right), d.dot(down)] as [number, number];
    };
    // Left/right side vertices as seen from outside.
    const [left, rightV] = to2d(s1)[0] < to2d(s2)[0] ? [s1, s2] : [s2, s1];
    return { centroid, normal, left, right: rightV, to2d };
  };

  // All kites are congruent: lay one out in a texture cell (canvas px, y down).
  const f0 = frame(...(kites[0].slice(0, 4) as [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]));
  const raw = [f0.to2d(kites[0][0]), f0.to2d(f0.left), f0.to2d(kites[0][2]), f0.to2d(f0.right)];
  const xs = raw.map((p) => p[0]);
  const ys = raw.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs);
  const len = Math.max(...ys) - Math.min(...ys);
  const margin = 0.06 * CELL;
  const scale = Math.min((CELL - 2 * margin) / w, (CELL - 2 * margin) / len);
  const offX = CELL / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * scale;
  const offY = (CELL - len * scale) / 2 - Math.min(...ys) * scale;
  const k = raw.map(([x, y]) => [x * scale + offX, y * scale + offY] as [number, number]);
  const kite2d: Kite2D = { apex: k[0], s1: k[1], far: k[2], s2: k[3] };

  const positions: number[] = [];
  const uvs: number[] = [];
  const faces: FaceInfo[] = [];

  kites.forEach(([apex, s1, far, s2, value]) => {
    const { centroid, normal, left, right } = frame(apex, s1, far, s2);
    const cell = value - 1;
    const col = cell % ATLAS_COLS;
    const row = Math.floor(cell / ATLAS_COLS);
    const uv = ([x, y]: [number, number]) => [(col + x / CELL) / ATLAS_COLS, 1 - (row + y / CELL) / ATLAS_ROWS];

    // Counter-clockwise from outside: apex → left → far, apex → far → right.
    positions.push(...apex.toArray(), ...left.toArray(), ...far.toArray());
    uvs.push(...uv(kite2d.apex), ...uv(kite2d.s1), ...uv(kite2d.far));
    positions.push(...apex.toArray(), ...far.toArray(), ...right.toArray());
    uvs.push(...uv(kite2d.apex), ...uv(kite2d.far), ...uv(kite2d.s2));

    // Upright direction on the face: from its centroid towards the apex.
    const up = apex.clone().sub(centroid);
    up.sub(normal.clone().multiplyScalar(up.dot(normal))).normalize();
    faces.push({ value, normal, up });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return { geometry, faces, kite2d };
}

let built: ReturnType<typeof buildGeometry> | null = null;
export const d10 = () => (built ??= buildGeometry());

/*
  Rotation that turns the face showing `value` towards the camera, upright.
*/
export function faceTowards(value: number, toCamera: THREE.Vector3, screenUp: THREE.Vector3, twist = 0) {
  const face = d10().faces.find((f) => f.value === value)!;
  const q1 = new THREE.Quaternion().setFromUnitVectors(face.normal, toCamera);
  const up = face.up.clone().applyQuaternion(q1);
  const angle = Math.atan2(toCamera.dot(new THREE.Vector3().crossVectors(up, screenUp)), up.dot(screenUp));
  const q2 = new THREE.Quaternion().setFromAxisAngle(toCamera, angle + twist);
  return q2.multiply(q1);
}

// ---------------------------------------------------------------- textures

type Style = { face: string; glyph: string };

// Colours of the official dice for each game.
export const DICE_STYLES: Record<Game, Record<DieKind, Style>> = {
  vampire: {
    regular: { face: '#161618', glyph: '#f3f0ea' },
    special: { face: '#c8102e', glyph: '#141010' },
  },
  werewolf: {
    regular: { face: '#a9a72c', glyph: '#151510' },
    special: { face: '#e8392d', glyph: '#151010' },
  },
  hunter: {
    regular: { face: '#f07a12', glyph: '#151008' },
    special: { face: '#1e1e1e', glyph: '#ff8a1f' },
  },
};

// Which official symbol a face shows.
export function glyphFor(game: Game, kind: DieKind, value: number): string | null {
  const special = kind === 'special';
  switch (game) {
    case 'vampire':
      if (value === 10) return special ? 'vtm-messy.svg' : 'vtm-ankh-crit.svg';
      if (value >= 6) return 'vtm-ankh.svg';
      return special && value === 1 ? 'vtm-skull.svg' : null;
    case 'werewolf':
      if (value === 10) return 'wta-claw-crit.png';
      if (value >= 6) return 'wta-claw.png';
      return special && value <= 2 ? 'wta-fangs.png' : null;
    case 'hunter':
      if (value === 10) return 'htr-flame-crit.png';
      if (value >= 6) return 'htr-flame.png';
      return special && value === 1 ? 'htr-overreach.png' : null;
  }
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(name: string) {
  if (!imageCache.has(name)) {
    imageCache.set(
      name,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `/dice/glyphs/${name}`;
      }),
    );
  }
  return imageCache.get(name)!;
}

// The glyph's visible area (alpha bounding box), so every symbol is placed by
// its actual shape rather than its image padding.
function trimmed(img: HTMLImageElement) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const r = Math.min(size / img.width, size / img.height);
  ctx.drawImage(img, (size - img.width * r) / 2, (size - img.height * r) / 2, img.width * r, img.height * r);
  const { data } = ctx.getImageData(0, 0, size, size);
  let [x0, y0, x1, y1] = [size, size, 0, 0];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (data[(y * size + x) * 4 + 3] > 24) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  return { canvas: c, x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// Largest circle inside the kite (its centre lies on the symmetry axis).
function inscribedCircle(k: Kite2D) {
  const edges: [[number, number], [number, number]][] = [
    [k.apex, k.s1],
    [k.s1, k.far],
    [k.far, k.s2],
    [k.s2, k.apex],
  ];
  const dist = (px: number, py: number, [a, b]: [[number, number], [number, number]]) => {
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    return Math.abs(dy * px - dx * py + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
  };
  const x = k.apex[0];
  let best = { y: 0, r: 0 };
  for (let y = k.apex[1]; y < k.far[1]; y += 0.5) {
    const r = Math.min(...edges.map((e) => dist(x, y, e)));
    if (r > best.r) best = { y, r };
  }
  return { x, y: best.y, r: best.r };
}

const atlasCache = new Map<string, Promise<THREE.CanvasTexture>>();

export function diceAtlas(game: Game, kind: DieKind) {
  const key = `${game}-${kind}`;
  if (!atlasCache.has(key)) {
    atlasCache.set(
      key,
      (async () => {
        const { kite2d } = d10();
        const style = DICE_STYLES[game][kind];
        const canvas = document.createElement('canvas');
        canvas.width = CELL * ATLAS_COLS;
        canvas.height = CELL * ATLAS_ROWS;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = style.face;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Symbols sit in the largest circle that fits the face, scaled by
        // their own outline. The printed dice carry no numbers.
        const circle = inscribedCircle(kite2d);
        for (let value = 1; value <= 10; value++) {
          const ox = ((value - 1) % ATLAS_COLS) * CELL;
          const oy = Math.floor((value - 1) / ATLAS_COLS) * CELL;

          // A faint worn highlight along the face's edges.
          ctx.save();
          ctx.translate(ox, oy);
          ctx.beginPath();
          ctx.moveTo(...kite2d.apex);
          ctx.lineTo(...kite2d.s1);
          ctx.lineTo(...kite2d.far);
          ctx.lineTo(...kite2d.s2);
          ctx.closePath();
          ctx.strokeStyle = 'rgba(255,255,255,0.10)';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();

          const name = glyphFor(game, kind, value);
          if (!name) continue;
          const g = trimmed(await loadImage(name));
          // Bounding boxes have empty corners, so the box may poke slightly past the circle.
          const scale = (circle.r * 2 * 1.1) / Math.hypot(g.w, g.h);
          const w = g.w * scale;
          const h = g.h * scale;
          const tint = document.createElement('canvas');
          tint.width = Math.ceil(w);
          tint.height = Math.ceil(h);
          const tctx = tint.getContext('2d')!;
          tctx.drawImage(g.canvas, g.x, g.y, g.w, g.h, 0, 0, w, h);
          tctx.globalCompositeOperation = 'source-in';
          tctx.fillStyle = style.glyph;
          tctx.fillRect(0, 0, w, h);
          ctx.drawImage(tint, ox + circle.x - w / 2, oy + circle.y - h / 2);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        return texture;
      })(),
    );
  }
  return atlasCache.get(key)!;
}
