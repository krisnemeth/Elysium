'use client';
/* eslint-disable react-hooks/immutability -- R3F updates three.js uniforms in the render loop. */

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COVERS, type Fx } from './covers';

/*
  The weather round the cover's characters (covers.ts, `fx`): Vampire's black
  smoke, Werewolf's wind with leaves and debris, Hunter's steam and the curl
  of smoke from a match. Two canvases, one behind the character and one in
  front, so things pass both ways. Every particle's path is worked out in
  its vertex shader from the time and its own seed, so nothing is updated on
  the CPU but a few uniforms. Each cover's systems fade in and out with the
  picker. The camera is orthographic at one unit to a CSS pixel, origin in
  the middle, y up. Loaded only in the browser, and not under reduced motion
  (CoverPicker.tsx).
*/

export type Layer = 'back' | 'front';
// The character's box in the stage, CSS pixels from its top left; w is the art's width.
export type ArtBox = { left: number; top: number; w: number };

const RATE = 2.4;
const ATLAS_N = 4; // painted leaves: the atlas is ATLAS_N x ATLAS_N (leafAtlas) // how fast a cover's weather fades in or out (1/s)

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A soft, cloudy puff: value noise in three octaves under a round falloff.
function puffTexture() {
  const size = 128;
  const rand = mulberry32(11);
  const octaves = [
    { n: 4, a: 0.5 },
    { n: 8, a: 0.3 },
    { n: 16, a: 0.2 },
  ].map((o) => ({ ...o, g: Array.from({ length: o.n * o.n }, rand) }));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const sample = (g: number[], n: number, u: number, v: number) => {
    const x = u * n;
    const y = v * n;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const s = fx * fx * (3 - 2 * fx);
    const t = fy * fy * (3 - 2 * fy);
    const at = (i: number, j: number) => g[(((j % n) + n) % n) * n + (((i % n) + n) % n)];
    return lerp(lerp(at(x0, y0), at(x0 + 1, y0), s), lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), s), t);
  };
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      let n = 0;
      for (const o of octaves) n += sample(o.g, o.n, u, v) * o.a;
      const r = Math.hypot(u - 0.5, v - 0.5) * 2;
      const fall = Math.max(0, 1 - r);
      const a = Math.min(1, Math.max(0, fall ** 1.6 * (0.55 + (n - 0.5) * 1.2)));
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const HASH = /* glsl */ `
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
`;

/* ---------------------------------------------------------------- */
/* Puffs: smoke and steam. Each particle is a rotated quad of the     */
/* puff texture, born somewhere in its emitter, drifting with uVel   */
/* and swaying, growing from uSize.x to uSize.y over its life.        */
/* ---------------------------------------------------------------- */
const PUFF_VERT = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime, uLife, uSwirl, uAmount, uOpacity, uTop, uTopFade;
  uniform vec2 uOrigin, uSpread, uVel, uSize;
  varying vec2 vUv;
  varying float vAlpha;
  ${HASH}
  void main() {
    float len = uLife * (0.75 + 0.5 * aSeed.w);
    float t = uTime / len + aSeed.x;
    float life = fract(t);
    float cycle = floor(t);
    vec2 r = vec2(hash(aSeed.y * 91.7 + cycle * 13.1), hash(aSeed.z * 57.3 + cycle * 7.7)) * 2.0 - 1.0;
    float age = life * len;
    vec2 c = uOrigin + r * uSpread + uVel * age * (0.7 + 0.6 * aSeed.w);
    c.x += (sin(age * 0.9 + aSeed.y * 6.2831) + 0.6 * sin(age * 0.37 + aSeed.z * 6.2831)) * uSwirl * life;
    float size = mix(uSize.x, uSize.y, pow(life, 0.7)) * (0.7 + 0.6 * aSeed.z);
    float a = aSeed.y * 6.2831 + age * (aSeed.z - 0.5) * 0.6;
    // Thins out to nothing as it nears the ceiling (uTop), however young.
    float side = 1.0 - smoothstep(uTop - uTopFade, uTop, c.y);
    vec2 p = c + mat2(cos(a), sin(a), -sin(a), cos(a)) * (position.xy * size);
    vUv = uv;
    vAlpha = smoothstep(0.0, 0.18, life) * (1.0 - smoothstep(0.5, 1.0, life)) * uOpacity * uAmount * side;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
  }
`;
const PUFF_FRAG = /* glsl */ `
  uniform sampler2D uPuff;
  uniform vec3 uColor, uRim;
  varying vec2 vUv;
  varying float vAlpha;
  void main() {
    float d = texture2D(uPuff, vUv).a;
    float a = d * vAlpha;
    if (a < 0.002) discard;
    // Thin edges catch the light (uRim), the thick of it is uColor.
    gl_FragColor = vec4(mix(uRim, uColor, smoothstep(0.04, 0.3, d)), a);
    #include <colorspace_fragment>
  }
`;

// An emitter in units of the stage: x and y from its middle, y up, as
// fractions of its height (so the weather keeps its shape on any screen),
// or pinned to a point on the art (`at`).
type PuffSpec = {
  count: number;
  color: string;
  opacity: number;
  life: number;
  origin: [number, number];
  spread: [number, number];
  vel: [number, number];
  swirl: number;
  size: [number, number];
  // The colour its thin edges catch from the light behind (default: color).
  rim?: string;
  at?: { cover: number; x: number; y: number };
  // Pixels rather than fractions of the height (thin wisps).
  px?: boolean;
  // Where it has thinned away completely (y from the stage's middle, up, as
  // a fraction of its height), and over how much it thins.
  top?: [number, number];
};

function Puffs({ spec, active, box }: { spec: PuffSpec; active: boolean; box: React.RefObject<ArtBox | null> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const amount = useRef(active ? 1 : 0);
  const size = useThree((s) => s.size);

  const geometry = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1) as unknown as THREE.InstancedBufferGeometry);
    const rand = mulberry32(spec.count * 977 + Math.round(spec.life * 31));
    const seeds = new Float32Array(spec.count * 4).map(rand);
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
    g.instanceCount = spec.count;
    return g;
  }, [spec.count, spec.life]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PUFF_VERT,
        fragmentShader: PUFF_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uLife: { value: spec.life },
          uSwirl: { value: 0 },
          uAmount: { value: 0 },
          uOpacity: { value: spec.opacity },
          uOrigin: { value: new THREE.Vector2() },
          uSpread: { value: new THREE.Vector2() },
          uVel: { value: new THREE.Vector2() },
          uSize: { value: new THREE.Vector2() },
          uPuff: { value: PUFF() },
          uColor: { value: new THREE.Color(spec.color) },
          uRim: { value: new THREE.Color(spec.rim ?? spec.color) },
          uTop: { value: 1e6 },
          uTopFade: { value: 1 },
        },
      }),
    [spec],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, dt) => {
    const target = active ? 1 : 0;
    amount.current += (target - amount.current) * (1 - Math.exp(-dt * RATE));
    if (!mesh.current) return;
    mesh.current.visible = amount.current > 0.003;
    if (!mesh.current.visible) return;
    const u = material.uniforms;
    const b = box.current;
    const k = spec.px ? 1 : size.height;
    if (spec.top) {
      u.uTop.value = spec.top[0] * size.height;
      u.uTopFade.value = spec.top[1] * size.height;
    }
    u.uTime.value = state.clock.elapsedTime + 60;
    u.uAmount.value = amount.current;
    u.uSwirl.value = spec.swirl * k;
    u.uSpread.value.set(spec.spread[0] * k, spec.spread[1] * k);
    u.uVel.value.set(spec.vel[0] * k, spec.vel[1] * k);
    u.uSize.value.set(spec.size[0] * k, spec.size[1] * k);
    if (spec.at && b) {
      const c = COVERS[spec.at.cover];
      u.uOrigin.value.set(b.left + spec.at.x * b.w - size.width / 2, size.height / 2 - (b.top + (spec.at.y * b.w * c.height) / c.width));
    } else {
      u.uOrigin.value.set(spec.origin[0] * size.height, spec.origin[1] * size.height);
    }
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}

let puff: THREE.DataTexture | null = null;
const PUFF = () => (puff ??= puffTexture());

/* ---------------------------------------------------------------- */
/* Fliers: leaves and debris carried across on the wind, left to      */
/* right, tumbling in 3D (the shading follows the face's turn, so a   */
/* leaf flashes as it flips). aSeed.w is depth: near ones are bigger, */
/* faster and more opaque; uDepth picks this layer's slice of it.     */
/* ---------------------------------------------------------------- */
const FLIER_VERT = /* glsl */ `
  attribute vec4 aSeed;
  attribute vec3 aColor;
  attribute float aCell;
  uniform float uTime, uLife, uAmount, uSpin, uFall, uFlutter, uBend;
  uniform vec2 uView, uSize, uDepth;
  varying vec3 vColor, vNormal;
  varying float vAlpha, vShade, vCell, vDepth;
  varying vec2 vUv;
  ${HASH}
  mat3 rx(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0, 0, c, s, 0, -s, c); }
  mat3 ry(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
  mat3 rz(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0, -s, c, 0, 0, 0, 1); }
  void main() {
    float depth = mix(uDepth.x, uDepth.y, aSeed.w);
    float len = uLife * mix(1.5, 0.55, depth) * (0.85 + 0.3 * aSeed.z);
    float t = uTime / len + aSeed.x;
    float life = fract(t);
    float cycle = floor(t);
    float span = uView.x + 300.0;
    // Gusts: the crossing speeds up and slows down along the way.
    float run = life + 0.05 * sin(life * 9.0 + aSeed.z * 6.2831);
    float x = -span * 0.5 + span * run;
    float y = (hash(aSeed.y * 31.1 + cycle * 3.7) - 0.45) * uView.y * 1.1;
    y += sin(life * 7.0 + aSeed.y * 6.2831) * uFlutter * (0.5 + depth) - life * uFall * (0.4 + depth);
    float size = mix(uSize.x, uSize.y, depth) * (0.75 + 0.5 * aSeed.z);
    vec3 spin = vec3(1.3, 0.9, 0.5) * (0.5 + aSeed.zyx) * uSpin;
    mat3 R = rz(aSeed.x * 6.2831 + uTime * spin.z) * ry(aSeed.y * 6.2831 + uTime * spin.y) * rx(aSeed.z * 6.2831 + uTime * spin.x);
    // Leaves aren't flat: each is cupped across its width and curled along
    // its length, its own way, the curl working in the wind.
    vec3 lp = position;
    float cup = uBend * (0.25 + 0.35 * aSeed.z);
    float curl = uBend * ((aSeed.y - 0.5) * 0.8 + 0.18 * sin(uTime * 2.6 + aSeed.x * 40.0));
    lp.z = 2.0 * (cup * lp.x * lp.x + curl * lp.y * lp.y);
    vec3 p = R * (lp * size);
    vNormal = R * normalize(vec3(-4.0 * cup * lp.x, -4.0 * curl * lp.y, 1.0));
    vDepth = depth;
    vShade = 0.35 + 0.65 * abs((R * vec3(0, 0, 1)).z);
    vColor = aColor;
    vUv = uv;
    vCell = aCell;
    vAlpha = uAmount * smoothstep(0.0, 0.04, life) * (1.0 - smoothstep(0.96, 1.0, life)) * mix(0.45, 1.0, depth);
    gl_Position = projectionMatrix * viewMatrix * vec4(x + p.x, y + p.y, 0.0, 1.0);
  }
`;
const FLIER_FRAG = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uPainted;
  varying vec3 vColor, vNormal;
  varying float vAlpha, vShade, vCell, vDepth;
  varying vec2 vUv;
  void main() {
    if (uPainted < 0.5) {
      gl_FragColor = vec4(vColor * vShade, vAlpha);
    } else {
      // One of the atlas's painted leaves, a little out of focus when it
      // passes closest (a blurrier mip level).
      vec2 cell = vec2(mod(vCell, ${ATLAS_N}.0), floor(vCell / ${ATLAS_N}.0));
      vec4 c = texture2D(uAtlas, (cell + vUv) / ${ATLAS_N}.0, smoothstep(0.8, 1.0, vDepth) * 2.0);
      float a = smoothstep(0.2, 0.6, c.a);
      if (a < 0.01) discard;
      // Lit by the moon, up and to the right: shaded across its curve, a
      // cool sheen where it faces the light, and warm light through it when
      // its back is turned to the moon.
      vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
      vec3 L = normalize(vec3(0.5, 0.75, 0.55));
      float diff = max(dot(n, L), 0.0);
      float through = max(dot(-n, L), 0.0);
      float sheen = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 26.0);
      vec3 paint = c.rgb * vColor * vec3(0.8, 0.84, 0.86);
      vec3 col = paint * (0.22 + 0.78 * diff) + paint * vec3(1.0, 0.92, 0.55) * through * 0.4 + vec3(0.7, 0.8, 0.85) * sheen * 0.3;
      gl_FragColor = vec4(col, vAlpha * a);
    }
    #include <colorspace_fragment>
  }
`;

type FlierSpec = {
  shape: 'leaf' | 'twig' | 'grit';
  count: number;
  colors: string[];
  life: number;
  size: [number, number];
  depth: [number, number];
  spin: number;
  fall: number;
  flutter: number;
};

/*
  Painted leaves: an atlas of ATLAS_N x ATLAS_N leaves drawn once on a
  canvas, six shapes (oval, willow, birch, oak, maple, linden) in the
  palette's colours, each with a gradient from stem to tip, a darker rim,
  pale veins and, on some, a few blight spots.
*/
const LEAF_KINDS = ['oval', 'willow', 'birch', 'oak', 'maple', 'linden'] as const;

// Half the leaf's width at s (0 at the stem, 1 at the tip), as a fraction of its cell.
function leafWidth(kind: (typeof LEAF_KINDS)[number], s: number) {
  const body = (k: number) => Math.sin(Math.PI * s) ** k;
  switch (kind) {
    case 'willow':
      return 0.1 * body(0.9);
    case 'birch':
      return 0.32 * body(0.6) * (1 - 0.07 * Math.abs(Math.sin(s * 46)));
    case 'oak':
      return 0.3 * body(0.7) * (0.6 + 0.4 * Math.abs(Math.sin(s * Math.PI * 4.5)));
    case 'maple':
      return 0.42 * body(0.5) * (0.6 + 0.4 * Math.abs(Math.sin(s * Math.PI * 2.6)));
    case 'linden':
      return 0.36 * Math.sin(Math.PI * (0.18 + 0.82 * s)) ** 0.8 * (1 - 0.05 * Math.abs(Math.sin(s * 40)));
    default:
      return 0.28 * body(0.8);
  }
}

const atlases = new Map<string, THREE.CanvasTexture>();
function leafAtlas(palette: string[]) {
  const key = palette.join();
  const cached = atlases.get(key);
  if (cached) return cached;
  const cell = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = cell * ATLAS_N;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(23);
  const P = palette.length;
  for (let i = 0; i < ATLAS_N * ATLAS_N; i++) {
    const kind = LEAF_KINDS[i % LEAF_KINDS.length];
    const x0 = (i % ATLAS_N) * cell;
    const y0 = Math.floor(i / ATLAS_N) * cell;
    const base = 0.9 * cell;
    const len = 0.8 * cell;
    const at = (s: number, side: number) => [x0 + cell / 2 + side * leafWidth(kind, s) * cell, y0 + base - s * len] as const;
    ctx.save();
    // The outline.
    ctx.beginPath();
    for (let k = 0; k <= 60; k++) ctx.lineTo(...at(k / 60, 1));
    for (let k = 60; k >= 0; k--) ctx.lineTo(...at(k / 60, -1));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y0 + base, 0, y0 + base - len);
    grad.addColorStop(0, palette[(i * 3) % P]);
    grad.addColorStop(1, palette[(i * 5 + 2) % P]);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.clip();
    // A darker rim, then veins and blight.
    const rim = ctx.createRadialGradient(x0 + cell / 2, y0 + cell / 2, cell * 0.08, x0 + cell / 2, y0 + cell / 2, cell * 0.48);
    rim.addColorStop(0, 'rgba(0,0,0,0)');
    rim.addColorStop(1, 'rgba(10,6,0,0.45)');
    ctx.fillStyle = rim;
    ctx.fillRect(x0, y0, cell, cell);
    ctx.strokeStyle = 'rgba(255,240,200,0.3)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(...at(0, 0));
    ctx.lineTo(...at(1, 0));
    ctx.stroke();
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(255,240,200,0.18)';
    for (let k = 1; k < 7; k++) {
      const s = k / 7.5;
      for (const side of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(...at(s, 0));
        const [tx, ty] = at(Math.min(1, s + 0.09), side * 0.85);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    }
    if (rand() < 0.45) {
      for (let k = 0; k < 3 + rand() * 5; k++) {
        ctx.fillStyle = `rgba(${30 + rand() * 40},${15 + rand() * 15},5,${0.25 + rand() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x0 + cell * (0.35 + rand() * 0.3), y0 + cell * (0.2 + rand() * 0.6), 1 + rand() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    // The stem.
    ctx.strokeStyle = palette[(i * 3) % P];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(...at(0, 0));
    ctx.lineTo(x0 + cell / 2 + 2, y0 + cell * 0.99);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  atlases.set(key, tex);
  return tex;
}

function Fliers({ spec, active }: { spec: FlierSpec; active: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const amount = useRef(active ? 1 : 0);
  const size = useThree((s) => s.size);

  const geometry = useMemo(() => {
    const base = spec.shape === 'leaf' ? new THREE.PlaneGeometry(1, 1, 6, 6) : spec.shape === 'twig' ? new THREE.PlaneGeometry(1, 0.12) : new THREE.PlaneGeometry(0.5, 0.4);
    const g = new THREE.InstancedBufferGeometry().copy(base as unknown as THREE.InstancedBufferGeometry);
    base.dispose();
    const rand = mulberry32(spec.count * 131 + spec.colors.length * 7 + Math.round(spec.depth[0] * 100));
    const seeds = new Float32Array(spec.count * 4).map(rand);
    const colors = new Float32Array(spec.count * 3);
    const cells = new Float32Array(spec.count);
    const c = new THREE.Color();
    for (let i = 0; i < spec.count; i++) {
      // Painted leaves keep their own colours, only shifted a little.
      if (spec.shape === 'leaf') c.setRGB(0.85 + rand() * 0.25, 0.85 + rand() * 0.2, 0.85 + rand() * 0.15);
      else c.set(spec.colors[Math.floor(rand() * spec.colors.length)]);
      c.toArray(colors, i * 3);
      cells[i] = Math.floor(rand() * ATLAS_N * ATLAS_N);
    }
    g.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 1));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
    g.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));
    g.instanceCount = spec.count;
    return g;
  }, [spec]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FLIER_VERT,
        fragmentShader: FLIER_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uLife: { value: spec.life },
          uAmount: { value: 0 },
          uSpin: { value: spec.spin },
          uPainted: { value: spec.shape === 'leaf' ? 1 : 0 },
          uBend: { value: spec.shape === 'leaf' ? 1 : 0 },
          uAtlas: { value: spec.shape === 'leaf' ? leafAtlas(spec.colors) : null },
          uFall: { value: 0 },
          uFlutter: { value: 0 },
          uView: { value: new THREE.Vector2() },
          uSize: { value: new THREE.Vector2() },
          uDepth: { value: new THREE.Vector2(...spec.depth) },
        },
      }),
    [spec],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, dt) => {
    const target = active ? 1 : 0;
    amount.current += (target - amount.current) * (1 - Math.exp(-dt * RATE));
    if (!mesh.current) return;
    mesh.current.visible = amount.current > 0.003;
    if (!mesh.current.visible) return;
    const u = material.uniforms;
    const h = size.height;
    u.uTime.value = state.clock.elapsedTime + 60;
    u.uAmount.value = amount.current;
    u.uView.value.set(size.width, h);
    u.uSize.value.set(spec.size[0] * h, spec.size[1] * h);
    u.uFall.value = spec.fall * h;
    u.uFlutter.value = spec.flutter * h;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------------------------------------------------------------- */
/* Each cover's weather, per layer.                                   */
/* ---------------------------------------------------------------- */
type System = { kind: 'puffs'; spec: PuffSpec } | { kind: 'fliers'; spec: FlierSpec };

function systems(fx: Fx, cover: number, layer: Layer): System[] {
  const out: System[] = [];
  const back = layer === 'back';
  if (fx.smoke) {
    // Rolling up off the floor and in from both sides, low: it thins away
    // before it reaches the middle of the screen (50vh).
    const { color, rim, opacity } = fx.smoke;
    const top: [number, number] = [0, 0.28];
    if (back) {
      out.push({ kind: 'puffs', spec: { count: 38, color, rim, opacity, life: 16, origin: [0, -0.58], spread: [0.8, 0.06], vel: [0.006, 0.06], swirl: 0.08, size: [0.24, 0.6], top } });
      out.push({ kind: 'puffs', spec: { count: 15, color, rim, opacity, life: 17, origin: [-0.74, -0.32], spread: [0.12, 0.14], vel: [0.035, 0.015], swirl: 0.06, size: [0.22, 0.5], top } });
      out.push({ kind: 'puffs', spec: { count: 15, color, rim, opacity, life: 17, origin: [0.74, -0.32], spread: [0.12, 0.14], vel: [-0.035, 0.015], swirl: 0.06, size: [0.22, 0.5], top } });
    } else {
      // A low bank in front, round the legs.
      out.push({ kind: 'puffs', spec: { count: 22, color, rim, opacity, life: 13, origin: [0, -0.6], spread: [0.85, 0.05], vel: [0.012, 0.04], swirl: 0.06, size: [0.24, 0.55], top } });
    }
  }
  if (fx.steam) {
    const color = '#d9d3c8';
    const { opacity } = fx.steam;
    if (back) {
      out.push({ kind: 'puffs', spec: { count: 34, color, opacity, life: 11, origin: [0, -0.62], spread: [0.9, 0.06], vel: [0.006, 0.07], swirl: 0.05, size: [0.22, 0.75] } });
    } else {
      out.push({ kind: 'puffs', spec: { count: 14, color, opacity: opacity * 0.7, life: 9, origin: [-0.45, -0.58], spread: [0.4, 0.04], vel: [0.012, 0.06], swirl: 0.04, size: [0.18, 0.55] } });
    }
  }
  if (fx.wisp && !back) {
    // A thin curl from the match: small, many, swaying harder as it rises.
    out.push({
      kind: 'puffs',
      spec: { count: 70, color: '#cfc8bd', opacity: 0.32, life: 7, origin: [0, 0], spread: [1.5, 1.5], vel: [6, 40], swirl: 34, size: [6, 110], px: true, at: { cover, ...fx.wisp } },
    });
  }
  if (fx.fog) {
    // Low banks drifting slowly across, thick near the ground.
    const { color, opacity } = fx.fog;
    out.push({
      kind: 'puffs',
      spec: back
        ? { count: 34, color, opacity, life: 24, origin: [-0.35, -0.32], spread: [0.95, 0.2], vel: [0.035, 0.004], swirl: 0.02, size: [0.5, 0.95] }
        : { count: 14, color, opacity: opacity * 0.8, life: 20, origin: [-0.35, -0.48], spread: [0.95, 0.08], vel: [0.045, 0.003], swirl: 0.02, size: [0.45, 0.85] },
    });
  }
  if (fx.wind) {
    const { leaves, debris } = fx.wind;
    const depth: [number, number] = back ? [0, 0.5] : [0.55, 1];
    out.push({ kind: 'fliers', spec: { shape: 'leaf', count: back ? 20 : 6, colors: leaves, life: 12, size: [0.018, 0.07], depth, spin: 1.2, fall: 0.08, flutter: 0.06 } });
    out.push({ kind: 'fliers', spec: { shape: 'twig', count: back ? 6 : 2, colors: [debris, leaves[leaves.length - 1]], life: 9, size: [0.012, 0.045], depth, spin: 2, fall: 0.1, flutter: 0.03 } });
    out.push({ kind: 'fliers', spec: { shape: 'grit', count: back ? 36 : 12, colors: [debris, '#3a3326', '#514634'], life: 7, size: [0.003, 0.009], depth, spin: 3, fall: 0.04, flutter: 0.02 } });
  }
  return out;
}

function Weather({ current, layer, box }: { current: number; layer: Layer; box: React.RefObject<ArtBox | null> }) {
  const all = useMemo(() => COVERS.map((c, i) => systems(c.fx, i, layer)), [layer]);
  return (
    <>
      {all.map((list, i) =>
        list.map((s, j) =>
          s.kind === 'puffs' ? <Puffs key={`${i}-${j}`} spec={s.spec} active={i === current} box={box} /> : <Fliers key={`${i}-${j}`} spec={s.spec} active={i === current} />,
        ),
      )}
    </>
  );
}

export default function Atmosphere({ current, layer, running, box }: { current: number; layer: Layer; running: boolean; box: React.RefObject<ArtBox | null> }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 100], zoom: 1, near: 1, far: 1000 }}
      dpr={[1, 1.5]}
      frameloop={running ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <Weather current={current} layer={layer} box={box} />
    </Canvas>
  );
}
