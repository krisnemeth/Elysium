/*
  Werewolf, Moonlit forest: dark oak bark, mostly grown over with moss. In the corners an old branch reaches down each side and a root
  climbs up from the bottom, both wound thick with ivy (the commonest climber in an
  Irish wood), mossy, with bracket fungi and small mushrooms in the moss;
  between them moss and leaves, which end before the content starts. Like the cave, the long pieces
  keep to the side gutters.
  Colours follow the forest backdrop: cool, grey-green, lit by the moon.
  Materials (ambientCG, CC0): Bark014, Moss002, LeafSet017 (ivy).
*/
import { atlasLeaves, bracket, limb, lights, mound, mushroom, pbr, random, rim, RIM_WIDTH } from '../studio.js';
import * as THREE from 'three';

const bark = () => pbr('Bark014', { tint: '#7d7a72', roughness: 0.9, normalScale: 1.8, tile: 96 });
const moss = () => pbr('Moss002', { tint: '#74887a', roughness: 1, normalScale: 2.2, tile: 64 });
// The six ivy leaves in LeafSet017's atlas.
const IVY = [[52, 17, 338, 317], [635, 55, 259, 269], [65, 378, 350, 317], [641, 405, 290, 248], [606, 707, 314, 294], [46, 710, 395, 302]];
const ivy = () => atlasLeaves('LeafSet017', IVY, { tint: '#647a6a', roughness: 0.85 });

const LIT = {
  colour: '#c8d5e6',
  intensity: 560,
  fill: ['#2c3c40', '#0a110e'],
  fillIntensity: 1.6,
  front: 1.4,
  top: { colour: '#dfe9f2', intensity: 1.5 },
};

const GUTTER = 32;
// The fringe hangs from the rim's middle and ends just short of the content.
const FRINGE = GUTTER - RIM_WIDTH * 0.5 - 3;

/*
  Ivy along a limb: leaves every few px, alternating sides, turned and tilted
  so they foreshorten like real ones. `hang` points the tips down (from the
  top) or up (from the bottom). Leaves keep their outer edge inside `maxX`.
*/
function windIvy(scene, leaf, { curve, length, rnd, hang, from = 0.08, every = 9, size = [8, 13], maxX = GUTTER - 1, right, width }) {
  const p = new THREE.Vector3();
  let side = 1;
  for (let d = length * from; d < length; d += every * (0.7 + rnd() * 0.6)) {
    const s = d / length;
    curve.getPointAt(s, p);
    const h = (size[0] + rnd() * (size[1] - size[0])) * (1 - 0.35 * s);
    const m = leaf(Math.floor(rnd() * 6), h);
    side = -side;
    // Tips down from the top, up from the bottom; leaning outwards or along.
    const lean = side * (0.25 + rnd() * 0.7);
    m.rotation.set((rnd() - 0.5) * 1.3, (rnd() - 0.5) * 1.1, (hang ? Math.PI : 0) + lean, 'ZXY');
    m.position.set(p.x, p.y, p.z + 2 + rnd() * 2);
    // Keep each leaf clear of the content: move it outwards if it would cross.
    const excess = (right ? width - p.x : p.x) + h * 0.6 - maxX;
    if (excess > 0) m.position.x += right ? excess : -excess;
    scene.add(m);
  }
}

/*
  A corner: a mossy mass, an old branch (from the top) or root (from the
  bottom) along the side, wound with ivy. `right` mirrors it.
*/
function corner({ down, right, width, height, seed, reach }) {
  return async (scene) => {
    const [wood, green, leaf] = await Promise.all([bark(), moss(), ivy()]);
    const rnd = random(seed);
    const at = (x) => (right ? width - x : x);
    const y = (d) => (down ? height - d : d);
    const edge = RIM_WIDTH * 0.5;

    // The limb: in from the corner, then along the side, wavering.
    const points = [[at(-6), y(edge - 2), 0], [at(10), y(edge + 4), 3]];
    for (let d = 26; d <= reach; d += 22) points.push([at(13 + (rnd() - 0.5) * 9), y(edge + d), 3 + rnd() * 2]);
    const main = limb({ points, radius: [down ? 6.5 : 8, 1.4], seed: seed * 3 });
    scene.add(new THREE.Mesh(main.geometry, wood([40, main.length])));
    // A thinner twig off it.
    const t0 = new THREE.Vector3();
    main.curve.getPointAt(0.3, t0);
    const twig = limb({ points: [[t0.x, t0.y, t0.z], [at(6), y(edge + reach * 0.5), 4], [at(9 + rnd() * 4), y(edge + reach * 0.72), 5]], radius: [2.4, 0.8], seed: seed * 5 });
    scene.add(new THREE.Mesh(twig.geometry, wood([16, twig.length])));

    // Moss creeping over the wood.
    const p = new THREE.Vector3();
    for (const [l, r0] of [[main, down ? 6.5 : 8], [twig, 2.4]])
      for (let d = 2; d < l.length * 0.85; d += 3 + rnd() * 5) {
        if (rnd() < 0.3) continue;
        l.curve.getPointAt(d / l.length, p);
        const r = r0 * (1 - (0.75 * d) / l.length);
        scene.add(mound(green, p.x + (rnd() - 0.5) * r, p.y, r * (0.7 + rnd() * 0.6), 1.2 + rnd() * 1.6, seed * 17 + d + r0, down));
      }

    // Bracket fungi in tiers on the main limb, above the moss.
    for (const s of down ? [0.3, 0.36, 0.62] : [0.28, 0.34, 0.58, 0.64]) {
      main.curve.getPointAt(s, p);
      const f = bracket({ radius: 5.5 + rnd() * 2.5 - s * 2.5, seed: seed * 19 + s * 100 });
      f.position.set(p.x + (rnd() - 0.5) * 3, p.y, p.z + 4);
      f.rotation.z = (rnd() - 0.5) * 0.5;
      scene.add(f);
    }

    // Ivy on both, thick.
    windIvy(scene, leaf, { ...main, rnd, hang: down, every: 5.5, size: [9, 15], right, width });
    windIvy(scene, leaf, { ...twig, rnd, hang: down, every: 6.5, size: [7, 11], right, width });

    // Moss: a cushion in the corner, thinning inwards along the edge.
    for (let x = -4; x < width; x += 5 + rnd() * 5) {
      const heavy = Math.max(0, 1 - x / (width * 0.8));
      scene.add(mound(green, at(x), y(edge + 2), 6 + heavy * 10 + rnd() * 3, 3 + heavy * 6 + rnd() * 1.5, seed * 11 + x, down));
    }
    // Mushrooms in the moss at the foot of the root.
    if (!down)
      for (let i = 0; i < 6; i++) {
        const x = 4 + rnd() * 24;
        const m = mushroom({ height: 5 + rnd() * 7, cap: 3 + rnd() * 2.4, seed: seed * 23 + i, lean: (rnd() - 0.5) * 0.5, colour: rnd() < 0.5 ? '#76604a' : '#5a4532' });
        m.position.set(at(x), y(edge + 4 + rnd() * 3), 8 + rnd() * 3);
        scene.add(m);
      }
    // A few leaves along the edge, inside the fringe.
    for (let x = GUTTER + rnd() * 6; x < width - 4; x += 8 + rnd() * 10) {
      const m = leaf(Math.floor(rnd() * 6), 7 + rnd() * (FRINGE - 10));
      m.rotation.set((rnd() - 0.5) * 1.2, (rnd() - 0.5), (down ? Math.PI : 0) + (rnd() - 0.5) * 1.4, 'ZXY');
      m.position.set(at(x), y(edge + 3), 6);
      scene.add(m);
    }
    const inwards = right ? -150 : width + 150;
    lights(scene, { ...LIT, centre: [inwards, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

// The fringe: a line of moss with the odd leaf, tiling seamlessly.
function fringe({ down, width, height, seed }) {
  return async (scene) => {
    const [green, leaf] = await Promise.all([moss(), ivy()]);
    const rnd = random(seed);
    const edge = down ? height - RIM_WIDTH * 0.5 : RIM_WIDTH * 0.5;
    const thrice = (x, make) => [x - width, x, x + width].forEach((at) => scene.add(make(at)));
    for (let x = 0; x < width; x += 6 + rnd() * 6) {
      const w = 5 + rnd() * 7, h = 2.6 + rnd() * 2.8, s = seed * 7 + x;
      thrice(x, (at) => mound(green, at, edge + (down ? -2 : 2), w, h, s, down));
    }
    for (let x = 4 + rnd() * 8; x < width - 4; x += 9 + rnd() * 16) {
      const kind = Math.floor(rnd() * 6), h = 7 + rnd() * (FRINGE - 9), rx = (rnd() - 0.5) * 1.2, ry = rnd() - 0.5, rz = (down ? Math.PI : 0) + (rnd() - 0.5) * 1.2;
      thrice(x, (at) => {
        const m = leaf(kind, h);
        m.rotation.set(rx, ry, rz, 'ZXY');
        m.position.set(at, edge + (down ? -3 : 3), 6);
        return m;
      });
    }
    // Now and then a few mushrooms in the moss along the bottom.
    if (!down)
      for (let x = 30 + rnd() * 40; x < width - 10; x += 70 + rnd() * 60)
        for (let i = 0, n = 2 + Math.floor(rnd() * 3); i < n; i++) {
          const o = (rnd() - 0.5) * 10, h = 4 + rnd() * 5, cap = 2.6 + rnd() * 1.8, s = seed * 29 + x + i, lean = (rnd() - 0.5) * 0.5, colour = rnd() < 0.5 ? '#76604a' : '#5a4532';
          thrice(x + o, (at) => {
            const m = mushroom({ height: h, cap, seed: s, lean, colour });
            m.position.set(at, edge + 3, 9);
            return m;
          });
        }
    lights(scene, { ...LIT, centre: [width / 2, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

const TOP = { width: 72, height: 176 };
const BOTTOM = { width: 72, height: 128 };

const forest = {
  pieces: {
    rim: {
      width: 224,
      height: 224,
      build: async (scene) => {
        await rim(scene, { material: await bark(), seed: 5, height: 3, lit: LIT });
        // Moss grown over most of the bark; the bark shows along the outer edge.
        await rim(scene, { material: await moss(), seed: 5, height: 2.2, band: { from: 0.3, wobble: 0.28, lift: 1.4 } });
      },
    },
    'top-left': { ...TOP, build: corner({ down: true, right: false, ...TOP, seed: 31, reach: 150 }) },
    'top-right': { ...TOP, build: corner({ down: true, right: true, ...TOP, seed: 32, reach: 120 }) },
    top: { width: 192, height: 40, build: fringe({ down: true, width: 192, height: 40, seed: 33 }) },
    'bottom-left': { ...BOTTOM, build: corner({ down: false, right: false, ...BOTTOM, seed: 41, reach: 100 }) },
    'bottom-right': { ...BOTTOM, build: corner({ down: false, right: true, ...BOTTOM, seed: 42, reach: 84 }) },
    bottom: { width: 192, height: 36, build: fringe({ down: false, width: 192, height: 36, seed: 43 }) },
  },
};

export default forest;
