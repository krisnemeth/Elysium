/*
  Hunter, the hideout: the cell's ops base in a basement. The frame is a run
  of old steel pipe, bending round each corner, held to the wall by clamps
  that bleed rust. On the left a valve with its handwheel; an ammo can and
  spent shotgun shells along the bottom. Matte and rusted through, lit only
  by the den's lamp, which hangs to the upper right of the page, so every
  piece takes its light from the same side. Like the others, the long pieces
  keep to the side gutters; along the edges only clamps, which end before
  the content starts.
  Materials (ambientCG, CC0): Metal021 (the pipe, its fittings and the ammo
  can), Metal022 (the rust patches).
*/
import * as THREE from 'three';
import { pbr, random, RIM_SIZE, RIM_WIDTH } from '../studio.js';

/*
  The pipe: worn grey steel, rusted only here and there. A thin clear coat
  (old oil and grime) gives it a soft sheen where the lamp catches it.
*/
const sheen = (make) => async () => {
  const base = await make();
  return (size) => {
    const s = base(size);
    return new THREE.MeshPhysicalMaterial({
      map: s.map, normalMap: s.normalMap, normalScale: s.normalScale, roughnessMap: s.roughnessMap,
      roughness: s.roughness, metalness: s.metalness, color: s.color, transparent: true,
      clearcoat: 0.3, clearcoatRoughness: 0.35,
    });
  };
};
const steel = sheen(() => pbr('Metal021', { tint: '#e4dcd2', roughness: 0.45, metalness: 0.5, normalScale: 1.2, tile: 96 }));
// Fittings: the same steel, a little darker and finer.
const iron = sheen(() => pbr('Metal021', { tint: '#d0c8be', roughness: 0.5, metalness: 0.5, normalScale: 1.1, tile: 40 }));
// Rust, laid over the steel in patches (see `rust`).
const rusted = () => pbr('Metal022', { tint: '#9a8d82', roughness: 0.95, metalness: 0.1, normalScale: 1.4, tile: 48 });
// The ammo can: plain olive paint, worn by the steel's roughness.
const olive = () => pbr('Metal021', { color: '#3c4228', map: null, roughness: 0.85, metalness: 0.15, normalScale: 0.8, tile: 60 });

/*
  The den's lamp hangs to the upper right of the page, well away from any
  frame, so its light arrives as one warm direction for every piece (a
  directional light, so the rim and the corners agree), with only a little
  cold spill from the room behind.
*/
function lamp(scene) {
  const bulb = new THREE.DirectionalLight('#ffc98c', 4.4);
  bulb.position.set(0.62, 0.55, 0.56);
  scene.add(bulb, new THREE.HemisphereLight('#2a3440', '#120d09', 1));
  scene.environment = room();
  scene.environmentIntensity = 1.4;
}

/*
  What the steel reflects: a dark room with the lamp's bright spot in the
  same direction as the light, so the sheen sits where the light falls.
*/
let roomMap;
function room() {
  if (roomMap) return roomMap;
  const W = 512, H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#6a5440');
  sky.addColorStop(0.45, '#3a2e24');
  sky.addColorStop(0.6, '#15110d');
  sky.addColorStop(1, '#080706');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  // three.js's equirectangular layout: u from atan2(z, x), v from asin(y).
  const d = new THREE.Vector3(0.62, 0.55, 0.56).normalize();
  const u = (Math.atan2(d.z, d.x) / (2 * Math.PI) + 0.5) * W;
  const v = (1 - (Math.asin(d.y) / Math.PI + 0.5)) * H;
  // The lamp itself, and the wash it throws on the ceiling around it.
  const glow = ctx.createRadialGradient(u, v, 0, u, v, 200);
  glow.addColorStop(0, '#fff4dc');
  glow.addColorStop(0.08, '#ffd29a');
  glow.addColorStop(0.4, 'rgba(200,140,80,0.5)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  roomMap = new THREE.CanvasTexture(canvas);
  roomMap.mapping = THREE.EquirectangularReflectionMapping;
  roomMap.colorSpace = THREE.SRGBColorSpace;
  return roomMap;
}

// The pipe's centre line, from the outer edge, and its radius.
const EDGE = RIM_WIDTH * 0.5;
const PIPE = 6;

/*
  A patch of rust on the pipe: a sleeve a hair wider than the pipe, its edges
  eaten away (a noisy alpha), where water sits: round joints and clamps.
*/
function rust(scene, material, rnd, x, y, length, vertical) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(64, 64);
  for (let j = 0; j < 64; j++)
    for (let i = 0; i < 64; i++) {
      // Densest in the middle of the length, fading ragged towards both ends.
      const along = 1 - Math.abs(j / 63 - 0.5) * 2;
      const v = Math.min(1, Math.max(0, along * 1.6 - 0.35 + (rnd() - 0.5) * 0.7));
      const k = (j * 64 + i) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = v * 255;
      img.data[k + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  const alpha = new THREE.CanvasTexture(canvas);
  const mat = material([2 * Math.PI * PIPE, length]);
  mat.alphaMap = alpha;
  mat.depthWrite = false;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(PIPE + 0.08, PIPE + 0.08, length, 32, 1, true), mat);
  m.position.set(x, y, 0);
  if (!vertical) m.rotation.z = Math.PI / 2;
  scene.add(m);
}

/*
  The rim: a pipe round the panel. Straight lengths between the corners (their
  texture repeats exactly over the tiled length, so the 9-slice tiles) and a
  bend in each corner square.
*/
async function pipeRim(scene) {
  const S = RIM_SIZE, B = RIM_WIDTH, L = S - 2 * B;
  const [metal, red] = await Promise.all([steel(), rusted()]);
  const round = 2 * Math.PI * PIPE;
  for (const [x, y, rz] of [[S / 2, EDGE, Math.PI / 2], [S / 2, S - EDGE, Math.PI / 2], [EDGE, S / 2, 0], [S - EDGE, S / 2, 0]]) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(PIPE, PIPE, L, 32, 1, true), metal([round, L]));
    m.position.set(x, y, 0);
    m.rotation.z = rz;
    scene.add(m);
  }
  // The bends: a quarter torus in each corner square, round its inner corner.
  for (const [cx, cy, a] of [[B, B, Math.PI], [S - B, B, -Math.PI / 2], [S - B, S - B, 0], [B, S - B, Math.PI / 2]]) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(B - EDGE, PIPE, 24, 12, Math.PI / 2), metal([round, ((B - EDGE) * Math.PI) / 2]));
    m.position.set(cx, cy, 0);
    m.rotation.z = a;
    scene.add(m);
  }
  // Rust where the lower bends hold water.
  const rnd = random(71);
  for (const [x, y, a] of [[B, B, Math.PI], [S - B, B, -Math.PI / 2]]) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(B - EDGE + 0.08, PIPE + 0.08, 24, 12, Math.PI / 2), red([round, ((B - EDGE) * Math.PI) / 2]));
    m.material.alphaMap = blotch(rnd);
    m.material.depthWrite = false;
    m.position.set(x, y, 0);
    m.rotation.z = a;
    scene.add(m);
  }
  lamp(scene);
}

// A ragged blotch, for rust on a bend.
function blotch(rnd) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(32, 32);
  for (let k = 0; k < 32 * 32; k++) {
    const v = rnd() < 0.55 ? 200 + rnd() * 55 : rnd() * 60;
    img.data[k * 4] = img.data[k * 4 + 1] = img.data[k * 4 + 2] = v;
    img.data[k * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

// A hex bolt head, facing the viewer.
function bolt(material, x, y, z, size = 1.6) {
  const g = new THREE.CylinderGeometry(size, size, 1.2, 6, 1);
  g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, material([1, 1]));
  m.position.set(x, y, z);
  return m;
}

// A rust streak running from a fitting down the wall (`down` is the direction on screen).
function streak(x, y, length, rnd, down = true) {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(8, 0, 5 + rnd() * 2, 64, 0, 0, Math.PI);
  ctx.fill();
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(4 + rnd() * 2.5, length * 0.7),
    new THREE.MeshStandardMaterial({ color: '#4a2a17', alphaMap: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.3, roughness: 1, depthWrite: false }),
  );
  m.position.set(x, y + (down ? -length * 0.35 : length * 0.35), -2);
  if (!down) m.rotation.z = Math.PI;
  return m;
}

// A strap over the pipe, bolted either side. `vertical` for a pipe running up and down.
function clamp(scene, metal, x, y, vertical = false) {
  const long = 2 * PIPE + 7;
  const strap = new THREE.Mesh(new THREE.BoxGeometry(vertical ? long : 3.4, vertical ? 3.4 : long, 1.2), metal([long, 3.4]));
  strap.position.set(x, y, PIPE + 0.2);
  scene.add(strap);
  const o = PIPE + 2;
  for (const s of [-1, 1]) scene.add(bolt(metal, vertical ? x + s * o : x, vertical ? y : y + s * o, PIPE + 1, 1.3));
}

// A flange joint in the pipe: a thick collar with bolts round it.
function flange(scene, metal, x, y, vertical) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(PIPE + 2.6, PIPE + 2.6, 3, 32), metal([8, 8]));
  if (!vertical) m.rotation.z = Math.PI / 2;
  m.position.set(x, y, 0);
  scene.add(m);
  for (const a of [-0.9, 0, 0.9]) {
    const r = PIPE + 1.4;
    const b = bolt(metal, x, y, 0, 0.9);
    if (vertical) b.position.set(x + Math.sin(a) * r, y + 2, Math.cos(a) * r);
    else b.position.set(x + 2, y + Math.sin(a) * r, Math.cos(a) * r);
    scene.add(b);
  }
}

// A gate valve on a vertical pipe, its handwheel facing the viewer.
function valve(scene, metal, x, y) {
  const body = new THREE.Mesh(new THREE.CylinderGeometry(PIPE + 2, PIPE + 2, 12, 24), metal([12, 12]));
  body.position.set(x, y, 0);
  scene.add(body);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6, 12), metal([4, 4]));
  stem.rotation.x = Math.PI / 2;
  stem.position.set(x, y, PIPE + 4);
  scene.add(stem);
  const paint = new THREE.MeshStandardMaterial({ color: '#5e2117', roughness: 0.9, metalness: 0.05 });
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(7, 1.2, 12, 40), paint);
  wheel.position.set(x, y, PIPE + 7);
  scene.add(wheel);
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 14, 8), paint);
    s.rotation.z = (i * Math.PI) / 3 + 0.3;
    s.position.set(x, y, PIPE + 7);
    scene.add(s);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2.4, 16), paint);
  hub.rotation.x = Math.PI / 2;
  hub.position.set(x, y, PIPE + 7.4);
  scene.add(hub);
}

// An ammo can standing on the bottom pipe: olive steel, its lid and latch.
function ammoCan(scene, paint, metal, x, y) {
  const can = new THREE.Mesh(new THREE.BoxGeometry(26, 15, 10), paint([26, 15]));
  can.position.set(x, y + 7.5, PIPE + 5);
  scene.add(can);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(27, 2.4, 11), paint([27, 3]));
  lid.position.set(x, y + 15.6, PIPE + 5);
  scene.add(lid);
  const latch = new THREE.Mesh(new THREE.BoxGeometry(3.2, 6, 1.2), metal([3, 6]));
  latch.position.set(x + 9, y + 13, PIPE + 10.6);
  scene.add(latch);
  // A stencilled mark, pale and worn.
  const label = new THREE.Mesh(new THREE.PlaneGeometry(10, 2), new THREE.MeshStandardMaterial({ color: '#d8d2b8', transparent: true, opacity: 0.35, roughness: 1 }));
  label.position.set(x - 3, y + 8, PIPE + 10.1);
  scene.add(label);
}

// A spent shotgun shell lying on its side: red hull, crimped end, brass head.
function shell(scene, { x, y, angle, rnd }) {
  const group = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 12, 24), new THREE.MeshPhysicalMaterial({ color: '#7a2219', roughness: 0.5, clearcoat: 0.4 }));
  hull.position.y = 6;
  const crimp = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.3, 1.6, 24), new THREE.MeshStandardMaterial({ color: '#5a1812', roughness: 0.6 }));
  crimp.position.y = 12.8;
  const brass = new THREE.MeshStandardMaterial({ color: '#b48a46', metalness: 1, roughness: 0.38 });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.2, 24), brass);
  head.position.y = -2.1;
  const rimLip = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.7, 24), brass);
  rimLip.position.y = -4.2;
  group.add(hull, crimp, head, rimLip);
  group.rotation.set(0.25 + rnd() * 0.3, rnd() * Math.PI, angle);
  group.position.set(x, y, PIPE + 2);
  scene.add(group);
}

function corner({ down, right, width, height, seed, kind }) {
  return async (scene) => {
    const [metal, paint, red] = await Promise.all([iron(), olive(), rusted()]);
    const rnd = random(seed);
    const at = (x) => (right ? width - x : x);
    // Distance from the outer edge (top or bottom) to the piece's y.
    const y = (d) => (down ? height - d : d);
    // Rust round the joints and clamps, the rest of the pipe left clean.
    if (kind === 'valve') {
      rust(scene, red, rnd, at(44), y(EDGE), 22, false);
      rust(scene, red, rnd, at(EDGE), y(78), 30, true);
      rust(scene, red, rnd, at(EDGE), y(136), 18, true);
      flange(scene, metal, at(44), y(EDGE), false);
      valve(scene, metal, at(EDGE + 1), y(78));
      clamp(scene, metal, at(EDGE), y(136), true);
    } else if (kind === 'clamps') {
      rust(scene, red, rnd, at(EDGE), y(down ? 92 : 70), 22, true);
      rust(scene, red, rnd, at(58), y(EDGE), 18, false);
      clamp(scene, metal, at(EDGE), y(down ? 92 : 70), true);
    } else {
      rust(scene, red, rnd, at(30), y(EDGE), 34, false);
      ammoCan(scene, paint, metal, at(30), y(EDGE + 3));
      clamp(scene, metal, at(EDGE), y(96), true);
    }
    // Shells in the bottom corners.
    if (!down) {
      shell(scene, { x: at(kind === 'can' ? 54 : 44), y: y(EDGE + 4.5), angle: (right ? -1 : 1) * (Math.PI / 2 + 0.25), rnd });
      if (kind === 'can') shell(scene, { x: at(64), y: y(EDGE + 3.5), angle: (right ? 1 : -1) * (Math.PI / 2 - 0.15), rnd });
    }
    // A clamp along the edge past the corner, with its rust.
    if (kind === 'clamps') {
      clamp(scene, metal, at(58), y(EDGE));
      if (down) scene.add(streak(at(58), y(EDGE + PIPE), 10 + rnd() * 5, rnd));
    }
    lamp(scene);
  };
}

// Along the edges: a clamp now and then, bleeding rust down the wall.
function fringe({ down, width, height, seed }) {
  return async (scene) => {
    const [metal, red] = await Promise.all([iron(), rusted()]);
    const rnd = random(seed);
    const edge = down ? height - EDGE : EDGE;
    const x = width * 0.3 + rnd() * 20;
    for (const at of [x - width, x, x + width]) {
      rust(scene, red, random(seed * 3), at, edge, 20, false);
      clamp(scene, metal, at, edge);
      // Rust runs down the wall, so only from the top pipe.
      if (down) scene.add(streak(at, edge - PIPE, 12, random(seed * 7)));
    }
    lamp(scene);
  };
}

const TOP = { width: 72, height: 176 };
const BOTTOM = { width: 72, height: 128 };

const hideout = {
  pieces: {
    rim: { width: 224, height: 224, build: pipeRim },
    'top-left': { ...TOP, build: corner({ down: true, right: false, ...TOP, seed: 51, kind: 'valve' }) },
    'top-right': { ...TOP, build: corner({ down: true, right: true, ...TOP, seed: 52, kind: 'clamps' }) },
    top: { width: 192, height: 40, build: fringe({ down: true, width: 192, height: 40, seed: 53 }) },
    'bottom-left': { ...BOTTOM, build: corner({ down: false, right: false, ...BOTTOM, seed: 61, kind: 'can' }) },
    'bottom-right': { ...BOTTOM, build: corner({ down: false, right: true, ...BOTTOM, seed: 62, kind: 'clamps' }) },
    bottom: { width: 192, height: 36, build: fringe({ down: false, width: 192, height: 36, seed: 63 }) },
  },
};

export default hideout;
