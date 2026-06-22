'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Briefcase, Cpu, HelpCircle } from 'lucide-react';
import SubmitButton from './SubmitButton';
import { trackEvent } from '@/utils/analytics';

export default function ProjectInquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    botField: '', // Honeypot spam trap
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Listen for global open event with project payload
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const name = customEvent.detail?.projectName || 'AI Project';
      
      setProjectName(name);
      setIsOpen(true);
      setIsSuccess(false);
      setErrorMessage('');
      setFormData({ name: '', email: '', company: '', message: '', botField: '' });
      setErrors({});
      trackEvent('Project Inquiry Opened', { project: name });
    };

    window.addEventListener('open-project-inquiry', handleOpen);
    return () => window.removeEventListener('open-project-inquiry', handleOpen);
  }, []);

  // 2. Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 3. Escape keypress to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Focus trapping logic
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, input, textarea, select, a, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus name input on mount
    const targetFocus = focusable[1] || first;
    targetFocus.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (!formData.message.trim()) newErrors.message = 'Question or inquiry text is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    
    const payload = {
      ...formData,
      projectName,
    };

    trackEvent('Form Submitted', { formType: 'Project Inquiry', project: projectName });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        trackEvent('Form Success', { formType: 'Project Inquiry', project: projectName });
      } else {
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
        trackEvent('Form Failure', { formType: 'Project Inquiry', project: projectName, reason: result.message });
      }
    } catch {
      setErrorMessage('Network error. Failed to reach the server.');
      trackEvent('Form Failure', { formType: 'Project Inquiry', project: projectName, reason: 'Network Exception' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-6 shadow-2xl md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title / Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Project Inquiry</h2>
              <p className="mt-1 text-sm text-gray-400">
                Ask a question, request a walkthrough, or share feedback on this builder project.
              </p>
            </div>

            {isSuccess ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Inquiry Received</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Thank you for your inquiry about <span className="font-bold text-[#ff6b35]">{projectName}</span>. I&apos;ve received your question and will get back to you within 24–48 hours.
                </p>
              </motion.div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot Spam Trap */}
                <input
                  type="text"
                  name="botField"
                  value={formData.botField}
                  onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Project Name Field (Auto-filled & Read-only) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Selected Project
                  </label>
                  <div className="relative">
                    <Cpu className="absolute left-3.5 top-3.5 h-4 w-4 text-[#ff6b35]" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={projectName}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-[#ff6b35] font-bold outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff6b35] focus:bg-white/[0.07]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Grid row for Email & Company */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff6b35] focus:bg-white/[0.07]"
                        placeholder="jane@company.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  {/* Company Field */}
                  <div>
                    <label htmlFor="company" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Company <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff6b35] focus:bg-white/[0.07]"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                </div>

                {/* Inquiry Message Field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Question / Inquiry *
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff6b35] focus:bg-white/[0.07] resize-none"
                      placeholder={`What would you like to know about ${projectName}?`}
                    />
                  </div>
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>

                {/* Backend Error Alert */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <SubmitButton
                    label="Submit Inquiry"
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                  />
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
