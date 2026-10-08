import * as THREE from 'three';
import type { Game } from '@/app/lib/dice/rules';

/*
  Dice trays, one per game: a walnut tray lined with card-table baize
  (Vampire), a carved stone trough on slate (Werewolf) and an olive-drab
  ammo crate lined with canvas (Hunter). Every surface is painted on a
  canvas from tileable noise, so nothing is downloaded and textures repeat
  without seams.
*/

const SIZE = 512;

// Small seeded generator, so each tray looks the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Value noise on a wrapping gx × gy lattice: tileable over the unit square.
function lattice(gx: number, gy: number, random: () => number) {
  const values = Float32Array.from({ length: gx * gy }, random);
  return (u: number, v: number) => {
    const x = u * gx;
    const y = v * gy;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const at = (i: number, j: number) => values[(((j % gy) + gy) % gy) * gx + (((i % gx) + gx) % gx)];
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return top + (bottom - top) * sy;
  };
}

// Fractal noise in 0..1; `stretch` makes the grain longer along u.
function fbm(seed: number, base: number, octaves: number, stretch = 1) {
  const random = rng(seed);
  const layers = Array.from({ length: octaves }, (_, o) => {
    const g = base * 2 ** o;
    return lattice(Math.max(1, Math.round(g / stretch)), g, random);
  });
  return (u: number, v: number) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    for (const layer of layers) {
      sum += layer(u, v) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  };
}

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as RGB;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function paint(shade: (u: number, v: number) => RGB, after?: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(SIZE, SIZE);
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const [r, g, b] = shade(x / SIZE, y / SIZE);
      const i = (y * SIZE + x) * 4;
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
      image.data[i + 3] = 255;
    }
  ctx.putImageData(image, 0, 0);
  after?.(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Long grain with growth rings, running along u.
function wood(dark: string, light: string, seed: number) {
  const grain = fbm(seed, 2, 5, 12);
  const fine = fbm(seed + 1, 32, 3, 16);
  const [d, l] = [hex(dark), hex(light)];
  return paint((u, v) => {
    const rings = 0.5 + 0.5 * Math.sin((v * 18 + grain(u, v) * 7) * Math.PI * 2);
    const c = mix(d, l, Math.pow(rings, 2.2) * 0.75 + fine(u, v) * 0.25);
    return c.map((x) => x * (0.88 + grain(u * 3, v) * 0.24)) as RGB;
  });
}

// Mottled stone with darker veins and a few pale flecks.
function stone(dark: string, light: string, seed: number, moss?: string) {
  const body = fbm(seed, 3, 6);
  const veins = fbm(seed + 2, 4, 4);
  const random = rng(seed + 3);
  const [d, l] = [hex(dark), hex(light)];
  const green = moss ? hex(moss) : null;
  return paint(
    (u, v) => {
      let c = mix(d, l, clamp01((body(u, v) - 0.3) * 2));
      const vein = Math.abs(veins(u, v) - 0.5);
      if (vein < 0.02) c = mix(c, d, 0.6 * (1 - vein / 0.02));
      if (green) c = mix(c, green, clamp01((0.42 - body(u * 2, v * 2)) * 4) * 0.5);
      return c;
    },
    (ctx) => {
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = `rgba(${random() > 0.5 ? '230,226,214' : '20,20,20'},${0.15 + random() * 0.25})`;
        ctx.fillRect(random() * SIZE, random() * SIZE, 1 + random() * 1.5, 1 + random() * 1.5);
      }
    },
  );
}

// Close nap with faint blotches, for felt and baize.
function cloth(base: string, seed: number, weave = 0) {
  const blotch = fbm(seed, 4, 3);
  const nap = fbm(seed + 1, 128, 2);
  const c = hex(base);
  return paint((u, v) => {
    const w = weave ? 0.04 * Math.sin(u * SIZE * weave) * Math.sin(v * SIZE * weave) : 0;
    const k = 0.86 + blotch(u, v) * 0.16 + nap(u, v) * 0.1 + w;
    return c.map((x) => x * k) as RGB;
  });
}

// Painted steel: mottled paint, scratched through to bare metal.
function paintedSteel(base: string, seed: number) {
  const mottle = fbm(seed, 4, 5);
  const random = rng(seed + 1);
  const c = hex(base);
  return paint(
    (u, v) => c.map((x) => x * (0.82 + mottle(u, v) * 0.3)) as RGB,
    (ctx) => {
      ctx.lineCap = 'round';
      for (let i = 0; i < 140; i++) {
        const x = random() * SIZE;
        const y = random() * SIZE;
        const a = (random() - 0.5) * 0.8;
        const len = 8 + random() * 60;
        ctx.strokeStyle = `rgba(150,148,138,${0.2 + random() * 0.45})`;
        ctx.lineWidth = 0.6 + random() * 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        ctx.stroke();
      }
    },
  );
}

export type TrayLook = {
  wall: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  // World units one texture tile covers, on walls and floor.
  wallTile: number;
  floorTile: number;
};

const cache = new Map<Game, TrayLook>();

export function trayLook(game: Game): TrayLook {
  const cached = cache.get(game);
  if (cached) return cached;
  let look: TrayLook;
  switch (game) {
    case 'vampire': {
      const walnut = wood('#24120b', '#6b3c22', 11);
      const baize = cloth('#2f5a43', 12);
      look = {
        wall: new THREE.MeshStandardMaterial({ map: walnut, roughness: 0.45, bumpMap: walnut, bumpScale: 0.6 }),
        floor: new THREE.MeshStandardMaterial({ map: baize, roughness: 1, bumpMap: baize, bumpScale: 0.8 }),
        wallTile: 6,
        floorTile: 5,
      };
      break;
    }
    case 'werewolf': {
      const granite = stone('#3e403c', '#8a8b84', 21, '#4e5a36');
      const slate = stone('#3a3e3d', '#6e7472', 22);
      look = {
        wall: new THREE.MeshStandardMaterial({ map: granite, roughness: 0.92, bumpMap: granite, bumpScale: 2.5 }),
        floor: new THREE.MeshStandardMaterial({ map: slate, roughness: 0.8, bumpMap: slate, bumpScale: 1.2 }),
        wallTile: 5,
        floorTile: 9,
      };
      break;
    }
    case 'hunter': {
      const crate = paintedSteel('#4d5236', 31);
      const canvas = cloth('#8a7f5c', 32, 0.9);
      look = {
        wall: new THREE.MeshStandardMaterial({ map: crate, roughness: 0.55, metalness: 0.35, bumpMap: crate, bumpScale: 0.5 }),
        floor: new THREE.MeshStandardMaterial({ map: canvas, roughness: 0.95, bumpMap: canvas, bumpScale: 1 }),
        wallTile: 5,
        floorTile: 4,
      };
      break;
    }
  }
  cache.set(game, look);
  return look;
}
