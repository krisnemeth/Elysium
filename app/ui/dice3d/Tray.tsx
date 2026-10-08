'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Game } from '@/app/lib/dice/rules';
import { trayLook } from './tray-look';

export const FLOOR_Y = -1.05;
export const WALL_HEIGHT = 0.95;
export const WALL_THICKNESS = 0.45;

// A box whose texture coordinates are in world units / tile, so the grain
// keeps its scale whatever the box's size.
function box(sx: number, sy: number, sz: number, tile: number) {
  const geometry = new THREE.BoxGeometry(sx, sy, sz);
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute;
  // Face order: +x, -x, +y, -y, +z, -z; four vertices each.
  const dims: [number, number][] = [
    [sz, sy],
    [sz, sy],
    [sx, sz],
    [sx, sz],
    [sx, sy],
    [sx, sy],
  ];
  // The grain runs along u, so turn it to follow each face's longer side.
  dims.forEach(([du, dv], face) => {
    for (let i = face * 4; i < face * 4 + 4; i++) {
      const [u, v] = [uv.getX(i), uv.getY(i)];
      if (du >= dv) uv.setXY(i, (u * du) / tile, (v * dv) / tile);
      else uv.setXY(i, (v * dv) / tile, (u * du) / tile);
    }
  });
  return geometry;
}

/*
  The tray: a lined floor inside four walls. `halfWidth`/`halfDepth` are the
  inner half-sizes; the dice bounce off the inside faces.
*/
export default function Tray({ game, halfWidth, halfDepth }: { game: Game; halfWidth: number; halfDepth: number }) {
  const look = trayLook(game);
  const { floor, long, short } = useMemo(() => {
    const t = WALL_THICKNESS;
    const outerW = 2 * (halfWidth + t);
    return {
      floor: box(outerW, 0.1, 2 * (halfDepth + t), look.floorTile),
      // Front and back walls run the full width; the sides fit between them.
      long: box(outerW, WALL_HEIGHT, t, look.wallTile),
      short: box(t, WALL_HEIGHT, 2 * halfDepth, look.wallTile),
    };
  }, [halfWidth, halfDepth, look]);
  useEffect(
    () => () => {
      floor.dispose();
      long.dispose();
      short.dispose();
    },
    [floor, long, short],
  );

  const y = FLOOR_Y + WALL_HEIGHT / 2;
  const t = WALL_THICKNESS / 2;
  return (
    <group>
      <mesh geometry={floor} material={look.floor} position-y={FLOOR_Y - 0.05} receiveShadow />
      <mesh geometry={long} material={look.wall} position={[0, y, -(halfDepth + t)]} castShadow receiveShadow />
      <mesh geometry={long} material={look.wall} position={[0, y, halfDepth + t]} castShadow receiveShadow />
      <mesh geometry={short} material={look.wall} position={[-(halfWidth + t), y, 0]} castShadow receiveShadow />
      <mesh geometry={short} material={look.wall} position={[halfWidth + t, y, 0]} castShadow receiveShadow />
    </group>
  );
}
