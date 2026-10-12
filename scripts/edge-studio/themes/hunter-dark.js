/*
  Hunter, The cabin: a frame of rough-sawn, weathered timber, its grain
  running along each side. A hunter's cabin, patched up and barricaded: rope
  lashed round a corner with its end hanging down the side, forged iron
  straps nailed down the others, square nails bleeding rust along the edges,
  spent shotgun shells in the bottom corners. Lit by the bare bulb overhead,
  with the window's cold light as the fill. Like the others, the long pieces
  keep to the side gutters; along the edges only nails, which end before the
  content starts.
  Materials (ambientCG, CC0): Wood062, Metal025, Rope001.
*/
import * as THREE from 'three';
import { lights, pbr, random, rim, RIM_WIDTH } from '../studio.js';

const GRAIN = 96;
const wood = () => pbr('Wood062', { tint: '#86684f', roughness: 0.95, normalScale: 2, tile: GRAIN });
const iron = () => pbr('Metal025', { tint: '#4a433d', roughness: 0.85, metalness: 0.35, normalScale: 0.8, tile: 220 });
const rope = () => pbr('Rope001', { tint: '#a8977a', roughness: 1, normalScale: 2, tile: 10 });

const LIT = {
  colour: '#ffd09a',
  intensity: 600,
  fill: ['#2a3c52', '#120d09'],
  fillIntensity: 1.5,
  front: 1.2,
  top: { colour: '#ffd8a8', intensity: 1.1 },
};

const GUTTER = 32;
const EDGE = RIM_WIDTH * 0.5;

// A square-cut nail head, its face towards the viewer.
function nail(material, x, y, rnd, size = 2.1) {
  const g = new THREE.CylinderGeometry(size, size * 1.05, 1.1, 4, 1);
  g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, material([1, 1]));
  m.rotation.z = Math.PI / 4 + (rnd() - 0.5) * 0.6;
  m.position.set(x, y, 3.6);
  return m;
}

// A rust streak running down from a nail (`down` is the direction on screen).
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
    new THREE.PlaneGeometry(5 + rnd() * 2.5, length * 0.7),
    new THREE.MeshStandardMaterial({ color: '#4a2a17', alphaMap: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.28, roughness: 1, depthWrite: false }),
  );
  m.position.set(x, y + (down ? -length * 0.35 : length * 0.35), 3.2);
  if (!down) m.rotation.z = Math.PI;
  return m;
}

// A forged iron strap with rounded ends, from (x, y) along `angle`, nailed every so often.
function strap(scene, metal, { x, y, length, angle, width = 7.5, rnd }) {
  const shape = new THREE.Shape();
  const r = width / 2;
  shape.moveTo(0, -r);
  shape.lineTo(length - r, -r);
  shape.absarc(length - r, 0, r, -Math.PI / 2, Math.PI / 2);
  shape.lineTo(0, r);
  shape.absarc(0, 0, r, Math.PI / 2, (3 * Math.PI) / 2);
  const g = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.45, bevelSegments: 2, curveSegments: 10 });
  // A little hammered and warped.
  const pos = g.attributes.position;
  for (let k = 0; k < pos.count; k++) pos.setZ(k, pos.getZ(k) + 0.35 * Math.sin(pos.getX(k) * 0.21 + angle) + 0.2 * Math.sin(pos.getX(k) * 0.9));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, metal([1, 1]));
  m.position.set(x, y, 2);
  m.rotation.z = angle;
  scene.add(m);
  const dir = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
  for (let d = 1; d <= length - 2; d += 14 + rnd() * 8) scene.add(nail(metal, x + dir.x * d, y + dir.y * d, rnd, 1.6));
}

// A length of rope along `points`, with an optional knot and frayed end.
function cord(scene, material, points, { radius = 1.5, knot = false, rnd } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const length = curve.getLength();
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, Math.round(length * 1.5)), radius, 12, false), material([length, radius * 2 * Math.PI])));
  if (!knot) return;
  const end = curve.getPointAt(1);
  const k = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.7, 16, 12), material([radius * 8, radius * 8]));
  k.scale.set(1, 1.25, 0.9);
  k.position.copy(end);
  scene.add(k);
  // The frayed end.
  for (let i = 0; i < 6; i++) {
    const a = (i / 5 - 0.5) * 1.1 + (rnd() - 0.5) * 0.2, l = 5 + rnd() * 5;
    const c = new THREE.CatmullRomCurve3([end.clone(), end.clone().add(new THREE.Vector3(Math.sin(a) * l * 0.4, -l * 0.5, 0.5)), end.clone().add(new THREE.Vector3(Math.sin(a) * l * 0.8, -l, 0))]);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 8, 0.32, 5, false), material([l, 2])));
  }
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
  group.position.set(x, y, 5);
  scene.add(group);
}

// Rope lashed round a corner: turns across the mitre, then the end hanging down (or up) the side.
function lashing(scene, material, { at, y, rnd, hang }) {
  for (let i = 0; i < 4; i++) {
    const o = 7 + i * 5.6;
    cord(scene, material, [[at(-3), y(o), 0], [at(o * 0.5), y(o * 0.5), 4.5], [at(o), y(-3), 0]], { radius: 2.7 });
  }
  const pts = [[at(16), y(12), 3]];
  for (let d = 26; d <= hang; d += 18) pts.push([at(17 + (rnd() - 0.5) * 4), y(d), 3.2]);
  cord(scene, material, pts, { radius: 2, knot: true, rnd });
}

function corner({ down, right, width, height, seed, kind }) {
  return async (scene) => {
    const [metal, line] = await Promise.all([iron(), rope()]);
    const rnd = random(seed);
    const at = (x) => (right ? width - x : x);
    // Distance from the outer edge (top or bottom) to the piece's y.
    const y = (d) => (down ? height - d : d);
    if (kind === 'rope') lashing(scene, line, { at, y, rnd, hang: down ? 96 : 62 });
    else {
      // An L of iron: along the edge, then down (or up) the side.
      const v = down ? -1 : 1;
      strap(scene, metal, { x: at(EDGE + 6), y: y(EDGE + 1), length: 40, angle: right ? Math.PI : 0, rnd });
      strap(scene, metal, { x: at(EDGE + 7), y: y(EDGE + 1), length: down ? 118 : 84, angle: (v * Math.PI) / 2, rnd });
    }
    // Shells in the bottom corners.
    if (!down) {
      shell(scene, { x: at(kind === 'rope' ? 36 : 44), y: y(EDGE + 4.5), angle: (right ? -1 : 1) * (Math.PI / 2 + 0.25), rnd });
      if (kind !== 'rope') shell(scene, { x: at(58), y: y(EDGE + 3.5), angle: (right ? 1 : -1) * (Math.PI / 2 - 0.15), rnd });
    }
    // Nails with their rust along the edge, past the corner.
    for (let x = GUTTER + 12 + rnd() * 8; x < width - 4; x += 22 + rnd() * 14) {
      scene.add(nail(metal, at(x), y(EDGE), rnd));
      scene.add(streak(at(x), y(EDGE), 7 + rnd() * 6, rnd, true));
    }
    const inwards = right ? -150 : width + 150;
    lights(scene, { ...LIT, centre: [inwards, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

// Along the edges: square nails, now and then two together, each bleeding rust.
function fringe({ down, width, height, seed }) {
  return async (scene) => {
    const metal = await iron();
    const rnd = random(seed);
    const edge = down ? height - EDGE : EDGE;
    const thrice = (x, make) => [x - width, x, x + width].forEach((at) => make(at));
    for (let x = 10 + rnd() * 10; x < width - 6; x += 34 + rnd() * 30) {
      const pair = rnd() < 0.35, len = 6 + rnd() * 7, r = random(seed * 100 + x);
      thrice(x, (at) => {
        const rr = random(seed * 100 + x);
        scene.add(nail(metal, at, edge + (rr() - 0.5) * 2, rr));
        scene.add(streak(at, edge, len, r, true));
        if (pair) scene.add(nail(metal, at + 6, edge + (rr() - 0.5) * 2, rr));
      });
    }
    lights(scene, { ...LIT, centre: [width / 2, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

const TOP = { width: 72, height: 176 };
const BOTTOM = { width: 72, height: 128 };

const cabin = {
  pieces: {
    rim: { width: 224, height: 224, build: async (scene) => rim(scene, { material: await wood(), seed: 9, height: 2.6, lit: LIT, grain: GRAIN, rough: 0.12, beam: true }) },
    'top-left': { ...TOP, build: corner({ down: true, right: false, ...TOP, seed: 51, kind: 'rope' }) },
    'top-right': { ...TOP, build: corner({ down: true, right: true, ...TOP, seed: 52, kind: 'iron' }) },
    top: { width: 192, height: 40, build: fringe({ down: true, width: 192, height: 40, seed: 53 }) },
    'bottom-left': { ...BOTTOM, build: corner({ down: false, right: false, ...BOTTOM, seed: 61, kind: 'iron' }) },
    'bottom-right': { ...BOTTOM, build: corner({ down: false, right: true, ...BOTTOM, seed: 62, kind: 'rope' }) },
    bottom: { width: 192, height: 36, build: fringe({ down: false, width: 192, height: 36, seed: 63 }) },
  },
};

export default cabin;
