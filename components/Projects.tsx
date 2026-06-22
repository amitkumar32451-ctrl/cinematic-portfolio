'use client';

import { motion } from 'framer-motion';

interface Project {
  title: string;
  category: string;
  description: string;
  badge: 'Building' | 'Coming Soon';
}

const projects: Project[] = [
  {
    title: 'AuraVocab',
    badge: 'Building',
    category: 'AI Learning',
    description:
      'An AI-powered vocabulary platform designed to help learners master English through personalized word discovery, intelligent practice, and daily improvement.',
  },
  {
    title: 'Prompt Vault',
    badge: 'Building',
    category: 'Prompt Engineering',
    description:
      'A curated collection of high-quality prompts, frameworks, and workflows for productivity, content creation, learning, and business.',
  },
  {
    title: 'AI Student Toolkit',
    badge: 'Coming Soon',
    category: 'Education',
    description:
      'A practical ecosystem of AI tools, resources, and guides that help students learn faster, study smarter, and stay ahead.',
  },
  {
    title: 'Content Engine',
    badge: 'Building',
    category: 'Automation',
    description:
      'An AI-assisted content workflow for researching trends, generating ideas, scripting videos, and streamlining content creation.',
  },
  {
    title: 'Signal Over Noise',
    badge: 'Coming Soon',
    category: 'AI Research',
    description:
      'A platform dedicated to simplifying AI news, trends, and breakthroughs into actionable insights without hype or unnecessary complexity.',
  },
  {
    title: 'AI Workflow Lab',
    badge: 'Coming Soon',
    category: 'Automation',
    description:
      'A collection of practical AI workflows, automations, and systems designed to save time, improve productivity, and streamline everyday tasks.',
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  } as const,
};

export default function Projects() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-center mb-4"
        >
          Building In Public
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-center text-lg mb-16 max-w-2xl mx-auto"
        >
          A collection of products, experiments, and ideas I&apos;m building
          while exploring the future of AI.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/30 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-gray-500 text-xs uppercase tracking-widest">
                  {project.category}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.badge === 'Building'
                      ? 'bg-[#ff6b35]/20 text-[#ff6b35]'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {project.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">
                {project.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {project.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
