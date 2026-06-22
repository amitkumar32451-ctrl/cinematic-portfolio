'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Cpu, Layers, Terminal } from 'lucide-react';

interface Project {
  title: string;
  category: string;
  description: string;
  badge: 'Building' | 'Coming Soon';
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

// Custom technical metadata mapping for each project to make the case studies look extremely rich
const projectMetadataMap: Record<
  string,
  {
    tagline: string;
    details: string;
    features: string[];
    techStack: string[];
  }
> = {
  AuraVocab: {
    tagline: 'AI English vocabulary acquisition platform.',
    details:
      'AuraVocab implements spaced repetition algorithms powered by LLMs to create personalized contextual sentences, audio pronunciations, and visual prompts for active language learning.',
    features: [
      'Context-aware sentence generator using GPT-4o-mini',
      'Spaced repetition scheduler (SuperMemo-2 algorithm adaptation)',
      'Speech-to-text pronunciation assessment tests',
    ],
    techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'TailwindCSS', 'Supabase'],
  },
  'Prompt Vault': {
    tagline: 'High-performance prompt design library.',
    details:
      'A structured ecosystem for Prompt Engineering, housing tested prompt structures, agent behaviors, and system prompts optimized for Claude, GPT, and Gemini.',
    features: [
      'Structured prompt frameworks (Few-shot, Chain-of-Thought, ReAct)',
      'One-click template copy compiler',
      'Prompt latency and API cost estimation profiles',
    ],
    techStack: ['Next.js', 'Framer Motion', 'Markdown Parser', 'Lucide Icons'],
  },
  'AI Student Toolkit': {
    tagline: 'Autonomous studying system for engineering learners.',
    details:
      'A suite of utilities built to help students compile reading materials into lecture notes, automatically construct flashcards, and run mock test simulators.',
    features: [
      'PDF-to-study-guide processor using Retrieval-Augmented Generation (RAG)',
      'Auto-flashcard generator with Anki exports',
      'AI tutor chatbot optimized for technical subjects (Math/Physics)',
    ],
    techStack: ['Next.js', 'LangChain', 'Pinecone Vector DB', 'Python', 'FastAPI'],
  },
  'Content Engine': {
    tagline: 'Multi-agent system for scripting and media production.',
    details:
      'An automation workflow designed to scrape trending tech articles, outline scripts, and suggest video storyboard visual sequences.',
    features: [
      'Trending news scraper and topic ranker',
      'Multi-agent scripting workflow (Researcher, Copywriter, Editor)',
      'Automated asset sourcing scripts',
    ],
    techStack: ['n8n automation', 'OpenAI Assistant API', 'GitHub Actions', 'Node.js'],
  },
  'Signal Over Noise': {
    tagline: 'Real-time AI research filter.',
    details:
      'A curated research dashboard that tracks AI model releases, arXiv research papers, and technical breakthroughs, distilling them into actionable technical summaries.',
    features: [
      'arXiv feed keyword filter & paper summarizer',
      'AI Model leaderboard tracker',
      'Email digest automation compiler',
    ],
    techStack: ['Next.js', 'Resend Email API', 'Supabase DB', 'Llama Index'],
  },
  'AI Workflow Lab': {
    tagline: 'Enterprise-grade task automation templates.',
    details:
      'A collection of automated scripts, webhooks, and integrations showing how to bridge LLMs with everyday software tools (Slack, Notion, Gmail).',
    features: [
      'Email automation routing auto-replies',
      'Notion task manager auto-tagger',
      'Slack bot alert system for anomaly detection',
    ],
    techStack: ['Make.com', 'Zapier CLI', 'JavaScript', 'Google Cloud APIs'],
  },
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  // Handle escape keypress close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const metadata = projectMetadataMap[project.title] || {
    tagline: 'AI system built for automation.',
    details: project.description,
    features: ['Custom system prompt designs', 'Performance audits', 'Workflow integrations'],
    techStack: ['AI tools', 'Next.js', 'TailwindCSS'],
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#ff6b35]">
              {project.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                project.badge === 'Building'
                  ? 'bg-[#ff6b35]/20 text-[#ff6b35]'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {project.badge}
            </span>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">{project.title}</h2>
          <p className="mb-6 text-lg text-gray-300 font-medium italic">{metadata.tagline}</p>

          <hr className="border-white/10 mb-6" />

          {/* Modal Grid Columns */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {/* Left Column - Details & Features */}
            <div className="space-y-6 md:col-span-3">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Project Overview
                </h4>
                <p className="text-sm leading-relaxed text-gray-300">{metadata.details}</p>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" /> Key Architecture
                </h4>
                <ul className="space-y-2">
                  {metadata.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff6b35] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Tech Stack & Actions */}
            <div className="flex flex-col justify-between space-y-6 md:col-span-2">
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" /> Tooling & Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metadata.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b35] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#ff804e] hover:shadow-lg hover:shadow-[#ff6b35]/25"
                >
                  Ask Me About This Project <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
