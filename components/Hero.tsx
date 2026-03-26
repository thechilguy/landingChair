"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import ChairModel from "./ChairModel";
import styles from "../styles/Hero.module.css";

const specs = [
  { label: "Frame material:", value: "Powder-coated steel frame" },
  { label: "Upholstery:", value: "Premium wool-blend fabric" },
  { label: "Filling:", value: "Eco-friendly high-density foam" },
  { label: "Design:", value: "Architectural sculptural silhouette" },
];

export default function Hero() {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const modernifyRef = useRef<HTMLSpanElement>(null);
  const chairRef = useRef<HTMLSpanElement>(null);
  const fornitureRef = useRef<HTMLSpanElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const valueRefs = useRef<HTMLSpanElement[]>([]);
  const priceRef = useRef<HTMLSpanElement>(null);
  const buyBtnRef = useRef<HTMLButtonElement>(null);

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
    gsap.fromTo(
      specsRef.current,
      { y: "80px", x: "-50px", opacity: 0, rotation: -4 },
      {
        y: "0px",
        x: "0px",
        opacity: 1,
        rotation: 0,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.6,
      },
    );
    gsap.fromTo(
      labelRefs.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        delay: 1.2,
      },
    );
    gsap.fromTo(
      valueRefs.current,
      { x: "-30px", opacity: 0 },
      {
        x: "0px",
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        delay: 1.3,
      },
    );
    gsap.fromTo(
      priceRef.current?.querySelectorAll(`.${styles.priceChar}`),
      { opacity: 0, y: "10px" },
      {
        opacity: 1,
        y: "0px",
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        delay: 1.8,
      },
    );
    gsap.fromTo(
      buyBtnRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out", delay: 2.1 },
    );
    gsap.fromTo(
      canvasWrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.8 },
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
        <span ref={fornitureRef} className={styles.category}>
          FORNITURE
        </span>
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
        <div ref={specsRef} className={styles.leftwrapper}>
          <div className={styles.leftCol}>
            <div className={styles.specs}>
              {specs.map((spec, i) => (
                <div key={i} className={styles.specRow}>
                  <span
                    ref={(el) => {
                      if (el) labelRefs.current[i] = el;
                    }}
                    className={styles.label}
                  >
                    {spec.label}
                  </span>
                  <span
                    ref={(el) => {
                      if (el) valueRefs.current[i] = el;
                    }}
                    className={styles.value}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.priceRow}>
              <span ref={priceRef} className={styles.price}>
                {"549$".split("").map((char, i) => (
                  <span key={i} className={styles.priceChar}>
                    {char}
                  </span>
                ))}
              </span>
              <button ref={buyBtnRef} className={styles.buyButton}>
                Show details/Buy
              </button>
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
              position={[-0.9, -0.7, 0]}
            >
              <planeGeometry args={[15, 15]} />
              <shadowMaterial transparent opacity={0.1} />
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
