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
// 768px faces keep the symbols sharp up close; the 3840×1536 atlas stays
// within the 4096px texture limit of most phones.
const CELL = 768;

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
  // Distance from the centre to every face (they're all alike): how high
  // the die's centre sits when it lies flat on a face.
  const inradius = faces[0].normal.dot(kites[0][0]);
  return { geometry, faces, kite2d, inradius };
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

// Colours sampled from the front faces of the official dice art; the black
// dice are a shade deeper, so they read black rather than grey on screen.
export const DICE_STYLES: Record<Game, Record<DieKind, Style>> = {
  vampire: {
    regular: { face: '#1c1c1d', glyph: '#e8e8e8' },
    special: { face: '#ff0021', glyph: '#151515' },
  },
  werewolf: {
    regular: { face: '#b2b02c', glyph: '#171214' },
    special: { face: '#ff4437', glyph: '#0e0e0e' },
  },
  hunter: {
    regular: { face: '#ff7800', glyph: '#060600' },
    special: { face: '#141414', glyph: '#f5821f' },
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
      if (value === 10) return 'wta-claw-crit.svg';
      if (value >= 6) return 'wta-claw.svg';
      return special && value <= 2 ? 'wta-fangs.svg' : null;
    case 'hunter':
      if (value === 10) return 'htr-flame-crit.svg';
      if (value >= 6) return 'htr-flame.svg';
      return special && value === 1 ? 'htr-overreach.svg' : null;
  }
}

/*
  Where each symbol sits on the official dice art (309×339 images, measured
  from brand-assets): [x, y, width, height]. In that art the front face runs
  from its apex at (155, 2) to its far point at (155, 269), and it is the same
  kite as ours, so the symbols land exactly where the printed dice have them.
*/
const ART_APEX: [number, number] = [155, 2];
const ART_LENGTH = 267;
const GLYPH_BOX: Record<string, [number, number, number, number]> = {
  'vtm-ankh.svg': [117, 82, 75, 151],
  'vtm-ankh-crit.svg': [102, 82, 106, 151],
  'vtm-messy.svg': [116, 87, 83, 145],
  'vtm-skull.svg': [110, 118, 89, 110],
  'wta-claw.svg': [88, 96, 124, 131],
  'wta-claw-crit.svg': [94, 103, 111, 122],
  'wta-fangs.svg': [100, 112, 112, 130],
  'htr-flame.svg': [103, 88, 101, 132],
  'htr-flame-crit.svg': [88, 78, 131, 154],
  'htr-overreach.svg': [135, 85, 40, 138],
};

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

        // Official art units → atlas pixels. The printed dice carry no numbers.
        const unit = (kite2d.far[1] - kite2d.apex[1]) / ART_LENGTH;
        const tint = document.createElement('canvas');
        const tctx = tint.getContext('2d')!;
        for (let value = 1; value <= 10; value++) {
          const name = glyphFor(game, kind, value);
          if (!name) continue;
          const img = await loadImage(name);
          const [bx, by, bw, bh] = GLYPH_BOX[name];
          const w = Math.round(bw * unit);
          const h = Math.round(bh * unit);
          // Vector symbols, rasterised at full face resolution, then tinted.
          tint.width = w;
          tint.height = h;
          tctx.globalCompositeOperation = 'source-over';
          tctx.drawImage(img, 0, 0, w, h);
          tctx.globalCompositeOperation = 'source-in';
          tctx.fillStyle = style.glyph;
          tctx.fillRect(0, 0, w, h);
          const ox = ((value - 1) % ATLAS_COLS) * CELL;
          const oy = Math.floor((value - 1) / ATLAS_COLS) * CELL;
          ctx.drawImage(tint, ox + kite2d.apex[0] + (bx - ART_APEX[0]) * unit, oy + kite2d.apex[1] + (by - ART_APEX[1]) * unit);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      })(),
    );
  }
  return atlasCache.get(key)!;
}
