import * as THREE from 'three';
import { THROW_SECONDS, THROW_STAGGER_MS } from './timing';

/*
  One throw, simulated up front. The dice fly in over the near wall, fall,
  bounce off the floor, the walls and each other, and slide to a stop with
  friction, wherever that happens to be, as real dice would.

  Spin is physical too: in the air a die keeps the spin it was thrown with;
  on the floor, friction makes it roll with its motion. To land on the rolled
  value, the die's orientation is offset once, before the throw (see
  `landing`), so the same tumble ends exactly on the right face. Nothing
  steers the die along the way.
*/

export type DiePath = {
  // Seconds after the throw starts, and how long this die is in motion.
  delay: number;
  duration: number;
  // Per step: position (x, y, z) and the rotation so far (x, y, z, w).
  path: Float32Array;
  spin: Float32Array;
  rest: THREE.Vector3;
};

export type Bounds = { halfWidth: number; halfDepth: number };

const HZ = 120;
const DT = 1 / HZ;
const GRAVITY = 28;
// Sliding friction on the floor (units/s²), and how far a die reaches from
// its centre: against the walls, and against another die.
const FRICTION = 7;
const WALL_REACH = 0.95;
const DIE_RADIUS = 0.85;
const UP = new THREE.Vector3(0, 1, 0);

const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

type Body = {
  index: number;
  p: THREE.Vector3;
  v: THREE.Vector3;
  w: THREE.Vector3;
  q: THREE.Quaternion;
  delay: number;
  steps: number;
  out: DiePath;
};

/*
  `restY` is the height of a die's centre when it lies flat on the floor,
  `radius` that height above the floor (the rolling radius).
  `still` holds dice that aren't thrown (a Willpower reroll): they stay put
  and get knocked against.
*/
export function planThrow(rolled: number[], bounds: Bounds, restY: number, radius: number, still: THREE.Vector3[]) {
  const bx = bounds.halfWidth - WALL_REACH;
  const bz = bounds.halfDepth - WALL_REACH;
  const random = Math.random;

  const bodies: Body[] = rolled.map((index, k) => {
    const duration = THROW_SECONDS + random() * 0.35;
    const steps = Math.ceil(duration * HZ);
    const delay = (k * THROW_STAGGER_MS) / 1000;
    return {
      index,
      p: new THREE.Vector3((random() * 2 - 1) * bx * 0.85, restY + 2 + random() * 0.8, bz),
      v: new THREE.Vector3((random() * 2 - 1) * 4, 0.5 + random(), -(5 + random() * 5)),
      w: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).setLength(12 + random() * 10),
      q: new THREE.Quaternion(),
      delay,
      steps,
      out: { delay, duration, path: new Float32Array((steps + 1) * 3), spin: new Float32Array((steps + 1) * 4), rest: new THREE.Vector3() },
    };
  });

  const bounce = (pos: number, vel: number, limit: number): [number, number] =>
    pos > limit ? [limit, -Math.abs(vel) * 0.5] : pos < -limit ? [-limit, Math.abs(vel) * 0.5] : [pos, vel];
  const n = new THREE.Vector3();
  const roll = new THREE.Vector3();
  const dq = new THREE.Quaternion();
  const localStep = (b: Body, tick: number) => tick - Math.round(b.delay * HZ);

  const total = Math.max(...bodies.map((b) => Math.round(b.delay * HZ) + b.steps));
  for (let tick = 0; tick <= total; tick++) {
    const active = bodies.filter((b) => localStep(b, tick) >= 0 && localStep(b, tick) <= b.steps);

    for (const b of active) {
      const local = localStep(b, tick);
      if (local === 0) continue;
      const settle = smoothstep(0.65, 1, local / b.steps);
      b.v.y -= GRAVITY * DT;
      b.p.addScaledVector(b.v, DT);
      const grounded = b.p.y <= restY;
      if (grounded) {
        b.p.y = restY;
        if (b.v.y < 0) {
          b.v.y = -b.v.y * 0.35 < 1 ? 0 : -b.v.y * 0.35;
          b.v.x *= 0.85;
          b.v.z *= 0.85;
        }
        // Friction, firmer towards the end so every die comes to rest.
        const speed = Math.hypot(b.v.x, b.v.z);
        const slow = speed > 0 ? Math.max(0, 1 - ((FRICTION + settle * 30) * DT) / speed) : 0;
        b.v.x *= slow;
        b.v.z *= slow;
        // Rolling: friction turns the spin towards the motion.
        roll.crossVectors(UP, roll.set(b.v.x, 0, b.v.z)).divideScalar(radius);
        b.w.lerp(roll, 0.2);
      } else {
        b.w.multiplyScalar(0.997);
      }
      [b.p.x, b.v.x] = bounce(b.p.x, b.v.x, bx);
      [b.p.z, b.v.z] = bounce(b.p.z, b.v.z, bz);
      const angle = b.w.length() * DT;
      if (angle > 0) {
        dq.setFromAxisAngle(n.copy(b.w).normalize(), angle);
        b.q.premultiply(dq);
      }
    }

    // Dice knock into each other (and into dice already lying in the tray),
    // sideways only, so they never come to rest on top of one another.
    for (let i = 0; i < active.length; i++) {
      const a = active[i];
      if (localStep(a, tick) === 0) continue;
      const others: { p: THREE.Vector3; v?: THREE.Vector3 }[] = [...active.slice(i + 1), ...still.map((p) => ({ p }))];
      for (const o of others) {
        n.set(o.p.x - a.p.x, 0, o.p.z - a.p.z);
        const d = n.length();
        if (d >= DIE_RADIUS * 2 || Math.abs(o.p.y - a.p.y) > 1.4) continue;
        if (d === 0) n.set(1, 0, 0);
        else n.divideScalar(d);
        const overlap = DIE_RADIUS * 2 - d;
        if (o.v) {
          a.p.addScaledVector(n, -overlap / 2);
          o.p.addScaledVector(n, overlap / 2);
          const closing = a.v.dot(n) - o.v.dot(n);
          if (closing > 0) {
            const impulse = closing * 0.75; // restitution 0.5
            a.v.addScaledVector(n, -impulse);
            o.v.addScaledVector(n, impulse);
          }
        } else {
          a.p.addScaledVector(n, -overlap);
          const closing = a.v.dot(n);
          if (closing > 0) a.v.addScaledVector(n, -closing * 1.5);
        }
      }
      [a.p.x] = bounce(a.p.x, 0, bx);
      [a.p.z] = bounce(a.p.z, 0, bz);
    }

    for (const b of active) {
      const local = localStep(b, tick);
      b.out.path.set([b.p.x, b.p.y, b.p.z], local * 3);
      b.out.spin.set([b.q.x, b.q.y, b.q.z, b.q.w], local * 4);
    }
  }

  const plan = new Map<number, DiePath>();
  for (const b of bodies) {
    b.out.rest.set(b.p.x, restY, b.p.z);
    // Make sure the last steps sit on the floor.
    for (let i = 0; i <= b.steps; i++) {
      const w = smoothstep(0.85, 1, i / b.steps);
      b.out.path[i * 3 + 1] += (restY - b.out.path[b.steps * 3 + 1]) * w;
    }
    plan.set(b.index, b.out);
  }
  return plan;
}

/*
  The constant offset that makes this path end on `target`: rendering
  spin(t) × landing gives the same tumble, finishing exactly on the face that
  shows the rolled value.
*/
export function landing(path: DiePath, target: THREE.Quaternion) {
  const s = path.spin;
  const end = s.length - 4;
  return new THREE.Quaternion(s[end], s[end + 1], s[end + 2], s[end + 3]).invert().multiply(target);
}

// Position and rotation along a planned path at progress t (0..1).
export function sample(path: DiePath, t: number, position: THREE.Vector3, rotation: THREE.Quaternion) {
  const steps = path.path.length / 3 - 1;
  const k = Math.min(steps - 1, Math.max(0, Math.floor(t * steps)));
  const a = Math.min(1, Math.max(0, t * steps - k));
  const p = path.path;
  position.set(p[k * 3] + (p[k * 3 + 3] - p[k * 3]) * a, p[k * 3 + 1] + (p[k * 3 + 4] - p[k * 3 + 1]) * a, p[k * 3 + 2] + (p[k * 3 + 5] - p[k * 3 + 2]) * a);
  const s = path.spin;
  const q0 = new THREE.Quaternion(s[k * 4], s[k * 4 + 1], s[k * 4 + 2], s[k * 4 + 3]);
  const q1 = new THREE.Quaternion(s[k * 4 + 4], s[k * 4 + 5], s[k * 4 + 6], s[k * 4 + 7]);
  rotation.slerpQuaternions(q0, q1, a);
}
