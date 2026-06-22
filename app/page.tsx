'use client';

import { useRef } from 'react';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Overlay from '@/components/Overlay';
import TagScroll from '@/components/TagScroll';
import AboutMeSplit from '@/components/AboutMeSplit';
import ServicesGrid from '@/components/ServicesGrid';
import JourneyTimeline from '@/components/JourneyTimeline';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      {/* Hero Scroll Section */}
      <div ref={heroRef} style={{ position: 'relative', height: '500vh' }}>
        <ScrollyCanvas heroRef={heroRef} />
        <Overlay heroRef={heroRef} />
      </div>

      {/* Content Sections */}
      <TagScroll />
      <AboutMeSplit />
      <ServicesGrid />
      <JourneyTimeline />
      <Projects />
      <Footer />
    </main>
  );
}
