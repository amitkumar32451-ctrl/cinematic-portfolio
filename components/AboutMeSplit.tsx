'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { target: 100, suffix: '+', label: 'AI Tools Explored' },
  { target: 50, suffix: '+', label: 'Workflows Tested' },
  { target: 3, suffix: '+', label: 'Years Experience' },
  { target: 2026, suffix: '', label: 'Building My AI Brand' },
];

function useCountUp(target: number, duration: number, start: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, start]);

  return count;
}

function StatCounter({ stat, inView }: { stat: StatItem; inView: boolean }) {
  const count = useCountUp(stat.target, 2000, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-5xl font-extrabold text-white md:text-6xl">
        {count}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
    </motion.div>
  );
}

export default function AboutMeSplit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2,
    });

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection]);

  return (
    <section id="about" className="py-24 md:py-32">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-5">
          {/* Left Column — Stats */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {stats.map((stat, i) => (
              <StatCounter key={i} stat={stat} inView={inView} />
            ))}
          </div>

          {/* Right Column — Bio */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-6 text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
              My Journey Into AI
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I&apos;m Amit Kumar, a Mechanical Engineering graduate turned AI creator.
              </p>
              <p>
                After spending nearly three years in customer support, I developed a
                passion for solving problems, simplifying complex ideas, and helping
                people find practical solutions.
              </p>
              <p>
                Today, I explore AI tools, workflows, and emerging technologies,
                sharing what I learn through content and real-world experimentation.
              </p>
              <p>
                I&apos;m building in public—one project, one idea, and one lesson at a
                time—with a simple goal:
              </p>
              <p className="font-medium italic text-white">
                To make AI understandable, practical, and accessible for everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
