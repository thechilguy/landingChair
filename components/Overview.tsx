"use client";

import ChairSpecs from "./ChairSpecs";
import OverviewCanvas from "./OverviewCanvas";
import styles from "../styles/Overview.module.css";

export default function Overview() {
  return (
    <section className={styles.section}>
      <div className={styles.titleBg} />
      <h2 className={styles.title}>OVERVIEW</h2>
      <div className={styles.content}>
        <div className={styles.right}>
          <OverviewCanvas />
        </div>
        <div className={styles.left}>
          <ChairSpecs />
        </div>
      </div>
    </section>
  );
}
