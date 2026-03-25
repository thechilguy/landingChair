"use client";

import Image from "next/image";
import styles from "../styles/About.module.css";
import chair from "../public/chair_svg.svg";

export default function About() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>
          - We believe every space tells a story. Ours begins with honesty
        </p>

        <div className={styles.bgWord}>MODERN</div>

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
