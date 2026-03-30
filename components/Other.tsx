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
    const text        = textRefs.current[i];
    if (!inner || !text) return;

    gsap.to(inner, { width: targetWidth, duration: 0.75, ease: "power3.out" });

    // reveal text only if there is enough room
    if (targetWidth - imageWidth > 100) {
      gsap.fromTo(
        text,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power3.out" },
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

    spacer.style.height = `${(numCards + 1) * vh}px`;

    // set initial (collapsed) width for every cardInner
    const imageWidth = Math.min(480, window.innerWidth * 0.8);
    innerRefs.current.forEach((el) => {
      if (el) el.style.width = `${imageWidth}px`;
    });

    const cardEls = Array.from(holder.children) as HTMLElement[];

    // first card expands on mount
    expandCard(0);

    function onScroll() {
      const st = section!.scrollTop;

      cardEls.forEach((card, i) => {
        if (i === numCards - 1) return;

        const start    = vh + i * vh;
        const progress = Math.max(0, Math.min(1, (st - start) / vh));
        gsap.set(card, { y: -progress * vh });

        // when a card starts sliding away, expand the one underneath
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

      <div className={styles.intro}>Enter the Frame</div>

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

                {/* right — text (hidden until expansion) */}
                <div
                  ref={(el) => { textRefs.current[i] = el; }}
                  className={styles.cardTextPanel}
                >
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
