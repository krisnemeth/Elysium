import * as THREE from 'three';
import type { DieKind, Game } from '@/app/lib/dice/rules';
import { fbm, rng } from './tray-look';

/*
  How the dice feel under the lamp. The colours and symbols come from the
  official art (d10.ts); this adds only relief, never colour: a normal map
  and a roughness map painted on a canvas from seeded noise (nothing is
  downloaded, and each look is the same on every visit), with the symbols
  engraved a little below the surface so their edges catch the light.

    Vampire   cast resin: a slow swirl in the surface, glossy
    Werewolf  stone: grain and fine pitting, matte
    Hunter    worn paint: scuffs, scratches and patches rubbed duller
*/

export type DiceSurface = { normalMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture };

// Material settings per game; the roughness map holds each pixel's own
// roughness, so `roughness` stays 1 and the map decides.
export type SurfaceMaterial = {
  clearcoat: number;
  clearcoatRoughness: number;
  specularIntensity: number;
  normalScale: number;
};

export const SURFACE_MATERIAL: Record<Game, SurfaceMaterial> = {
  vampire: { clearcoat: 0.2, clearcoatRoughness: 0.15, specularIntensity: 0.35, normalScale: 2.2 },
  werewolf: { clearcoat: 0, clearcoatRoughness: 0.5, specularIntensity: 0.3, normalScale: 1.6 },
  hunter: { clearcoat: 0.05, clearcoatRoughness: 0.4, specularIntensity: 0.28, normalScale: 2.2 },
};

// Engraving, in texels: how deep the symbols sit and how wide their sloped
// edge is (the mask is blurred by this radius, twice).
const ENGRAVE_DEPTH = 3;
const ENGRAVE_BLUR = 2;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Two passes of a box blur approximate a gaussian; separable, in place.
function blur(data: Float32Array, width: number, height: number, radius: number) {
  const tmp = new Float32Array(data.length);
  const span = radius * 2 + 1;
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < height; y++) {
      const row = y * width;
      let sum = 0;
      for (let x = -radius; x <= radius; x++) sum += data[row + Math.min(width - 1, Math.max(0, x))];
      for (let x = 0; x < width; x++) {
        tmp[row + x] = sum / span;
        sum += data[row + Math.min(width - 1, x + radius + 1)] - data[row + Math.max(0, x - radius)];
      }
    }
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let y = -radius; y <= radius; y++) sum += tmp[Math.min(height - 1, Math.max(0, y)) * width + x];
      for (let y = 0; y < height; y++) {
        data[y * width + x] = sum / span;
        sum += tmp[Math.min(height - 1, y + radius + 1) * width + x] - tmp[Math.max(0, y - radius) * width + x];
      }
    }
  }
}

type Grain = { height: (u: number, v: number) => number; rough: (u: number, v: number) => number; after?: (height: Float32Array, w: number, h: number) => void };

// Each game's base surface: `height` in texels (relief), `rough` in 0..1.
function grainFor(game: Game, kind: DieKind): Grain {
  const seed = (kind === 'special' ? 211 : 101) + game.length * 17;
  switch (game) {
    case 'vampire': {
      // Resin that set with a slow swirl; domain-warped bands, very shallow.
      const warpA = fbm(seed + 1, 3, 2, 0.4);
      const warpB = fbm(seed + 2, 3, 2, 0.4);
      const flow = fbm(seed + 3, 4, 3, 0.4);
      const fine = fbm(seed + 4, 48, 2, 0.4);
      return {
        height: (u, v) => {
          const s = flow(u + 0.35 * (warpA(u, v) - 0.5), v + 0.35 * (warpB(u, v) - 0.5));
          return Math.sin(s * 14) * 0.45 + (fine(u, v) - 0.5) * 0.35;
        },
        rough: (u, v) => 0.34 + 0.14 * flow(u + 0.2 * (warpB(u, v) - 0.5), v),
      };
    }
    case 'werewolf': {
      // Stone: coarse grain over fine, with small pits where noise peaks.
      const coarse = fbm(seed + 1, 18, 3, 0.4);
      const grain = fbm(seed + 2, 110, 2, 0.4);
      const pits = fbm(seed + 3, 150, 1, 0.4);
      return {
        height: (u, v) => (coarse(u, v) - 0.5) * 2.2 + (grain(u, v) - 0.5) * 1.1 - Math.max(0, pits(u, v) - 0.74) * 9,
        rough: (u, v) => 0.8 + 0.2 * (grain(u, v) - 0.5) + 0.12 * (coarse(u, v) - 0.5),
      };
    }
    case 'hunter': {
      // Painted resin carried about: faint orange-peel, patches rubbed
      // duller, and a scatter of fine scratches.
      const peel = fbm(seed + 1, 70, 2, 0.4);
      const wear = fbm(seed + 2, 6, 3, 0.4);
      return {
        height: (u, v) => (peel(u, v) - 0.5) * 0.9,
        rough: (u, v) => 0.5 + 0.35 * clamp01((wear(u, v) - 0.45) * 4),
        after: (height, w, h) => {
          const random = rng(seed + 9);
          for (let n = 0; n < 160; n++) {
            let x = random() * w;
            let y = random() * h;
            const angle = random() * Math.PI;
            const length = 14 + random() * 60;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const depth = 0.5 + random() * 0.9;
            for (let t = 0; t < length; t++) {
              const ix = Math.round(x);
              const iy = Math.round(y);
              if (ix >= 0 && ix < w && iy >= 0 && iy < h) height[iy * w + ix] -= depth;
              x += dx;
              y += dy;
            }
          }
        },
      };
    }
  }
}

// `mask` is the symbols' coverage (0..1) on the atlas layout at width × height.
export function buildSurface(game: Game, kind: DieKind, mask: Float32Array, width: number, height: number): DiceSurface {
  const grain = grainFor(game, kind);
  const heights = new Float32Array(width * height);
  const rough = new Float32Array(width * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      heights[y * width + x] = grain.height(u, v);
      rough[y * width + x] = grain.rough(u, v);
    }
  grain.after?.(heights, width, height);

  // Engrave the symbols: a smooth step down, softened so the edge slopes.
  const soft = Float32Array.from(mask);
  blur(soft, width, height, ENGRAVE_BLUR);
  for (let i = 0; i < heights.length; i++) {
    const s = clamp01(soft[i] * 1.15);
    const engraved = s * s * (3 - 2 * s);
    heights[i] -= ENGRAVE_DEPTH * engraved;
    // Paint in the engraving is matte against the polished body.
    rough[i] = Math.min(1, rough[i] + 0.3 * engraved);
  }

  // Normal map from the slopes. Texture v runs up the canvas, so the green
  // slope is the canvas' y difference with its sign kept.
  const normal = document.createElement('canvas');
  normal.width = width;
  normal.height = height;
  const normalImage = normal.getContext('2d')!.createImageData(width, height);
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughImage = roughCanvas.getContext('2d')!.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const up = Math.max(0, y - 1) * width;
    const down = Math.min(height - 1, y + 1) * width;
    for (let x = 0; x < width; x++) {
      const left = Math.max(0, x - 1);
      const right = Math.min(width - 1, x + 1);
      const row = y * width;
      const nx = -(heights[row + right] - heights[row + left]) / 2;
      const ny = (heights[down + x] - heights[up + x]) / 2;
      const len = Math.hypot(nx, ny, 1);
      const o = (row + x) * 4;
      normalImage.data[o] = ((nx / len) * 0.5 + 0.5) * 255;
      normalImage.data[o + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      normalImage.data[o + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      normalImage.data[o + 3] = 255;
      // three.js reads roughness from the green channel.
      roughImage.data[o] = roughImage.data[o + 2] = 0;
      roughImage.data[o + 1] = clamp01(rough[row + x]) * 255;
      roughImage.data[o + 3] = 255;
    }
  }
  normal.getContext('2d')!.putImageData(normalImage, 0, 0);
  roughCanvas.getContext('2d')!.putImageData(roughImage, 0, 0);

  // Data textures: no colour space. Same orientation as the colour atlas.
  const normalMap = new THREE.CanvasTexture(normal);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  normalMap.colorSpace = roughnessMap.colorSpace = THREE.NoColorSpace;
  return { normalMap, roughnessMap };
}
