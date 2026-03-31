'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface SmoothScrollProps {
  children: React.ReactNode
  onSectionChange?: (index: number) => void
}

export default function SmoothScroll({ children, onSectionChange }: SmoothScrollProps) {
  const containerRef  = useRef<HTMLElement>(null)
  const isAnimating   = useRef(false)
  const currentSection = useRef(0)
  const targetScroll  = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = Array.from(container.children) as HTMLElement[]

    sections.forEach((section, i) => {
      section.style.position = 'absolute'
      section.style.width    = '100%'
      section.style.top      = i === 0 ? '0' : '100vh'
      section.style.height   = '100vh'
      if (i === sections.length - 1) section.style.overflowY = 'scroll'
    })

    function scrollToNext() {
      if (isAnimating.current || currentSection.current >= sections.length - 1) return
      isAnimating.current = true
      onSectionChange?.(currentSection.current + 1)

      const current = sections[currentSection.current]
      const next    = sections[currentSection.current + 1]

      gsap.to(next,    { top: '0',      opacity: 1,   duration: 0.9, ease: 'power3.inOut' })
      gsap.to(current, { top: '-100vh', opacity: 0.3, duration: 0.9, ease: 'power3.inOut',
        onComplete: () => { currentSection.current += 1; isAnimating.current = false },
      })
    }

    function scrollToPrev() {
      if (isAnimating.current || currentSection.current <= 0) return
      isAnimating.current = true
      onSectionChange?.(currentSection.current - 1)

      // leaving the last section — reset inner scroll target
      if (currentSection.current === sections.length - 1) {
        targetScroll.current = 0
        gsap.killTweensOf(sections[currentSection.current], 'scrollTop')
        sections[currentSection.current].scrollTop = 0
      }

      const current = sections[currentSection.current]
      const prev    = sections[currentSection.current - 1]

      gsap.to(prev,    { top: '0',     opacity: 1, duration: 0.9, ease: 'power3.inOut' })
      gsap.to(current, { top: '100vh',             duration: 0.9, ease: 'power3.inOut',
        onComplete: () => { currentSection.current -= 1; isAnimating.current = false },
      })
    }

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      const isLast = currentSection.current === sections.length - 1

      if (isLast) {
        const section   = sections[currentSection.current]
        const maxScroll = section.scrollHeight - section.clientHeight

        if (e.deltaY < 0 && targetScroll.current <= 0) {
          scrollToPrev()
          return
        }

        // don't touch scrollTop while a section transition is running
        if (isAnimating.current) return

        targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + e.deltaY))
        gsap.to(section, {
          scrollTop: targetScroll.current,
          duration:  0.8,
          ease:      'power3.out',
          overwrite: 'auto', // only kills conflicting scrollTop tweens, not the section-transition top tween
        })
        return
      }

      if (e.deltaY > 0) scrollToNext()
      else scrollToPrev()
    }

    let touchStartY = 0

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    function handleTouchEnd(e: TouchEvent) {
      const isLast = currentSection.current === sections.length - 1
      const delta  = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 30) return
      if (isLast) {
        const section = sections[currentSection.current]
        if (delta < 0 && section.scrollTop <= 0) scrollToPrev()
        return
      }
      if (delta > 0) scrollToNext()
      else scrollToPrev()
    }

    container.addEventListener('wheel',      handleWheel,      { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true  })
    container.addEventListener('touchend',   handleTouchEnd,   { passive: true  })

    return () => {
      container.removeEventListener('wheel',      handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend',   handleTouchEnd)
    }
  }, [])

  return (
    <main id="main-container" ref={containerRef}>
      {children}
    </main>
  )
}
