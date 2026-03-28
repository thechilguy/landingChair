'use client'

import { useState } from 'react'
import SmoothScroll from '@/components/SmoothScroll'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Overview from '@/components/Overview'
import NavCircle from '@/components/NavCircle'

const SECTIONS = ['Home', 'About', 'Overview']

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)

  return (
    <>
      <SmoothScroll onSectionChange={setCurrentSection}>
        <Hero />
        <About />
        <Overview />
      </SmoothScroll>
      <NavCircle currentSection={currentSection} sections={SECTIONS} />
    </>
  )
}
