"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "../styles/About.module.css";
import chair from "../public/chair_svg.svg";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const chairInnerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || animatedRef.current || !chairInnerRef.current) return;
    animatedRef.current = true;
    // MOD/ERN: delay 0.4s + duration 1.4s = 1.8s
    gsap.fromTo(
      chairInnerRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.2 },
    );
  }, [isVisible]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <p className={styles.subtitle}>
          - We believe every space tells a story. Ours begins with honesty
        </p>

        <div className={styles.bgWordWrap}>
          <div
            className={`${styles.bgWordMod}${isVisible ? " " + styles.active : ""}`}
          >
            MOD
          </div>
          <div
            className={`${styles.bgWordErn}${isVisible ? " " + styles.active : ""}`}
          >
            ERN
          </div>
        </div>

        <p className={styles.tagline}>
          - honest materials, honest shapes, honest living
        </p>
      </div>
      <div className={styles.chair}>
        <div ref={chairInnerRef} style={{ opacity: 0 }}>
          <Image src={chair} alt="chair" className={styles.chairImg} />
        </div>
      </div>
      <h2 className={styles.title}>OUR PHILOSOPHY</h2>
    </section>
  );
}
