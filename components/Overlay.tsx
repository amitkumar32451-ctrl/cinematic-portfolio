'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

interface OverlayProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function Overlay({ heroRef }: OverlayProps) {
  // CRITICAL: Use the SAME heroRef as ScrollyCanvas — never create an internal ref.
  // Both components must share the exact same scroll coordinate system.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // === PHASE 1 — Ghost Watermark (0.00–0.28) ===
  const phase1Opacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.18, 0.28],
    [1, 1, 1, 0]
  );

  // === PHASE 2 — Name Intro Block (0.28–0.52) ===
  const phase2Opacity = useTransform(
    scrollYProgress,
    [0.28, 0.38, 0.44, 0.52],
    [0, 1, 1, 0]
  );
  const phase2Y = useTransform(
    scrollYProgress,
    [0.28, 0.52],
    [60, -60]
  );

  // === PHASE 3 — Role Statement (0.52–0.78) ===
  const phase3Opacity = useTransform(
    scrollYProgress,
    [0.52, 0.62, 0.70, 0.78],
    [0, 1, 1, 0]
  );

  // === PHASE 4 — Main Headline (0.78–1.00) ===
  const phase4Opacity = useTransform(
    scrollYProgress,
    [0.78, 0.88, 0.96, 1.00],
    [0, 1, 1, 0]
  );

  // Hide the entire overlay once we've scrolled past the hero section
  const overlayVisibility = useTransform(
    scrollYProgress,
    [0, 0.99, 1],
    [1, 1, 0]
  );

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        opacity: overlayVisibility,
      }}
    >
      {/* Phase 1 — Ghost Watermark */}
      <motion.div
        style={{
          position: 'absolute',
          willChange: 'opacity, transform',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase1Opacity,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(5rem, 15vw, 14rem)',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.06)',
            letterSpacing: '-0.03em',
            userSelect: 'none',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          Amit Kumar
        </h1>
      </motion.div>

      {/* Phase 2 — Name Intro Block */}
      <motion.div
        style={{
          position: 'absolute',
          willChange: 'opacity, transform',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase2Opacity,
          y: phase2Y,
        }}
      >
        <p
          style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          I Explore AI &amp; Share What Matters
        </p>
        <h2
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}
        >
          Amit Kumar.
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.1em',
          }}
        >
          Building in Public · Learning Daily
        </p>
      </motion.div>

      {/* Phase 3 — Role Statement */}
      <motion.div
        style={{
          position: 'absolute',
          willChange: 'opacity, transform',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase3Opacity,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          AI Explorer &amp;
          <br />
          Content Creator
        </h2>
      </motion.div>

      {/* Phase 4 — Main Headline */}
      <motion.div
        style={{
          position: 'absolute',
          willChange: 'opacity, transform',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase4Opacity,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}
        >
          AI Is Moving Fast —
          <br />
          I&apos;ll Help You Keep Up.
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.1em',
          }}
        >
          AI Tools · AI Workflows · Real Use Cases
        </p>
      </motion.div>
    </motion.div>
  );
}
