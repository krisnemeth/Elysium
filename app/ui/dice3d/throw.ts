import * as THREE from 'three';
import { THROW_SECONDS, THROW_STAGGER_MS } from './timing';

/*
  One throw, simulated up front: the dice fly in from the near wall, fall,
  bounce off the floor (a resting die has its centre at y = 0), the walls and
  each other, with friction. From about a third of the way in, a damped
  spring draws each die to its slot; whatever distance is left is blended out
  at the end, so every die lands exactly on its slot. Dice that aren't being
  thrown (a Willpower reroll) stay put and get knocked against.
*/

export type DiePath = {
  // Seconds after the throw starts, and how long this die is in flight.
  delay: number;
  duration: number;
  // x, y, z per step, and distance travelled up to each step.
  path: Float32Array;
  travel: Float32Array;
};

export type Bounds = { halfWidth: number; halfDepth: number };

const HZ = 120;
const DT = 1 / HZ;
const GRAVITY = 28;
// Reach of a die from its centre: against the walls, and against another die.
const WALL_REACH = 0.95;
const DIE_RADIUS = 0.82;
const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

type Body = {
  index: number;
  slot: THREE.Vector3;
  p: THREE.Vector3;
  v: THREE.Vector3;
  delay: number;
  steps: number;
  out?: DiePath;
};

export function planThrow(slots: THREE.Vector3[], rolled: number[], bounds: Bounds) {
  const bx = bounds.halfWidth - WALL_REACH;
  const bz = bounds.halfDepth - WALL_REACH;
  const random = Math.random;

  const bodies: Body[] = rolled.map((index, k) => {
    const duration = THROW_SECONDS + random() * 0.35;
    const steps = Math.ceil(duration * HZ);
    return {
      index,
      slot: slots[index],
      p: new THREE.Vector3((random() * 2 - 1) * bx * 0.8, 2.2 + random() * 0.8, bz),
      v: new THREE.Vector3((random() * 2 - 1) * 6, 0.5 + random(), -(9 + random() * 5)),
      delay: (k * THROW_STAGGER_MS) / 1000,
      steps,
      out: { delay: (k * THROW_STAGGER_MS) / 1000, duration, path: new Float32Array((steps + 1) * 3), travel: new Float32Array(steps + 1) },
    };
  });
  const resting = slots.filter((_, i) => !rolled.includes(i));

  const bounce = (pos: number, vel: number, limit: number): [number, number] =>
    pos > limit ? [limit, -Math.abs(vel) * 0.55] : pos < -limit ? [-limit, Math.abs(vel) * 0.55] : [pos, vel];
  const n = new THREE.Vector3();
  const prev = new THREE.Vector3();

  const total = Math.max(...bodies.map((b) => Math.round(b.delay * HZ) + b.steps));
  for (let tick = 0; tick <= total; tick++) {
    const active = bodies.filter((b) => {
      const local = tick - Math.round(b.delay * HZ);
      return local >= 0 && local <= b.steps;
    });

    for (const b of active) {
      const local = tick - Math.round(b.delay * HZ);
      const out = b.out!;
      if (local > 0) {
        const pull = smoothstep(0.3, 0.8, local / b.steps);
        b.v.x += pull * (45 * (b.slot.x - b.p.x) - 11 * b.v.x) * DT;
        b.v.z += pull * (45 * (b.slot.z - b.p.z) - 11 * b.v.z) * DT;
        b.v.y -= GRAVITY * DT;
        prev.copy(b.p);
        b.p.addScaledVector(b.v, DT);
        if (b.p.y < 0) {
          b.p.y = 0;
          if (b.v.y < 0) {
            b.v.y = -b.v.y * 0.4 < 0.8 ? 0 : -b.v.y * 0.4;
            b.v.x *= 0.8;
            b.v.z *= 0.8;
          }
        }
        [b.p.x, b.v.x] = bounce(b.p.x, b.v.x, bx);
        [b.p.z, b.v.z] = bounce(b.p.z, b.v.z, bz);
        out.travel[local] = out.travel[local - 1] + b.p.distanceTo(prev);
      }
    }

    // Dice knock into each other (and into dice already lying in the tray).
    for (let i = 0; i < active.length; i++) {
      const a = active[i];
      const others: { p: THREE.Vector3; v?: THREE.Vector3 }[] = [...active.slice(i + 1), ...resting.map((p) => ({ p }))];
      for (const o of others) {
        n.subVectors(o.p, a.p);
        const d = n.length();
        if (d >= DIE_RADIUS * 2 || d === 0) continue;
        n.divideScalar(d);
        const overlap = DIE_RADIUS * 2 - d;
        if (o.v) {
          a.p.addScaledVector(n, -overlap / 2);
          o.p.addScaledVector(n, overlap / 2);
          const closing = a.v.dot(n) - o.v.dot(n);
          if (closing > 0) {
            const impulse = closing * 0.75; // (1 + restitution) / 2, restitution 0.5
            a.v.addScaledVector(n, -impulse);
            o.v.addScaledVector(n, impulse);
          }
        } else {
          a.p.addScaledVector(n, -overlap);
          const closing = a.v.dot(n);
          if (closing > 0) a.v.addScaledVector(n, -closing * 1.5);
        }
        a.p.y = Math.max(0, a.p.y);
      }
    }

    for (const b of active) {
      const local = tick - Math.round(b.delay * HZ);
      b.out!.path.set([b.p.x, b.p.y, b.p.z], local * 3);
    }
  }

  const plan = new Map<number, DiePath>();
  for (const b of bodies) {
    const { path, travel } = b.out!;
    const end = b.steps * 3;
    const miss = [b.slot.x - path[end], b.slot.y - path[end + 1], b.slot.z - path[end + 2]];
    for (let i = 0; i <= b.steps; i++) {
      const w = smoothstep(0.75, 1, i / b.steps);
      for (let c = 0; c < 3; c++) path[i * 3 + c] += miss[c] * w;
    }
    if (travel[b.steps] === 0) travel[b.steps] = 1;
    plan.set(b.index, b.out!);
  }
  return plan;
}

// Position along a planned path at progress t (0..1), and spin progress
// (share of the distance travelled, so the spin slows as the die does).
export function sample(path: DiePath, t: number, into: THREE.Vector3) {
  const steps = path.travel.length - 1;
  const k = Math.min(steps - 1, Math.max(0, Math.floor(t * steps)));
  const a = Math.min(1, t * steps - k);
  const p = path.path;
  into.set(p[k * 3] + (p[k * 3 + 3] - p[k * 3]) * a, p[k * 3 + 1] + (p[k * 3 + 4] - p[k * 3 + 1]) * a, p[k * 3 + 2] + (p[k * 3 + 5] - p[k * 3 + 2]) * a);
  return (path.travel[k] + (path.travel[k + 1] - path.travel[k]) * a) / path.travel[steps];
}
