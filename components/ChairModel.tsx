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

// easeOutCubic: fast start, decelerates to rest
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
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

  // Entrance animation progress (0 → 1), tracked without triggering re-renders
  const progress = useRef(0);

  // Final responsive scale — 0.27 * 1.3 adds an additional 30% on top of the previous increase
  const finalScale =
    Math.min(viewport.width, viewport.height) * 0.27 * 1.3 * 1.5;

  // Base Y rotation (35°) — mouse parallax is applied as an offset on top of this
  const BASE_ROTATION_Y = -35 * (Math.PI / 180);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // --- Entrance animation (~1.5 s) ---
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta / 1.5, 1);
    }
    const ease = easeOutCubic(progress.current);

    // Animate scale from near-zero to final value
    groupRef.current.scale.setScalar(finalScale * Math.max(ease, 0.001));

    // Animate Y position from -2 to -1
    groupRef.current.position.y = -2 + 1.35 * ease;

    // --- Mouse parallax ---
    // Read the latest mouse coords from the ref each frame (no re-render cost)
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_ROTATION_Y + x * 0.3, // base 35° + mouse offset (~17° max)
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.15, // max ~8 degrees
      0.05,
    );
  });

  return (
    // Initial scale near-zero and position below center; useFrame animates both
    <group ref={groupRef} scale={0.001} position={[0.08, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}
