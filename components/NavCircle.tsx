"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "../styles/NavCircle.module.css";

interface NavCircleProps {
  currentSection: number;
  sections: string[];
}

export default function NavCircle({
  currentSection,
  sections,
}: NavCircleProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const shelfRef = useRef<SVGSVGElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (labelTextRef.current) {
      labelTextRef.current.textContent = sections[0];
    }
  }, []);

  useEffect(() => {
    if (!circleRef.current || !dotRef.current) return;

    gsap.killTweensOf(circleRef.current);
    gsap.killTweensOf(dotRef.current);
    gsap.killTweensOf(labelTextRef.current);
    gsap.killTweensOf(line1Ref.current);
    gsap.killTweensOf(line2Ref.current);

    const darkSections = [0, 2]; // Hero, Overview — light backgrounds
    const color = darkSections.includes(currentSection) ? "#111111" : "#ffffff";

    gsap.to(circleRef.current, {
      rotation: darkSections.includes(currentSection) ? 0 : 360,
      borderColor: color,
      color,
      duration: 0.9,
      ease: "power3.inOut",
    });

    gsap.to(dotRef.current, {
      backgroundColor: color,
      duration: 0.9,
      ease: "power3.inOut",
    });

    gsap.fromTo(
      line2Ref.current,
      { strokeDashoffset: -52 },
      { strokeDashoffset: 0, duration: 0.5, ease: 'power3.out', delay: 0.55 }
    );

    gsap.fromTo(
      line1Ref.current,
      { strokeDashoffset: -60 },
      { strokeDashoffset: 0, duration: 0.6, ease: 'power3.out', delay: 1.15 }
    );

    gsap.to(labelTextRef.current, {
      opacity: 0,
      filter: 'blur(8px)',
      y: -4,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        if (labelTextRef.current) {
          labelTextRef.current.textContent = sections[currentSection];
        }
        gsap.fromTo(
          labelTextRef.current,
          { opacity: 0, filter: 'blur(8px)', y: 4 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
        );
      },
    });
  }, [currentSection]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.circle} ref={circleRef}>
        <div className={styles.dot} ref={dotRef}>
          <div className={styles.labelWrapper}>
            <span className={styles.labelText} ref={labelTextRef} />
            <svg ref={shelfRef} className={styles.shelfLine} viewBox="0 0 80 50" fill="none">
              <line
                ref={line1Ref}
                x1="0" y1="2" x2="60" y2="2"
                stroke="currentColor" strokeWidth="1.5"
                strokeDasharray="60"
                strokeDashoffset="60"
              />
              <line
                ref={line2Ref}
                x1="60" y1="2" x2="80" y2="50"
                stroke="currentColor" strokeWidth="1.5"
                strokeDasharray="52"
                strokeDashoffset="52"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
