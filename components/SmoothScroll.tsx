'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface SmoothScrollProps {
  children: React.ReactNode
  onSectionChange?: (index: number) => void
}

export default function SmoothScroll({ children, onSectionChange }: SmoothScrollProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isAnimating = useRef(false)
  const currentSection = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = Array.from(container.children) as HTMLElement[]

    // Position each section absolutely
    sections.forEach((section, i) => {
      section.style.position = 'absolute'
      section.style.width = '100%'
      section.style.height = '100vh'
      section.style.top = i === 0 ? '0' : '100vh'
    })

    function scrollToNext() {
      if (isAnimating.current || currentSection.current >= sections.length - 1) return
      isAnimating.current = true
      onSectionChange?.(currentSection.current + 1)

      const current = sections[currentSection.current]
      const next = sections[currentSection.current + 1]

      gsap.to(next, { top: '0', opacity: 1, duration: 0.9, ease: 'power3.inOut' })
      gsap.to(current, {
        top: '-100vh',
        opacity: 0.3,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          currentSection.current += 1
          isAnimating.current = false
        },
      })
    }

    function scrollToPrev() {
      if (isAnimating.current || currentSection.current <= 0) return
      isAnimating.current = true
      onSectionChange?.(currentSection.current - 1)

      const current = sections[currentSection.current]
      const prev = sections[currentSection.current - 1]

      gsap.to(prev, { top: '0', opacity: 1, duration: 0.9, ease: 'power3.inOut' })
      gsap.to(current, {
        top: '100vh',
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          currentSection.current -= 1
          isAnimating.current = false
        },
      })
    }

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      if (e.deltaY > 0) {
        scrollToNext()
      } else {
        scrollToPrev()
      }
    }

    let touchStartY = 0

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    function handleTouchEnd(e: TouchEvent) {
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 30) return
      if (delta > 0) {
        scrollToNext()
      } else {
        scrollToPrev()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <main id="main-container" ref={containerRef}>
      {children}
    </main>
  )
}
