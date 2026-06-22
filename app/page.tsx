'use client';

import { useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Overlay from '@/components/Overlay';
import TagScroll from '@/components/TagScroll';
import AboutMeSplit from '@/components/AboutMeSplit';
import ServicesGrid from '@/components/ServicesGrid';
import JourneyTimeline from '@/components/JourneyTimeline';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  return (
    <main>
      <Navbar onContactClick={handleContactClick} />

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
      <Projects onContactClick={handleContactClick} />
      <Footer onContactClick={handleContactClick} />

      {/* Client intake form modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
