'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
];

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hide navbar on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 120) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo & Availability Status */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-white">
              Amiit<span className="text-[#ff6b35]">.ai</span>
            </a>
            
            <div className="hidden items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold text-green-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Available for Q3 Automations
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Connect Button */}
          <div className="hidden md:block">
            <button
              onClick={onContactClick}
              className="rounded-full bg-[#ff6b35] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#ff804e] hover:shadow-lg hover:shadow-[#ff6b35]/25"
            >
              Let&apos;s Connect
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block text-gray-400 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Slide-Down Drawer */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-[65px] left-0 right-0 z-40 overflow-hidden border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-lg md:hidden"
      >
        <div className="flex flex-col gap-6 px-6 py-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              onContactClick();
            }}
            className="mt-2 w-full rounded-full bg-[#ff6b35] py-3 text-center text-sm font-semibold text-white"
          >
            Let&apos;s Connect
          </button>
        </div>
      </motion.div>
    </>
  );
}
