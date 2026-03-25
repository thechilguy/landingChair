"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import ChairModel from "./ChairModel";
import styles from "../styles/Hero.module.css";

export default function Hero() {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const modernifyRef = useRef<HTMLSpanElement>(null);
  const chairRef = useRef<HTMLSpanElement>(null);
  const fornitureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.fromTo(
      modernifyRef.current,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.8, ease: "power4.out", delay: 0.5 },
    );
    gsap.fromTo(
      chairRef.current,
      { y: "-100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.8, ease: "power4.out", delay: 0.8 },
    );
    gsap.fromTo(
      fornitureRef.current,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.4, ease: "power4.out", delay: 1.4 },
    );
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <span ref={fornitureRef} className={styles.category}>FORNITURE</span>
        <h1 className={styles.title}>
          <span ref={modernifyRef} className={styles.titleTop}>
            MODERNIFY
          </span>
          <span ref={chairRef} className={styles.titleBottom}>
            CHAIR
          </span>
        </h1>
      </div>
      <div className={styles.content}>
        <div className={styles.leftwrapper}>
          <div className={styles.leftCol}>
            <div className={styles.specs}>
              <div className={styles.specRow}>
                <span className={styles.label}>Frame material:</span>
                <span className={styles.value}>Powder-coated steel frame</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.label}>Upholstery:</span>
                <span className={styles.value}>Premium wool-blend fabric</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.label}>Filling:</span>
                <span className={styles.value}>
                  Eco-friendly high-density foam
                </span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.label}>Design:</span>
                <span className={styles.value}>
                  Architectural sculptural silhouette
                </span>
              </div>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.price}>549$</span>
              <button className={styles.buyButton}>Show details/Buy</button>
            </div>
          </div>
        </div>
        <div ref={canvasWrapperRef} className={styles.right3dCanvas}>
          <Canvas
            shadows
            style={{ width: "100%", height: "100%", background: "transparent" }}
            camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 5] }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={2.5} />
            <directionalLight position={[3, 4, 2]} intensity={2.4} />
            <directionalLight position={[-2, -1, -2]} intensity={0.6} />
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
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.65, 0]}
            >
              <planeGeometry args={[15, 15]} />
              <shadowMaterial transparent opacity={0.2} />
            </mesh>
            <Suspense fallback={null}>
              <ChairModel mouseRef={mouseRef} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
