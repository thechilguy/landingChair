"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ChairSpecs, { type ChairSpecsHandle } from "./ChairSpecs";
import OverviewCanvas from "./OverviewCanvas";
import styles from "../styles/Overview.module.css";

export default function Overview() {
  const [targetView, setTargetView] = useState("front");

  const sectionRef  = useRef<HTMLElement>(null);
  const titleBgRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const specsRef    = useRef<ChairSpecsHandle>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;
        observer.disconnect();

        const s = specsRef.current;
        if (!s) return;

        const leftItems = s.leftCol
          ? Array.from(
              s.leftCol.querySelectorAll(`.${s.specBoxClass}, .${s.descBoxClass}`)
            ).reverse()
          : [];
        const rightItems = s.rightCol
          ? s.rightCol.querySelectorAll(`.${s.viewItemClass}`)
          : [];

        // початковий стан
        gsap.set(leftItems,  { y: 40, opacity: 0 });
        gsap.set(rightItems, { y: 50, opacity: 0 });

        const tl = gsap.timeline();

        // 1) фон падає зверху
        tl.fromTo(titleBgRef.current,
          { y: "-101%" },
          { y: "0%", duration: 0.7, ease: "power3.out" }
        );

        // 2) текст зліва направо
        tl.fromTo(titleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.out" },
          "-=0.5"
        );

        // 3) картинки видів знизу вверх
        tl.to(rightItems, {
          y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.1,
          onComplete: () => s.rightCol?.classList.add(s.rightColAnimatedClass),
        }, "-=0.25");

        // 4) опис і характеристики знизу вверх
        tl.to(leftItems, {
          y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.08,
        }, "-=0.25");
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.titleBg} ref={titleBgRef} />
      <h2 className={styles.title} ref={titleRef}>OVERVIEW</h2>
      <div className={styles.content}>
        <div className={styles.right}>
          <OverviewCanvas targetView={targetView} />
        </div>
        <div className={styles.left}>
          <ChairSpecs
            ref={specsRef}
            onViewClick={setTargetView}
            activeView={targetView}
          />
        </div>
      </div>
    </section>
  );
}
