'use client';

/* eslint-disable react-hooks/immutability -- three.js meshes and materials are
   mutated imperatively in the render loop, which is how React Three Fiber works. */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Die, Game } from '@/app/lib/dice/rules';
import { d10, diceAtlas, faceTowards } from './d10';
import { landing, planThrow, sample, type DiePath } from './throw';
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
const UP = new THREE.Vector3(0, 1, 0);
// "Up" for a symbol on a face lying flat: away from the camera.
const AWAY = new THREE.Vector3(0, 0, -1);
const DIE_SCALE = 0.95;
// Where a die's centre sits when it lies flat on the tray floor.
const REST_Y = FLOOR_Y + d10().inradius * DIE_SCALE;

/*
  A dark room and one warm lamp over the table. The faces glow only faintly
  (enough to read a die in the lamp's shadow), and the studio reflections
  are a whisper, for the clear coat's highlights.
*/
const LAMP = { color: '#ffc98f', intensity: 420, position: [-3, 12, -2.5] as const };
const GLOW = 0.1;
const GLOW_SELECTED = 0.3;
const ENV_INTENSITY = 0.05;

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

// A soft dark blob where a die touches the floor, so it sits on the tray
// rather than hovering over the lamp's shadow. Shared by every die.
let blobTexture: THREE.CanvasTexture | null = null;
function contactBlob() {
  if (blobTexture) return blobTexture;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.85)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.45)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return (blobTexture = new THREE.CanvasTexture(canvas));
}

function D10Mesh({
  game,
  die,
  slot,
  index,
  throwId,
  thrown,
  planFor,
  restOf,
  onSelect,
}: {
  game: Game;
  die: SceneDie;
  slot: THREE.Vector3;
  // The shared simulation for a throw (all dice together, so they collide).
  planFor: (throwId: number) => Map<number, DiePath>;
  // Where this die lies after a throw (undefined before any roll).
  restOf: (index: number) => THREE.Vector3 | undefined;
  index: number;
  throwId: number;
  thrown: boolean;
  onSelect?: (index: number) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const blob = useRef<THREE.Mesh>(null);
  const blobMaterial = useMemo(() => new THREE.MeshBasicMaterial({ map: contactBlob(), transparent: true, depthWrite: false }), []);
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

  // Path and tumble come from the shared simulation. The die finishes flat
  // on the face showing its value, symbol upright for the viewer, give or
  // take a natural twist; `landing` folds that into the tumble from the start.
  const flight = useRef({
    start: 0,
    animate: false,
    target: new THREE.Quaternion(),
    landing: null as THREE.Quaternion | null,
  });
  useLayoutEffect(() => {
    flight.current = {
      start: performance.now(),
      animate: thrown && !prefersReducedMotion(),
      target: faceTowards(die.value, UP, AWAY, (Math.random() - 0.5) * 1.2),
      landing: null,
    };
    invalidate();
    // A new throw only when this die is (re)rolled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throwId, die.value]);

  const tumble = useMemo(() => new THREE.Quaternion(), []);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const f = flight.current;
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
      f.landing ??= landing(path, f.target);
      sample(path, t, m.position, tumble);
      m.quaternion.multiplyQuaternions(tumble, f.landing);
      invalidate();
    } else {
      m.quaternion.copy(f.target);
      const rest = restOf(index) ?? slot;
      const y = REST_Y + lift;
      m.position.set(rest.x, THREE.MathUtils.lerp(m.position.y, y, 0.25), rest.z);
      if (Math.abs(m.position.y - y) > 0.001) invalidate();
    }

    // The blob follows the die and fades as it leaves the floor.
    const b = blob.current;
    if (b) {
      b.visible = m.visible;
      b.position.set(m.position.x, FLOOR_Y + 0.01, m.position.z);
      blobMaterial.opacity = 0.7 * Math.max(0, 1 - (m.position.y - REST_Y) / 1.5);
    }

    const dim = die.dimmed && t >= 1 ? 0.6 : 1;
    material.color.setScalar(dim);
    material.emissiveIntensity = (die.selected ? GLOW_SELECTED : GLOW) * dim;
  });

  return (
    <>
    <mesh ref={blob} material={blobMaterial} rotation-x={-Math.PI / 2} renderOrder={1}>
      <planeGeometry args={[2.1, 2.1]} />
    </mesh>
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      castShadow
      scale={DIE_SCALE}
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
    </>
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

  // One simulation per throw, made when the first die asks for it. Dice
  // stay where they fell until the pool changes; before any roll they wait
  // in neat rows (`slots`).
  const latest = useRef({ rolled, tray });
  useLayoutEffect(() => {
    latest.current = { rolled, tray };
  });
  const { planFor, restOf } = useMemo(() => {
    let cached: { key: number; plan: Map<number, DiePath> } | null = null;
    const rests = new Map<number, THREE.Vector3>();
    return {
      planFor: (key: number) => {
        if (cached?.key !== key) {
          const { rolled, tray } = latest.current;
          const still = [...rests].filter(([i]) => !rolled.includes(i)).map(([, p]) => p);
          const plan = planThrow(rolled, tray, REST_Y, REST_Y - FLOOR_Y, still);
          for (const [i, path] of plan) rests.set(i, path.rest);
          cached = { key, plan };
        }
        return cached.plan;
      },
      restOf: (index: number) => {
        if (!latest.current.rolled.length) {
          rests.clear();
          return undefined;
        }
        return rests.get(index);
      },
    };
  }, []);

  return (
    <Canvas
      // PCF: three.js has dropped the soft variant R3F asks for by default.
      shadows='percentage'
      // No tone mapping: the lamp's colour reaches the dice as it is.
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
      <spotLight
        color={LAMP.color}
        intensity={LAMP.intensity}
        position={LAMP.position}
        angle={0.72}
        penumbra={0.9}
        decay={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
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
            restOf={restOf}
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
