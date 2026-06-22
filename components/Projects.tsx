'use client';

import { useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, Variants } from 'framer-motion';
import ProjectModal from './ProjectModal';

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

// Spotlight Project Card component
function ProjectCard({
  project,
  variants,
  onClick,
}: {
  project: Project;
  variants: Variants;
  onClick: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={variants}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b35]/30"
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

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
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

          <h3 className="text-2xl font-bold mb-3 text-white transition-colors group-hover:text-[#ff6b35]">
            {project.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff6b35] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Learn More <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </motion.div>
  );
}

interface ProjectsProps {
  onContactClick: () => void;
}

export default function Projects({ onContactClick }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4 text-white font-serif"
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
            <ProjectCard
              key={project.title}
              project={project}
              variants={cardVariants}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>
      </div>

      {/* Case study details modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={onContactClick}
      />
    </section>
  );
}
