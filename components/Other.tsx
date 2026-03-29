"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "@/styles/Other.module.css";
import Contact from "@/components/Contact";

const CARDS = [
  { id: 1, label: "quiet control", title: "Signal Drift", img: "/img/chair1.jpg" },
  { id: 2, label: "clean form",    title: "Void Frame",   img: "/img/chair2.jpg" },
  { id: 3, label: "raw edge",      title: "Hard Line",    img: "/img/chair3.jpg" },
];

export default function Other() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);
  const holderRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const spacer  = spacerRef.current;
    const holder  = holderRef.current;
    if (!section || !spacer || !holder) return;

    const vh       = window.innerHeight;
    const numCards = CARDS.length;

    // spacer дає висоту для скролу: (numCards-1) переходів + 2 запас
    spacer.style.height = `${(numCards + 1) * vh}px`;

    const cardEls = Array.from(holder.children) as HTMLElement[];

    function onScroll() {
      const st = section.scrollTop;

      cardEls.forEach((card, i) => {
        if (i === numCards - 1) return; // остання картка не рухається
        // кожна картка починає виїжджати після intro (1vh) + offset попередніх
        const start    = vh + i * vh;
        const progress = Math.max(0, Math.min(1, (st - start) / vh));
        gsap.set(card, { y: -progress * vh });
      });
    }

    section.addEventListener("scroll", onScroll, { passive: true });
    return () => section.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>

      <div className={styles.intro}>Enter the Frame</div>

      {/* spacer — дає скролл-висоту; holder всередині стікає */}
      <div ref={spacerRef} className={styles.spacer}>
        <div ref={holderRef} className={styles.holder}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className={styles.card}
              style={{ zIndex: CARDS.length - i }}
            >
              <div className={styles.cardInner}>
                <img src={card.img} alt={card.title} className={styles.cardImg} />
                <div className={styles.cardOverlay}>
                  <p className={styles.cardLabel}>{card.label}</p>
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Contact />

    </section>
  );
}
