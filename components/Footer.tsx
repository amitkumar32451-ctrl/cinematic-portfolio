import React from 'react';

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/amiitai' },
  { label: 'Instagram', href: 'https://instagram.com/amiit_ai' },
  { label: 'YouTube', href: 'https://youtube.com/@amiit_ai' },
  { label: 'GitHub', href: 'https://github.com/amiitai' },
];

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column - Brand & Social */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Amiit.ai</h2>
            <p className="text-gray-500 text-sm mb-4">Created by Amit Kumar</p>
            <p className="text-gray-400 text-sm mb-6">
              Learning, building, and sharing in public.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Center Column - Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => {
                const isContact = link.label === 'Contact';
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (isContact) {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-contact-modal'));
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column - Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">
              Contact
            </h3>
            <a
              href="mailto:amitkumar32451@gmail.com"
              className="text-gray-400 hover:text-white text-sm"
            >
              amitkumar32451@gmail.com
            </a>
            <p className="text-gray-400 text-sm mt-3">@amiit_ai</p>
            <p className="text-gray-400 text-sm mt-3">Gurgaon, India</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Amit Kumar. Building with curiosity, powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
