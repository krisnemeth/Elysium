/*
  Hunter, the hideout: the cell's ops base in a basement. The frame is a run
  of old steel pipe, bending round each corner, held to the wall by clamps
  that bleed rust. On the left a valve with its handwheel; down the right the
  welded mesh of a gun cage, padlocked at the foot; an ammo can and spent
  shotgun shells in the bottom left. Lit by the bare bulb overhead. Like the
  others, the long pieces keep to the side gutters; along the edges only
  clamps, which end before the content starts.
  Material (ambientCG, CC0): Metal021, for the pipe, its fittings and the
  ammo can's worn paint.
*/
import * as THREE from 'three';
import { lights, pbr, random, RIM_SIZE, RIM_WIDTH } from '../studio.js';

const steel = () => pbr('Metal021', { tint: '#8d847a', roughness: 0.75, metalness: 0.55, normalScale: 1.2, tile: 96 });
// Fittings: the same steel, a little darker and finer.
const iron = () => pbr('Metal021', { tint: '#a39a90', roughness: 0.65, metalness: 0.5, normalScale: 1, tile: 40 });
// The ammo can: plain olive paint, worn by the steel's roughness.
const olive = () => pbr('Metal021', { color: '#3c4228', map: null, roughness: 0.85, metalness: 0.15, normalScale: 0.8, tile: 60 });

const LIT = {
  colour: '#ffd09a',
  intensity: 600,
  fill: ['#2a3c52', '#120d09'],
  fillIntensity: 1.5,
  front: 1.2,
  top: { colour: '#ffd8a8', intensity: 1.1 },
};

const GUTTER = 32;
// The pipe's centre line, from the outer edge, and its radius.
const EDGE = RIM_WIDTH * 0.5;
const PIPE = 6;

/*
  The rim: a pipe round the panel. Straight lengths between the corners (their
  texture repeats exactly over the tiled length, so the 9-slice tiles) and a
  bend in each corner square.
*/
async function pipeRim(scene) {
  const S = RIM_SIZE, B = RIM_WIDTH, L = S - 2 * B;
  const metal = await steel();
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
  lights(scene, { centre: [S / 2, S / 2, 70], ...LIT });
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
  const paint = new THREE.MeshStandardMaterial({ color: '#6e1f17', roughness: 0.6, metalness: 0.3 });
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

/*
  Welded wire mesh, as on a gun cage: a grid of wires in a flat-bar frame,
  from (x0, y0) to (x1, y1). It sits in front of the pipe, which shows through.
*/
function mesh(scene, metal, { x0, y0, x1, y1, pitch = 5.5 }) {
  const wire = new THREE.MeshStandardMaterial({ color: '#5d5853', metalness: 0.7, roughness: 0.55 });
  const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0), xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
  for (let x = Math.min(x0, x1) + pitch / 2; x < Math.max(x0, x1); x += pitch) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, h, 6), wire);
    m.position.set(x, ym, PIPE + 2.6);
    scene.add(m);
  }
  for (let y = Math.min(y0, y1) + pitch / 2; y < Math.max(y0, y1); y += pitch) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, w, 6), wire);
    m.rotation.z = Math.PI / 2;
    m.position.set(xm, y, PIPE + 2);
    scene.add(m);
  }
  // The frame: flat bar round the edge.
  for (const [cx, cy, bw, bh] of [[xm, y0, w + 2.4, 2.4], [xm, y1, w + 2.4, 2.4], [x0, ym, 2.4, h + 2.4], [x1, ym, 2.4, h + 2.4]]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 1.4), metal([bw, bh]));
    b.position.set(cx, cy, PIPE + 3.4);
    scene.add(b);
  }
}

// A padlock hanging from the cage at (x, y): steel shackle, brass body.
function padlock(scene, x, y) {
  const steelMat = new THREE.MeshStandardMaterial({ color: '#b9b4ab', metalness: 1, roughness: 0.35 });
  const brass = new THREE.MeshStandardMaterial({ color: '#a8823f', metalness: 1, roughness: 0.4 });
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.6, 10, 24, Math.PI), steelMat);
  shackle.position.set(x, y - 2, PIPE + 5);
  scene.add(shackle);
  const body = new THREE.Mesh(new THREE.BoxGeometry(7, 6.5, 2.6), brass);
  body.position.set(x, y - 5.2, PIPE + 5);
  body.rotation.z = 0.08;
  scene.add(body);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.7, 12), new THREE.MeshBasicMaterial({ color: '#1a120a' }));
  hole.position.set(x + 0.1, y - 6, PIPE + 6.35);
  scene.add(hole);
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
    const [metal, paint] = await Promise.all([iron(), olive()]);
    const rnd = random(seed);
    const at = (x) => (right ? width - x : x);
    // Distance from the outer edge (top or bottom) to the piece's y.
    const y = (d) => (down ? height - d : d);
    if (kind === 'valve') {
      flange(scene, metal, at(44), y(EDGE), false);
      valve(scene, metal, at(EDGE + 1), y(78));
      clamp(scene, metal, at(EDGE), y(136), true);
    } else if (kind === 'cage') {
      // The cage's mesh down the side, over the pipe and the padding, clear of the content.
      mesh(scene, metal, { x0: at(1.5), y0: y(EDGE + 10), x1: at(GUTTER - 2), y1: y(down ? 150 : 104) });
      if (!down) padlock(scene, at(GUTTER - 2), y(64));
    } else {
      ammoCan(scene, paint, metal, at(30), y(EDGE + 3));
      clamp(scene, metal, at(EDGE), y(96), true);
    }
    // Shells in the bottom corners.
    if (!down) {
      shell(scene, { x: at(kind === 'can' ? 54 : 44), y: y(EDGE + 4.5), angle: (right ? -1 : 1) * (Math.PI / 2 + 0.25), rnd });
      if (kind === 'can') shell(scene, { x: at(64), y: y(EDGE + 3.5), angle: (right ? 1 : -1) * (Math.PI / 2 - 0.15), rnd });
    }
    // A clamp along the edge past the corner, with its rust.
    if (kind === 'cage') {
      clamp(scene, metal, at(58), y(EDGE));
      if (down) scene.add(streak(at(58), y(EDGE + PIPE), 10 + rnd() * 5, rnd));
    }
    const inwards = right ? -150 : width + 150;
    lights(scene, { ...LIT, centre: [inwards, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

// Along the edges: a clamp now and then, bleeding rust down the wall.
function fringe({ down, width, height, seed }) {
  return async (scene) => {
    const metal = await iron();
    const rnd = random(seed);
    const edge = down ? height - EDGE : EDGE;
    const x = width * 0.3 + rnd() * 20;
    for (const at of [x - width, x, x + width]) {
      clamp(scene, metal, at, edge);
      // Rust runs down the wall, so only from the top pipe.
      if (down) scene.add(streak(at, edge - PIPE, 12, random(seed * 7)));
    }
    lights(scene, { ...LIT, centre: [width / 2, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

const TOP = { width: 72, height: 176 };
const BOTTOM = { width: 72, height: 128 };

const hideout = {
  pieces: {
    rim: { width: 224, height: 224, build: pipeRim },
    'top-left': { ...TOP, build: corner({ down: true, right: false, ...TOP, seed: 51, kind: 'valve' }) },
    'top-right': { ...TOP, build: corner({ down: true, right: true, ...TOP, seed: 52, kind: 'cage' }) },
    top: { width: 192, height: 40, build: fringe({ down: true, width: 192, height: 40, seed: 53 }) },
    'bottom-left': { ...BOTTOM, build: corner({ down: false, right: false, ...BOTTOM, seed: 61, kind: 'can' }) },
    'bottom-right': { ...BOTTOM, build: corner({ down: false, right: true, ...BOTTOM, seed: 62, kind: 'cage' }) },
    bottom: { width: 192, height: 36, build: fringe({ down: false, width: 192, height: 36, seed: 63 }) },
  },
};

export default hideout;
