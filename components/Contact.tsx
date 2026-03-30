'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from '@/styles/Contact.module.css'

const TITLE_LINES = ["Let's work", "together"]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const label   = labelRef.current
    if (!section || !label) return

    // collect all letter spans + the label
    const letters = Array.from(section.querySelectorAll('[data-letter]')) as HTMLElement[]
    gsap.set([label, ...letters], { opacity: 0, y: 20 })

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        // label slides in
        gsap.to(label, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })

        // title letters stagger in
        gsap.to(letters, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          delay: 0.35,
          ease: 'power3.out',
        })
      },
      { threshold: 0.3 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <p ref={labelRef} className={styles.label}>Get in touch</p>

        <h2 className={styles.title}>
          {TITLE_LINES.map((line, li) => (
            <span key={li} className={styles.titleLine}>
              {line.split('').map((char, ci) => (
                <span
                  key={ci}
                  data-letter
                  className={styles.titleLetter}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              {li < TITLE_LINES.length - 1 && <br />}
            </span>
          ))}
        </h2>

        <a href="mailto:hello@modernify.com" className={styles.email}>
          hello@modernify.com
        </a>
      </div>
    </section>
  )
}
