"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ChairModelColored from "./ChairModelColored";
import styles from "../styles/OverviewCanvas.module.css";

// ── підбери кути тут (в радіанах) ──────────────────────────────────────────
const VIEW_ANGLES = {
  front: 0,
  right: Math.PI / 2,
  left:  -Math.PI / 2,
};
// ───────────────────────────────────────────────────────────────────────────

const COLORS = [
  { hex: "#1c1c1c", label: "Graphite" },
  { hex: "#8B2020", label: "Rust Red" },
  { hex: "#2c3e6b", label: "Navy" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CameraAnimator({ targetAzimuth, controlsRef }: { targetAzimuth: number; controlsRef: React.MutableRefObject<any> }) {
  const targetRef  = useRef(targetAzimuth);
  const animating  = useRef(false);

  useEffect(() => {
    targetRef.current = targetAzimuth;
    animating.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [targetAzimuth, controlsRef]);

  useFrame(() => {
    if (!animating.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    const cam    = controls.object as THREE.Camera;
    const tgt    = controls.target as THREE.Vector3;

    const dx = cam.position.x - tgt.x;
    const dy = cam.position.y - tgt.y;
    const dz = cam.position.z - tgt.z;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (radius === 0) return;

    const currentAzimuth = Math.atan2(dx, dz);
    const polar = Math.acos(THREE.MathUtils.clamp(dy / radius, -1, 1));

    let diff = targetRef.current - currentAzimuth;
    while (diff >  Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    if (Math.abs(diff) < 0.004) {
      animating.current = false;
      controls.enabled  = true;
      return;
    }

    const newAzimuth = currentAzimuth + diff * 0.08;
    cam.position.set(
      tgt.x + radius * Math.sin(polar) * Math.sin(newAzimuth),
      tgt.y + radius * Math.cos(polar),
      tgt.z + radius * Math.sin(polar) * Math.cos(newAzimuth)
    );
    cam.lookAt(tgt);
  });

  return null;
}

interface OverviewCanvasProps {
  targetView?: string;
}

export default function OverviewCanvas({ targetView = "front" }: OverviewCanvasProps) {
  const [activeColor, setActiveColor] = useState(COLORS[0].hex);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const targetAzimuth = VIEW_ANGLES[targetView as keyof typeof VIEW_ANGLES] ?? 0;

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
              ref={controlsRef}
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
            <CameraAnimator targetAzimuth={targetAzimuth} controlsRef={controlsRef} />
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
