"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/About.module.css";
import chair from "../public/chair_svg.svg";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <p className={styles.subtitle}>
          - We believe every space tells a story. Ours begins with honesty
        </p>

        <div className={styles.bgWordWrap}>
          <div className={`${styles.bgWordMod}${isVisible ? " " + styles.active : ""}`}>MOD</div>
          <div className={`${styles.bgWordErn}${isVisible ? " " + styles.active : ""}`}>ERN</div>
        </div>

        <p className={styles.tagline}>
          - honest materials, honest shapes, honest living
        </p>
      </div>
      <div className={styles.chair}>
        <Image src={chair} alt="chair" className={styles.chairImg} />
      </div>
      <h2 className={styles.title}>OUR PHILOSOPHY</h2>
    </section>
  );
}
