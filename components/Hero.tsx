"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import ChairModel from "./ChairModel";

export default function Hero() {
  // Normalized mouse coords in range [-1, 1].
  // Stored in a ref so updating them never re-renders the React tree.
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Normalize to [-1, 1] relative to the window center
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      // Invert Y so moving the mouse up tilts the model back (positive X rotation)
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    // Full-viewport hero wrapper with dark gradient background
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #6b0000, #8b0000, #a50000)",
        }}
      />

      {/* Grain / noise texture overlay via inline SVG filter.
          The feTurbulence generates a static noise pattern and
          feColorMatrix brings it to a near-transparent grey so the
          grain is present but not distracting. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0.18 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          className="absolute inset-0"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Three.js canvas — fills the entire hero section */}
      <Canvas
        shadows
        className="absolute inset-0"
        camera={{
          // Perspective camera; fov tuned so the model fills the frame
          // nicely on all screen sizes without clipping
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 5],
        }}
        // Transparent background so the CSS gradient shows through
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        {/* Soft fill light from all directions */}
        <ambientLight intensity={2.5} />

        {/* Primary directional light — slightly above and to the left */}
        <directionalLight position={[3, 4, 2]} intensity={2.4} />

        {/* Subtle fill light from the opposite side to soften shadows */}
        <directionalLight position={[-2, -1, -2]} intensity={0.6} />

        <ambientLight intensity={2.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 3, -5]} intensity={2} />
        <pointLight position={[0, 4, 2]} intensity={3} color="#ffffff" />
        <directionalLight position={[0, -5, 3]} intensity={1.2} />

        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>

        {/* Wrap the model in Suspense so the canvas renders while the
            GLB is still loading; fallback is null (blank canvas) */}
        <Suspense fallback={null}>
          <ChairModel mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </section>
  );
}
