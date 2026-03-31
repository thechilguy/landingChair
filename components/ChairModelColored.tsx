"use client";

import { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

useGLTF.preload(`${process.env.NEXT_PUBLIC_BASE_PATH}/chair3.glb`);

interface ChairModelColoredProps {
  color: string;
}

export default function ChairModelColored({ color }: ChairModelColoredProps) {
  const { scene } = useGLTF(`${process.env.NEXT_PUBLIC_BASE_PATH}/chair3.glb`);
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const originals = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && !originals.current.has(child.uuid)) {
        child.geometry.computeVertexNormals();
        child.castShadow = true;
        child.receiveShadow = true;
        originals.current.set(child.uuid, (child.material as THREE.MeshStandardMaterial).clone());
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const orig = originals.current.get(child.uuid);
        if (!orig) return;
        const mat = orig.clone();
        mat.map = null;
        mat.color.set(color);
        mat.flatShading = false;
        mat.needsUpdate = true;
        child.material = mat;
      }
    });
  }, [clonedScene, color]);

  const finalScale = Math.min(viewport.width, viewport.height) * 0.27 * 1.3 * 2;

  return (
    <group ref={groupRef} scale={finalScale} position={[0.09, -1.4, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}
