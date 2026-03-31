"use client";

import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "../styles/ChairSpecs.module.css";

const specs = [
  { label: "Size", value: "74 × 70 × 78 cm" },
  { label: "Fabric", value: "Wool chenille" },
  { label: "Weight", value: "18 kg" },
];

export interface ChairSpecsHandle {
  leftCol:  HTMLDivElement | null;
  rightCol: HTMLDivElement | null;
  rightColAnimatedClass: string;
  specBoxClass: string;
  descBoxClass: string;
  viewItemClass: string;
}

interface ChairSpecsProps {
  onViewClick?: (view: string) => void;
  activeView?: string;
}

const ChairSpecs = forwardRef<ChairSpecsHandle, ChairSpecsProps>(
  function ChairSpecs({ onViewClick, activeView }, ref) {
    const leftColRef  = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      get leftCol()  { return leftColRef.current; },
      get rightCol() { return rightColRef.current; },
      rightColAnimatedClass: styles.rightColAnimated,
      specBoxClass:  styles.specBox,
      descBoxClass:  styles.descBox,
      viewItemClass: styles.viewItem,
    }));

    return (
      <div className={styles.wrapper}>
        <div className={styles.leftCol} ref={leftColRef}>
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

        <div className={styles.rightCol} ref={rightColRef}>
          {[
            { src: `${process.env.NEXT_PUBLIC_BASE_PATH}/rightView.svg`, alt: "right view", key: "right" },
            { src: `${process.env.NEXT_PUBLIC_BASE_PATH}/leftView.svg`, alt: "left view", key: "left" },
          ].map((v) => (
            <div
              key={v.alt}
              className={`${styles.viewItem}${activeView === v.key ? " " + styles.viewItemActive : ""}`}
              onClick={() => onViewClick?.(v.key)}
              style={{ cursor: "pointer" }}
            >
              <Image src={v.src} alt={v.alt} width={160} height={160} />
              <span className={styles.viewLabel}>{v.alt}</span>
            </div>
          ))}

          <div
            className={`${styles.viewItem}${activeView === "front" ? " " + styles.viewItemActive : ""}`}
            onClick={() => onViewClick?.("front")}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/frontView.svg`}
              alt="front view"
              width={170}
              height={170}
            />
            <span className={styles.viewLabel}>front view</span>
          </div>
        </div>
      </div>
    );
  }
);

export default ChairSpecs;
