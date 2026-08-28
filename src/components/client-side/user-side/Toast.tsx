"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type ToastProps = {
  message: string | null;
  onDismiss: () => void;
};

export default function Toast({ message, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="fixed bottom-6 left-1/2 z-80 w-[min(92vw,420px)] -translate-x-1/2"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-forest/90 px-4 py-3 text-cream shadow-[0_20px_50px_-24px_rgba(44,56,41,0.7)] backdrop-blur-xl">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm leading-6">{message}</p>
            <button
              type="button"
              onClick={onDismiss}
              className="ml-auto text-xs tracking-wide text-cream/70 hover:text-cream"
            >
              Close
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
