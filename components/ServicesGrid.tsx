'use client';

import { motion } from 'framer-motion';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
}

const services: ServiceCard[] = [
  {
    icon: '🔍',
    title: 'AI Tool Reviews',
    description: 'Testing and reviewing AI tools so people can find what actually works.',
  },
  {
    icon: '✨',
    title: 'Prompt Engineering',
    description: 'Creating effective prompts for content creation, productivity, and learning.',
  },
  {
    icon: '📚',
    title: 'AI Education',
    description: 'Breaking down AI concepts into simple, practical explanations.',
  },
  {
    icon: '🎬',
    title: 'Content Creation',
    description: 'Short-form videos focused on AI trends, tools, and workflows.',
  },
  {
    icon: '⚡',
    title: 'AI Productivity',
    description: 'Workflows that help students and professionals save time.',
  },
  {
    icon: '🤖',
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

export default function ServicesGrid() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-center text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">
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
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="mb-4 text-3xl">{service.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
