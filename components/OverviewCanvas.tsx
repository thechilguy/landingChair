"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ChairModelColored from "./ChairModelColored";
import styles from "../styles/OverviewCanvas.module.css";

const COLORS = [
  { hex: "#1c1c1c", label: "Graphite" },
  { hex: "#8B2020", label: "Rust Red" },
  { hex: "#2c3e6b", label: "Navy" },
];

export default function OverviewCanvas() {
  const [activeColor, setActiveColor] = useState(COLORS[0].hex);

  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <div className={styles.swatches}>
          {COLORS.map((c) => (
            <button
              key={c.hex}
              className={`${styles.swatch}${activeColor === c.hex ? " " + styles.active : ""}`}
              style={{ background: c.hex }}
              aria-label={c.label}
              onClick={() => setActiveColor(c.hex)}
            />
          ))}
        </div>

        <div className={styles.canvasWrap}>
          <Canvas
            shadows
            style={{ width: "100%", height: "100%", background: "transparent" }}
            camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 6] }}
            gl={{ alpha: true, antialias: true }}
          >
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: undefined,
                RIGHT: undefined,
              }}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: undefined,
              }}
            />
            <ambientLight intensity={2.5} />
            <directionalLight position={[3, 4, 2]} intensity={2.4} />
            <directionalLight position={[-2, -1, -2]} intensity={0.6} />
            <directionalLight
              position={[3, 10, 3]}
              intensity={2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-6}
              shadow-camera-right={6}
              shadow-camera-top={6}
              shadow-camera-bottom={-6}
            />
            <directionalLight position={[-5, 3, -5]} intensity={2} />
            <pointLight position={[0, 4, 2]} intensity={3} color="#ffffff" />
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[-0.9, -1.4, 0]}
            >
              <planeGeometry args={[15, 15]} />
              <shadowMaterial transparent opacity={0.1} />
            </mesh>
            <Suspense fallback={null}>
              <ChairModelColored color={activeColor} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
