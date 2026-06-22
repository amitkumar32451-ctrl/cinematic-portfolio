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

  // Scroll indicator opacity (fades out rapidly on scroll)
  const scrollPromptOpacity = useTransform(
    scrollYProgress,
    [0, 0.05],
    [1, 0]
  );

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

      {/* Floating Animated Scroll Prompt */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          x: '-50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: scrollPromptOpacity,
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          Scroll to explore
        </span>
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '18px',
            height: '28px',
            borderRadius: '9px',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '6px',
              borderRadius: '1.5px',
              background: '#ff6b35',
              position: 'absolute',
              top: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floating Glassmorphic Skip Visuals Button */}
      <motion.button
        onClick={() => {
          const aboutSection = document.getElementById('about');
          aboutSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          pointerEvents: 'auto', // Override parent's pointer-events: none to make button clickable
          zIndex: 40,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
      >
        Skip Visuals <span className="text-[#ff6b35]">↓</span>
      </motion.button>
    </motion.div>
  );
}
