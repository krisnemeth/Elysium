'use client';

/* eslint-disable react-hooks/immutability -- three.js meshes and materials are
   mutated imperatively in the render loop, which is how React Three Fiber works. */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Die, Game } from '@/app/lib/dice/rules';
import { d10, diceAtlas, faceTowards } from './d10';

export type SceneDie = Die & { dimmed?: boolean; selected?: boolean; selectable?: boolean };

type Props = {
  game: Game;
  dice: SceneDie[];
  // Changes on every roll; dice whose index is in `rolled` are thrown again.
  rollKey: number;
  rolled: number[];
  accent: string;
  onSelect?: (index: number) => void;
};

const SPACING = 2.4;
const TO_CAMERA = new THREE.Vector3(0, 1.25, 1).normalize();
const SCREEN_UP = new THREE.Vector3(0, 1, 0).sub(TO_CAMERA.clone().multiplyScalar(TO_CAMERA.y)).normalize();
const THROW_SECONDS = 1.1;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useAtlas(game: Game, kind: Die['kind']) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let live = true;
    diceAtlas(game, kind).then((t) => live && setTexture(t));
    return () => {
      live = false;
    };
  }, [game, kind]);
  return texture;
}

function layout(count: number, aspect: number) {
  const maxCols = Math.max(3, Math.min(8, Math.floor(aspect * 3.2)));
  const cols = Math.min(count, maxCols);
  const rows = Math.ceil(count / cols);
  const slots = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? count - row * cols : cols;
    const col = i % cols;
    return new THREE.Vector3((col - (inRow - 1) / 2) * SPACING, 0, (row - (rows - 1) / 2) * SPACING * 1.15);
  });
  return { cols, rows, slots };
}

function CameraRig({ cols, rows }: { cols: number; rows: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vfov = (cam.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const w = cols * SPACING + 0.6;
    const h = rows * SPACING * 1.15 + 1.4;
    const dist = Math.max(w / 2 / Math.tan(hfov / 2), h / 2 / Math.tan(vfov / 2)) + 1.5;
    cam.position.copy(TO_CAMERA.clone().multiplyScalar(dist));
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size, cols, rows]);
  return null;
}

function D10Mesh({
  game,
  die,
  slot,
  index,
  throwId,
  thrown,
  onSelect,
}: {
  game: Game;
  die: SceneDie;
  slot: THREE.Vector3;
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

  // Resin dice: a smooth base under a glossy clear coat.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.4,
        metalness: 0,
        clearcoat: 0.75,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.3,
        flatShading: true,
      }),
    [],
  );
  useEffect(() => {
    material.map = texture;
    material.needsUpdate = true;
    invalidate();
  }, [material, texture, invalidate]);

  // Each throw gets a random start, spin and timing, and a target
  // orientation that shows the rolled value with a little natural twist.
  const flight = useRef({
    start: 0,
    duration: 0,
    from: new THREE.Vector3(),
    startQ: new THREE.Quaternion(),
    axis: new THREE.Vector3(0, 1, 0),
    spin: 0,
    target: new THREE.Quaternion(),
  });
  useLayoutEffect(() => {
    const animate = thrown && !prefersReducedMotion();
    flight.current = {
      start: performance.now() + (animate ? index * 70 : 0),
      duration: animate ? THROW_SECONDS + Math.random() * 0.35 : 0,
      from: slot.clone().add(new THREE.Vector3((Math.random() - 0.5) * 7, 4 + Math.random() * 3, -3 - Math.random() * 3)),
      startQ: new THREE.Quaternion().random(),
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      spin: (3 + Math.random() * 3) * Math.PI * 2,
      target: faceTowards(die.value, TO_CAMERA, SCREEN_UP, (Math.random() - 0.5) * 0.3),
    };
    invalidate();
    // A new throw only when this die is (re)rolled or its slot moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throwId, die.value, slot.x, slot.z]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { target, ...f } = flight.current;
    const t = f.duration ? (performance.now() - f.start) / (f.duration * 1000) : 1;
    const lift = die.selected ? 0.45 : hovered && die.selectable ? 0.18 : 0;

    if (t < 0) {
      m.visible = false;
      invalidate();
      return;
    }
    m.visible = true;
    if (t < 1) {
      const p = easeOut(t);
      m.position.lerpVectors(f.from, slot, p);
      // Bounces that die away as it lands.
      m.position.y = slot.y + Math.abs(Math.sin(t * Math.PI * 2.6)) * Math.pow(1 - t, 2) * 2.2 + (1 - p) * 0.5;
      const spinning = f.startQ.clone().multiply(new THREE.Quaternion().setFromAxisAngle(f.axis, f.spin * p));
      m.quaternion.slerpQuaternions(spinning, target, smoothstep(0.55, 1, t));
      invalidate();
    } else {
      m.quaternion.copy(target);
      const y = slot.y + lift;
      m.position.set(slot.x, THREE.MathUtils.lerp(m.position.y, y, 0.25), slot.z);
      if (Math.abs(m.position.y - y) > 0.001) invalidate();
    }

    const dim = die.dimmed && t >= 1 ? 0.6 : 1;
    material.color.setScalar(dim);
    material.emissive.set(die.selected ? '#ffffff' : '#000000');
    material.emissiveIntensity = die.selected ? 0.08 : 0;
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
export default function DiceScene({ game, dice, rollKey, rolled, accent, onSelect }: Props) {
  const [aspect, setAspect] = useState(2);
  const { cols, rows, slots } = layout(Math.max(1, dice.length), aspect);

  return (
    <Canvas
      shadows
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
      <CameraRig cols={cols} rows={rows} />
      <StudioEnvironment />
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[-5, 10, 4]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <pointLight position={[7, 2.5, 4]} intensity={45} color={accent} />
      <mesh rotation-x={-Math.PI / 2} position-y={-1.05} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
      {dice.map((die, i) => (
          <D10Mesh
            key={i}
            game={game}
            die={die}
            slot={slots[i]}
            index={i}
            throwId={rolled.includes(i) ? rollKey : -1}
            thrown={rolled.includes(i)}
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
