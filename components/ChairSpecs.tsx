"use client";

import Image from "next/image";
import styles from "../styles/ChairSpecs.module.css";

const specs = [
  { label: "Size", value: "74 × 70 × 78 cm" },
  { label: "Fabric", value: "Wool chenille" },
  { label: "Weight", value: "18 kg" },
];

export default function ChairSpecs() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftCol}>
        <div className={styles.descBox}>
          <p className={styles.desc}>
            Sculptural lounge chair with an architectural silhouette.
            <br />
            Designed for those who see furniture as art.
          </p>
          <span className={styles.corner} />
        </div>

        {specs.map((spec) => (
          <div key={spec.label} className={styles.specBox}>
            <span className={styles.specLabel}>{spec.label}</span>
            <span className={styles.specValue}>{spec.value}</span>
            <span className={styles.corner} />
          </div>
        ))}
      </div>

      <div className={styles.rightCol}>
        {[
          { src: "/rightView.svg", alt: "right view" },
          { src: "/frontView.svg", alt: "front view" },
          { src: "/leftView.svg", alt: "left view" },
        ].map((v) => (
          <div key={v.alt} className={styles.viewItem}>
            <Image src={v.src} alt={v.alt} width={160} height={160} />
            <span className={styles.viewLabel}>{v.alt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
