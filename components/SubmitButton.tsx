'use client';

import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  isLoading: boolean;
  isSuccess: boolean;
  disabled?: boolean;
}

export default function SubmitButton({
  label,
  loadingLabel = 'Sending...',
  successLabel = 'Message Sent!',
  isLoading,
  isSuccess,
  disabled = false,
}: SubmitButtonProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Spotlight gradient background
  const background = useMotionTemplate`
    radial-gradient(
      80px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 107, 53, 0.35),
      rgba(255, 107, 53, 0.05) 80%
    )
  `;

  return (
    <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 focus-within:from-[#ff6b35]/50 focus-within:to-[#ff6b35]/50">
      <motion.button
        type="submit"
        disabled={disabled || isLoading || isSuccess}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="group relative w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {/* Glow spotlight layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />

        {/* Content Wrapper */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#ff6b35]" />
              {loadingLabel}
            </>
          ) : isSuccess ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
              >
                <Check className="h-4 w-4 text-green-400" />
              </motion.div>
              {successLabel}
            </>
          ) : (
            <>
              {label}
              <ArrowRight className="h-4 w-4 text-white/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#ff6b35]" />
            </>
          )}
        </span>
      </motion.button>
    </div>
  );
}
