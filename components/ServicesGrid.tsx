'use client';

import { motion, useMotionValue, useMotionTemplate, Variants } from 'framer-motion';
import { Search, Terminal, BookOpen, Video, Zap, Cpu } from 'lucide-react';
import { ElementType } from 'react';

interface ServiceCardData {
  icon: ElementType;
  title: string;
  description: string;
}

const services: ServiceCardData[] = [
  {
    icon: Search,
    title: 'AI Tool Reviews',
    description: 'Testing and reviewing AI tools so people can find what actually works.',
  },
  {
    icon: Terminal,
    title: 'Prompt Engineering',
    description: 'Creating effective prompts for content creation, productivity, and learning.',
  },
  {
    icon: BookOpen,
    title: 'AI Education',
    description: 'Breaking down AI concepts into simple, practical explanations.',
  },
  {
    icon: Video,
    title: 'Content Creation',
    description: 'Short-form videos focused on AI trends, tools, and workflows.',
  },
  {
    icon: Zap,
    title: 'AI Productivity',
    description: 'Workflows that help students and professionals save time.',
  },
  {
    icon: Cpu,
    title: 'Automation',
    description: 'Exploring AI agents, automations, and future-ready workflows.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Spotlight Service Card component
function ServiceCard({ service, variants }: { service: ServiceCardData; variants: Variants }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = service.icon;

  return (
    <motion.div
      variants={variants}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
    >
      {/* Spotlight hover effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 107, 53, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="mb-4 text-[#ff6b35]">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{service.description}</p>
      </div>
    </motion.div>
  );
}

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-5xl font-serif">
            What I Do
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
            Exploring AI and sharing practical knowledge through content and experiments.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
