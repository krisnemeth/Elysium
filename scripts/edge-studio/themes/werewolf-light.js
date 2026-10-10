/*
  Werewolf, The cave: a wet rock rim, stalactites hanging from the top edge and
  stalagmites rising from the bottom, at random lengths, reaching for one
  another. Lit by firelight from inside the cave.
  Material: ambientCG Rock020 (CC0), its vertical streaks read as flowstone.
*/
import * as THREE from 'three';
import { pbr, random, rim, lights, spike, noise3, RIM_WIDTH } from '../studio.js';

const ROCK = 'Rock020';
const rock = () => pbr(ROCK, { tint: '#a39486', roughness: 0.65 });
const LIT = { colour: '#ffae6e', intensity: 520, fill: ['#3a4756', '#1a0f08'], fillIntensity: 1.3, front: 1.1 };

// The ornament strips: wide enough for the widest sidebar, scaled to fit.
const WIDTH = 400;

// A lumpy mound of rock where formations meet the rim, so they grow out of it.
function mound(material, x, y, w, h, seed, down) {
  const n = noise3(seed);
  const g = new THREE.SphereGeometry(1, 32, 16);
  const pos = g.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const f = 1 + 0.25 * n(pos.getX(k) * 2, pos.getY(k) * 2, pos.getZ(k) * 2);
    pos.setXYZ(k, pos.getX(k) * w * f, pos.getY(k) * h * f, pos.getZ(k) * h * 1.2 * f);
  }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, material([w * 4, h * 4]));
  m.position.set(x, y, 0);
  if (down) m.rotation.z = Math.PI;
  return m;
}

// Formations along an edge. `down` hangs them from the top; otherwise they rise from the bottom.
async function formations(scene, { height, seed, down, count, long, short }) {
  const material = await rock();
  const rnd = random(seed);
  // The rim's middle: formations start inside it.
  const edge = down ? height - RIM_WIDTH * 0.5 : RIM_WIDTH * 0.5;
  // A ridge of mounds along the whole edge.
  for (let x = -6; x < WIDTH + 12; x += 9 + rnd() * 10) scene.add(mound(material, x, edge, 9 + rnd() * 9, 3 + rnd() * 3, seed * 7 + x, down));

  // Clusters: a long one with shorter ones around it.
  const xs = Array.from({ length: count }, () => 6 + rnd() * (WIDTH - 12)).sort((a, b) => a - b);
  xs.forEach((x, i) => {
    const big = rnd() < long.chance;
    const length = big ? long.min + rnd() * (long.max - long.min) : short.min + rnd() * (short.max - short.min);
    const radius = big ? 8.5 + rnd() * 4.5 : 4 + rnd() * 3.5;
    const geometry = spike({ length, radius, seed: seed * 100 + i, power: down ? 1.35 : 0.95, bend: (rnd() - 0.5) * 0.5, lump: 0.22 });
    const mesh = new THREE.Mesh(geometry, material([radius * 2 * Math.PI, length]));
    mesh.position.set(x, edge, -2);
    if (down) mesh.rotation.z = Math.PI;
    mesh.rotation.y = rnd() * Math.PI * 2;
    scene.add(mesh);
    if (big) scene.add(mound(material, x, edge, radius * 1.6, 4, seed * 31 + i, down));
  });
}

const cave = {
  material: ROCK,
  pieces: {
    rim: {
      width: 224,
      height: 224,
      build: async (scene) => rim(scene, { material: await rock(), seed: 7, lit: LIT }),
    },
    top: {
      width: WIDTH,
      height: 96,
      build: async (scene) => {
        await formations(scene, { height: 96, seed: 11, down: true, count: 30, long: { chance: 0.25, min: 34, max: 74 }, short: { min: 7, max: 22 } });
        // The fire is in the middle of the panel, far below the top edge.
        lights(scene, { ...LIT, centre: [WIDTH / 2, -240, 120], intensity: LIT.intensity * 3 });
      },
    },
    bottom: {
      width: WIDTH,
      height: 64,
      build: async (scene) => {
        await formations(scene, { height: 64, seed: 23, down: false, count: 18, long: { chance: 0.3, min: 22, max: 44 }, short: { min: 6, max: 16 } });
        lights(scene, { ...LIT, centre: [WIDTH / 2, 64 + 240, 120], intensity: LIT.intensity * 3 });
      },
    },
  },
};

export default cave;
