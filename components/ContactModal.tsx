'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Automation Workflow',
    budget: '$1,000 - $3,000',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent background scroll when active
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

  // Handle escape keypress close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate database write / webhook delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        projectType: 'Automation Workflow',
        budget: '$1,000 - $3,000',
        details: '',
      });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Intake Form Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>

            {!isSubmitted ? (
              <>
                <h2 className="mb-2 text-2xl font-bold text-white font-serif">Let&apos;s Build Together</h2>
                <p className="mb-6 text-sm text-gray-400">
                  Outline your requirements below. I will audit your workflow suggestions and follow up in 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Elon Musk"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/50"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="elon@spacex.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/50"
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="projectType" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/50"
                      >
                        <option>Automation Workflow</option>
                        <option>Custom GPT &amp; LLM Tuning</option>
                        <option>Web Application</option>
                        <option>Corporate Training</option>
                        <option>Consulting</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Budget Tier
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/50"
                      >
                        <option>Under $1,000</option>
                        <option>$1,000 - $3,000</option>
                        <option>$3,000 - $5,000</option>
                        <option>$5,000+</option>
                      </select>
                    </div>
                  </div>

                  {/* Details field */}
                  <div>
                    <label htmlFor="details" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Project Specifications
                    </label>
                    <textarea
                      required
                      id="details"
                      name="details"
                      rows={4}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Describe what you want to automate or build..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/50 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b35] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#ff804e] hover:shadow-lg hover:shadow-[#ff6b35]/25 disabled:bg-[#ff6b35]/50"
                  >
                    {isSubmitting ? (
                      <span>Syncing Outbox...</span>
                    ) : (
                      <>
                        Send Inquiry <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle2 className="mb-4 h-16 w-16 text-green-500 animate-bounce" />
                <h3 className="mb-2 text-2xl font-bold text-white font-serif">Outbox Synced!</h3>
                <p className="mb-6 max-w-sm text-sm text-gray-400">
                  Thanks for connecting! I have received your request. I will audit the details and get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
