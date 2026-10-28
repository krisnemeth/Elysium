/*
  Werewolf, The cave: a wet rock rim, stalactites hanging from the top edge and
  stalagmites rising from the bottom, reaching for one another. The long, heavy
  ones grow in the corners, down and up the sides (over the border and the
  sidebar's padding, clear of the content); between them only a short fringe,
  which ends before the content starts.
  Colours follow the cave's backdrop: sepia-grey stone under a little
  firelight, with cool, wet highlights from the waterfall above.
  Material: ambientCG Rock020 (CC0); its vertical streaks read as flowstone.
*/
import * as THREE from 'three';
import { pbr, random, rim, lights, spike, mound, RIM_WIDTH } from '../studio.js';

const ROCK = 'Rock020';
const rock = () => pbr(ROCK, { tint: '#b0a698', roughness: 0.42, normalScale: 1.6 });
const LIT = {
  colour: '#f0d8c0',
  intensity: 620,
  fill: ['#3d4a55', '#16100b'],
  fillIntensity: 2,
  front: 1.9,
  top: { colour: '#a9cfdc', intensity: 1.8 },
};

// Where the content starts, from the frame's outer edge: the border plus the sidebar's padding.
const GUTTER = 32;
// The middle fringe hangs from the rim's middle and ends just short of the content.
const FRINGE = GUTTER - RIM_WIDTH * 0.5 - 3;

function formation(material, { x, edge, length, radius, seed, down, rnd }) {
  const geometry = spike({ length, radius, seed, power: down ? 1.3 : 0.9, bend: (rnd() - 0.5) * 0.35, lump: 0.2 });
  const mesh = new THREE.Mesh(geometry, material([radius * 2 * Math.PI, length]));
  mesh.position.set(x, edge, -2);
  if (down) mesh.rotation.z = Math.PI;
  mesh.rotation.y = rnd() * Math.PI * 2;
  return mesh;
}

/*
  A corner: a heavy mass of rock and the long formations, running along the
  side. `right` mirrors it. Light comes from the panel's middle (inwards).
*/
function corner({ down, right, width, height, seed, long }) {
  return async (scene) => {
    const material = await rock();
    const rnd = random(seed);
    const at = (x) => (right ? width - x : x);
    const edge = down ? height - RIM_WIDTH * 0.5 : RIM_WIDTH * 0.5;
    // The mass in the corner, tapering inwards into the fringe's ridge.
    for (let x = 0; x < width; x += 6 + rnd() * 6) {
      const heavy = Math.max(0, 1 - x / width);
      scene.add(mound(material, at(x), edge, 8 + heavy * 10 + rnd() * 4, 3 + heavy * 6 + rnd() * 2, seed * 13 + x, down));
    }
    // The long ones, in the gutter beside the content.
    long.forEach(([x, length, radius], i) => scene.add(formation(material, { x: at(x), edge, length, radius, seed: seed * 100 + i, down, rnd })));
    // Short ones between, no longer than the fringe.
    for (let x = GUTTER; x < width - 4; x += 5 + rnd() * 7)
      scene.add(formation(material, { x: at(x), edge, length: 4 + rnd() * (FRINGE - 4), radius: 3.2 + rnd() * 3, seed: seed * 300 + x, down, rnd }));
    const inwards = right ? -150 : width + 150;
    lights(scene, { ...LIT, centre: [inwards, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

/*
  The fringe along the middle: short formations on a ridge of rock, tiling
  seamlessly (anything near one end is repeated past the other).
*/
function fringe({ down, width, height, seed }) {
  return async (scene) => {
    const material = await rock();
    const rnd = random(seed);
    const edge = down ? height - RIM_WIDTH * 0.5 : RIM_WIDTH * 0.5;
    const thrice = (x, make) => [x - width, x, x + width].forEach((at) => scene.add(make(at)));
    for (let x = 0; x < width; x += 9 + rnd() * 8) {
      const w = 8 + rnd() * 8, h = 3 + rnd() * 3, s = seed * 7 + x;
      thrice(x, (at) => mound(material, at, edge, w, h, s, down));
    }
    for (let x = 3; x < width; x += 6 + rnd() * 12) {
      const length = 4 + rnd() * (FRINGE - 4), radius = 3.4 + rnd() * 3.4, s = seed * 100 + x, spin = rnd();
      thrice(x, (at) => formation(material, { x: at, edge, length, radius, seed: s, down, rnd: () => spin }));
    }
    lights(scene, { ...LIT, centre: [width / 2, down ? height - 420 : 420, 160], intensity: LIT.intensity * 5 });
  };
}

const TOP = { width: 72, height: 176 };
const BOTTOM = { width: 72, height: 128 };
// [distance from the outer edge, length, radius] for the long ones.
const LONG_TOP = [[16, 150, 9], [9, 100, 7], [24, 72, 6.5], [17, 44, 7.5]];
const LONG_BOTTOM = [[16, 104, 10], [8, 64, 7.5], [24, 48, 7]];

const cave = {
  material: ROCK,
  pieces: {
    rim: { width: 224, height: 224, build: async (scene) => rim(scene, { material: await rock(), seed: 7, lit: LIT }) },
    'top-left': { ...TOP, build: corner({ down: true, right: false, ...TOP, seed: 11, long: LONG_TOP }) },
    'top-right': { ...TOP, build: corner({ down: true, right: true, ...TOP, seed: 12, long: LONG_TOP.map(([x, l, r], i) => [x + (i % 2 ? 2 : -1), l * (i ? 0.85 : 0.8), r]) }) },
    top: { width: 192, height: 40, build: fringe({ down: true, width: 192, height: 40, seed: 13 }) },
    'bottom-left': { ...BOTTOM, build: corner({ down: false, right: false, ...BOTTOM, seed: 21, long: LONG_BOTTOM }) },
    'bottom-right': { ...BOTTOM, build: corner({ down: false, right: true, ...BOTTOM, seed: 22, long: LONG_BOTTOM.map(([x, l, r], i) => [x + (i % 2 ? -1 : 1), l * 0.9, r]) }) },
    bottom: { width: 192, height: 36, build: fringe({ down: false, width: 192, height: 36, seed: 23 }) },
  },
};

export default cave;
