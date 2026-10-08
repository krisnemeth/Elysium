'use client';

/* eslint-disable react-hooks/immutability -- three.js meshes and materials are
   mutated imperatively in the render loop, which is how React Three Fiber works. */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Die, Game } from '@/app/lib/dice/rules';
import { d10, diceAtlas, faceTowards } from './d10';
import { planThrow, sample, type DiePath } from './throw';
import Tray, { FLOOR_Y, WALL_HEIGHT, WALL_THICKNESS } from './Tray';

export type SceneDie = Die & { dimmed?: boolean; selected?: boolean; selectable?: boolean };

type Props = {
  game: Game;
  dice: SceneDie[];
  // Changes on every roll; dice whose index is in `rolled` are thrown again.
  rollKey: number;
  rolled: number[];
  onSelect?: (index: number) => void;
};

const SPACING = 2.4;
const TO_CAMERA = new THREE.Vector3(0, 1.25, 1).normalize();
const SCREEN_UP = new THREE.Vector3(0, 1, 0).sub(TO_CAMERA.clone().multiplyScalar(TO_CAMERA.y)).normalize();
// Self-lit share of each face's colour; the key light adds the rest, so a
// face turned to the camera shows its official colour and the sides fall
// into shade like the printed dice.
const GLOW = 0.35;
const ENV_INTENSITY = 0.2;
const KEY_LIGHT = 1.5;
const GLOW_SELECTED = 0.5;

const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useAtlas(game: Game, kind: Die['kind']) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let live = true;
    diceAtlas(game, kind).then((t) => {
      // Sharpest filtering the GPU offers, so symbols stay crisp on tilted faces.
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      if (live) setTexture(t);
    });
    return () => {
      live = false;
    };
  }, [game, kind, gl]);
  return texture;
}

// Inner half-sizes of the tray: room for the dice, at least five across and
// two deep, plus space to bounce.
function traySize(cols: number, rows: number) {
  return {
    halfWidth: (Math.max(cols, 5) * SPACING) / 2 + 0.9,
    halfDepth: (Math.max(rows, 2) * SPACING * 1.15) / 2 + 0.9,
  };
}

// Rows of dice, as many across as makes them largest on screen: the tray's
// footprint (seen at the camera's angle, depth looks ~0.8 as long) is
// compared with the canvas shape.
function layout(count: number, aspect: number) {
  let cols = 1;
  let best = Infinity;
  for (let c = 1; c <= Math.min(count, 8); c++) {
    const { halfWidth, halfDepth } = traySize(c, Math.ceil(count / c));
    const extent = Math.max(halfWidth / aspect, halfDepth * 0.8);
    // On a tie (small pools in the smallest tray), prefer one long row.
    if (extent <= best + 1e-6) [best, cols] = [extent, c];
  }
  const rows = Math.ceil(count / cols);
  const slots = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? count - row * cols : cols;
    const col = i % cols;
    return new THREE.Vector3((col - (inRow - 1) / 2) * SPACING, 0, (row - (rows - 1) / 2) * SPACING * 1.15);
  });
  return { cols, rows, slots };
}

// Frames the whole tray, walls included: the camera backs off along its
// viewing direction until every corner sits inside the view, with a margin.
function CameraRig({ halfWidth, halfDepth }: { halfWidth: number; halfDepth: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = halfWidth + WALL_THICKNESS;
    const d = halfDepth + WALL_THICKNESS;
    const corners = [FLOOR_Y, FLOOR_Y + WALL_HEIGHT].flatMap((y) => [-w, w].flatMap((x) => [-d, d].map((z) => new THREE.Vector3(x, y, z))));
    const fits = (dist: number) => {
      cam.position.copy(TO_CAMERA).multiplyScalar(dist);
      cam.lookAt(0, FLOOR_Y / 2, 0);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();
      return corners.every((c) => {
        const ndc = c.clone().project(cam);
        return Math.abs(ndc.x) < 0.97 && Math.abs(ndc.y) < 0.95;
      });
    };
    let [lo, hi] = [2, 200];
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid;
      else lo = mid;
    }
    fits(hi);
  }, [camera, size, halfWidth, halfDepth]);
  return null;
}

function D10Mesh({
  game,
  die,
  slot,
  index,
  throwId,
  thrown,
  planFor,
  onSelect,
}: {
  game: Game;
  die: SceneDie;
  slot: THREE.Vector3;
  // The shared simulation for a throw (all dice together, so they collide).
  planFor: (throwId: number) => Map<number, DiePath>;
  index: number;
  throwId: number;
  thrown: boolean;
  onSelect?: (index: number) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useAtlas(game, die.kind);
  const { geometry } = d10();
  const invalidate = useThree((s) => s.invalidate);
  const [hovered, setHovered] = useState(false);

  // Resin dice: the face texture also glows a little (emissive), so the
  // official colours read true whatever the light; a thin clear coat adds
  // highlights without washing them out.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.6,
        metalness: 0,
        specularIntensity: 0.25,
        clearcoat: 0.15,
        clearcoatRoughness: 0.2,
        emissive: new THREE.Color('#ffffff'),
        flatShading: true,
      }),
    [],
  );
  useEffect(() => {
    material.map = texture;
    material.emissiveMap = texture;
    material.needsUpdate = true;
    invalidate();
  }, [material, texture, invalidate]);

  // The path comes from the shared simulation; the spin is this die's own,
  // ending on the face that shows the rolled value, with a little twist.
  const flight = useRef({
    start: 0,
    animate: false,
    startQ: new THREE.Quaternion(),
    axis: new THREE.Vector3(0, 1, 0),
    spin: 0,
    target: new THREE.Quaternion(),
  });
  useLayoutEffect(() => {
    flight.current = {
      start: performance.now(),
      animate: thrown && !prefersReducedMotion(),
      startQ: new THREE.Quaternion().random(),
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      spin: (4 + Math.random() * 3) * Math.PI * 2,
      target: faceTowards(die.value, TO_CAMERA, SCREEN_UP, (Math.random() - 0.5) * 0.3),
    };
    invalidate();
    // A new throw only when this die is (re)rolled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throwId, die.value]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { target, ...f } = flight.current;
    const path = f.animate ? planFor(throwId).get(index) : undefined;
    const t = path ? ((performance.now() - f.start) / 1000 - path.delay) / path.duration : 1;
    const lift = die.selected ? 0.45 : hovered && die.selectable ? 0.18 : 0;

    if (t < 0) {
      m.visible = false;
      invalidate();
      return;
    }
    m.visible = true;
    if (t < 1 && path) {
      const p = sample(path, t, m.position);
      const spinning = f.startQ.clone().multiply(new THREE.Quaternion().setFromAxisAngle(f.axis, f.spin * p));
      m.quaternion.slerpQuaternions(spinning, target, smoothstep(0.6, 1, t));
      invalidate();
    } else {
      m.quaternion.copy(target);
      const y = slot.y + lift;
      m.position.set(slot.x, THREE.MathUtils.lerp(m.position.y, y, 0.25), slot.z);
      if (Math.abs(m.position.y - y) > 0.001) invalidate();
    }

    const dim = die.dimmed && t >= 1 ? 0.6 : 1;
    material.color.setScalar(dim);
    material.emissiveIntensity = (die.selected ? GLOW_SELECTED : GLOW) * dim;
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      castShadow
      scale={0.95}
      onClick={(e) => {
        e.stopPropagation();
        if (die.selectable) onSelect?.(index);
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = die.selectable ? 'pointer' : '';
        invalidate();
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
        invalidate();
      }}
    />
  );
}

/*
  3D dice tray: real d10s thrown onto a table, each landing on the value the
  rules engine rolled. Rendering is on demand, so it idles at zero cost.
*/
export default function DiceScene({ game, dice, rollKey, rolled, onSelect }: Props) {
  const [aspect, setAspect] = useState(2);
  const { cols, rows, slots } = layout(Math.max(1, dice.length), aspect);
  const tray = traySize(cols, rows);

  // One simulation per throw, made when the first die asks for it, from the
  // layout at that moment.
  const latest = useRef({ slots, rolled, tray });
  useLayoutEffect(() => {
    latest.current = { slots, rolled, tray };
  });
  const planFor = useMemo(() => {
    let cached: { key: number; plan: Map<number, DiePath> } | null = null;
    return (key: number) => {
      if (cached?.key !== key) {
        const { slots, rolled, tray } = latest.current;
        cached = { key, plan: planThrow(slots, rolled, tray) };
      }
      return cached.plan;
    };
  }, []);

  return (
    <Canvas
      // PCF: three.js has dropped the soft variant R3F asks for by default.
      shadows='percentage'
      // No tone mapping: keep the official dice colours true.
      flat
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ fov: 35, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ size }) => setAspect(size.width / size.height)}
      onPointerMissed={() => {}}
      style={{ touchAction: 'pan-y' }}
      resize={{ debounce: 50 }}
    >
      <AspectWatcher onChange={setAspect} />
      <CameraRig halfWidth={tray.halfWidth} halfDepth={tray.halfDepth} />
      <StudioEnvironment />
      <directionalLight
        position={[-5, 10, 4]}
        intensity={KEY_LIGHT}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <Tray game={game} halfWidth={tray.halfWidth} halfDepth={tray.halfDepth} />
      {dice.map((die, i) => (
          <D10Mesh
            key={i}
            game={game}
            die={die}
            slot={slots[i]}
            index={i}
            throwId={rolled.includes(i) ? rollKey : -1}
            thrown={rolled.includes(i)}
            planFor={planFor}
            onSelect={onSelect}
          />
      ))}
    </Canvas>
  );
}

// Soft studio reflections for the clear coat.
function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    // Materials lit by scene.environment take this, not their own envMapIntensity.
    scene.environmentIntensity = ENV_INTENSITY;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

function AspectWatcher({ onChange }: { onChange: (aspect: number) => void }) {
  const size = useThree((s) => s.size);
  useEffect(() => onChange(size.width / size.height), [size, onChange]);
  return null;
}
