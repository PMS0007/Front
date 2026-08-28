"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/hotelData";
import { cn } from "@/lib/cn";

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs tracking-[0.28em] text-moss uppercase">FAQ</p>
          <h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">
            Before you arrive
          </h2>
          <p className="mt-4 max-w-md text-muted leading-7">
            Practical answers, written the way we speak at reception — short,
            calm, and useful.
          </p>
        </div>

        <div className="divide-y divide-sand overflow-hidden rounded-3xl border border-sand bg-white/60 backdrop-blur-md">
          {faqs.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${item.id}`}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-forest"
                  >
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-moss transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={`faq-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-muted">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
