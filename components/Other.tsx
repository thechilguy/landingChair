"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "@/styles/Other.module.css";
import Contact from "@/components/Contact";

const CARDS = [
  { id: 1, label: "quiet control", title: "Signal Drift", index: "01", heading: "Form meets silence", img: "/img/chair1.jpg" },
  { id: 2, label: "clean form",    title: "Void Frame",   index: "02", heading: "Negative space",    img: "/img/chair2.jpg" },
  { id: 3, label: "raw edge",      title: "Hard Line",    index: "03", heading: "Brutal precision",  img: "/img/chair3.jpg" },
];

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

export default function Other() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);
  const holderRef  = useRef<HTMLDivElement>(null);
  const innerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const expanded   = useRef<boolean[]>(CARDS.map(() => false));

  function expandCard(i: number) {
    if (expanded.current[i]) return;
    expanded.current[i] = true;

    const vw          = window.innerWidth;
    const imageWidth  = Math.min(480, vw * 0.8);
    const targetWidth = Math.min(880, vw * 0.92);
    const inner       = innerRefs.current[i];
    const panel       = textRefs.current[i];
    if (!inner || !panel) return;

    // 1. expand the card
    gsap.fromTo(inner,
      { width: Math.min(480, window.innerWidth * 0.8) },
      { width: targetWidth, duration: 0.75, ease: "power3.out" },
    );

    // 2. stagger-animate each child of the text panel
    if (targetWidth - imageWidth > 100) {
      const items = Array.from(panel.children) as HTMLElement[];
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, delay: 0.4, ease: "power3.out" },
      );
    }
  }

  useEffect(() => {
    const section = sectionRef.current;
    const spacer  = spacerRef.current;
    const holder  = holderRef.current;
    if (!section || !spacer || !holder) return;

    const vh       = window.innerHeight;
    const numCards = CARDS.length;

    spacer.style.height = `${numCards * vh}px`;

    const cardEls = Array.from(holder.children) as HTMLElement[];

    gsap.delayedCall(0.1, () => expandCard(0));

    function onScroll() {
      const st = section!.scrollTop;

      cardEls.forEach((card, i) => {
        if (i === numCards - 1) return;

        const start    = i * vh;
        const progress = Math.max(0, Math.min(1, (st - start) / vh));
        gsap.set(card, { y: -progress * vh });

        if (progress > 0.05 && i + 1 < numCards) {
          expandCard(i + 1);
        }
      });
    }

    section.addEventListener("scroll", onScroll, { passive: true });
    return () => section.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>

      <div ref={spacerRef} className={styles.spacer}>
        <div ref={holderRef} className={styles.holder}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className={styles.card}
              style={{ zIndex: CARDS.length - i }}
            >
              <div
                ref={(el) => { innerRefs.current[i] = el; }}
                className={styles.cardInner}
              >
                {/* left — image */}
                <div className={styles.cardImageWrap}>
                  <img src={card.img} alt={card.title} className={styles.cardImg} />
                  <div className={styles.cardOverlay}>
                    <p className={styles.cardLabel}>{card.label}</p>
                    <h2 className={styles.cardTitle}>{card.title}</h2>
                  </div>
                </div>

                {/* right — text panel, children animated individually */}
                <div
                  ref={(el) => { textRefs.current[i] = el; }}
                  className={styles.cardTextPanel}
                >
                  <span className={styles.cardIndex}>{card.index}</span>
                  <h3 className={styles.cardHeading}>{card.heading}</h3>
                  <p className={styles.cardText}>{LOREM}</p>
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
