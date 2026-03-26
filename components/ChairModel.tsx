"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Preload the model so it's ready before the Suspense boundary resolves
useGLTF.preload("/chair3.glb");

interface ChairModelProps {
  // Mutable ref so Hero can update mouse coords without causing re-renders
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function ChairModel({ mouseRef }: ChairModelProps) {
  const { scene } = useGLTF("/chair3.glb");
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Smooth normals to remove faceted/polygonal look
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.computeVertexNormals();
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.flatShading = false;
        child.material.needsUpdate = true;
      }
    }
  });

  const finalScale = Math.min(viewport.width, viewport.height) * 0.27 * 1.3 * 2;

  // Base Y rotation (35°) — mouse parallax is applied as an offset on top of this
  const BASE_ROTATION_Y = -35 * (Math.PI / 180);

  useFrame(() => {
    if (!groupRef.current) return;

    // --- Mouse parallax ---
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_ROTATION_Y + x * 0.3,
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.15,
      0.05,
    );
  });

  return (
    <group ref={groupRef} scale={finalScale} position={[0.09, -0.7, 0]}>
      <primitive object={scene} />
    </group>
  );
}
