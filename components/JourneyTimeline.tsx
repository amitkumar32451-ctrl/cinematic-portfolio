'use client';

import { motion } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    year: '2018',
    title: 'Completed School Education',
    description: 'Started exploring technology and engineering.',
  },
  {
    year: '2018–2022',
    title: 'Mechanical Engineering',
    description: 'Built technical foundations and problem-solving skills.',
  },
  {
    year: '2023',
    title: 'Started Professional Career',
    description: 'Entered customer support and client-facing roles.',
  },
  {
    year: '2024',
    title: 'Discovered AI',
    description: 'Began exploring AI tools and productivity workflows.',
  },
  {
    year: '2025',
    title: 'Learning Content Creation',
    description: 'Sharing AI tools and insights publicly.',
  },
  {
    year: '2026',
    title: 'Building an AI Brand',
    description: 'Documenting my journey and helping others learn AI.',
  },
];

export default function JourneyTimeline() {
  return (
    <section className="py-24 md:py-32">
      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-center text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">
            My Journey
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
            Key milestones that shaped my path into AI and content creation.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line — mobile: left-4, desktop: centered */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/20 md:left-1/2" />

          <div className="space-y-12">
            {timelineItems.map((item, i) => {
              const isEven = i % 2 === 1;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative flex items-start md:items-center"
                >
                  {/* Dot — mobile: left-4, desktop: centered */}
                  <div className="absolute left-4 top-1 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#ff6b35] md:left-1/2 md:top-1/2 md:-translate-y-1/2" />

                  {/* Mobile layout: all items on right side */}
                  <div className="block pl-10 md:hidden">
                    <div className="mb-1 text-sm font-bold text-[#ff6b35]">{item.year}</div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>

                  {/* Desktop layout: alternating sides */}
                  <div className="hidden w-full md:grid md:grid-cols-2 md:gap-12">
                    {/* Left side */}
                    <div className={isEven ? '' : 'text-right'}>
                      {!isEven && (
                        <>
                          <div className="mb-1 text-sm font-bold text-[#ff6b35]">{item.year}</div>
                          <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </>
                      )}
                    </div>
                    {/* Right side */}
                    <div className={isEven ? '' : ''}>
                      {isEven && (
                        <>
                          <div className="mb-1 text-sm font-bold text-[#ff6b35]">{item.year}</div>
                          <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
