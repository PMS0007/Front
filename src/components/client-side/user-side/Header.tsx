"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, TreePine, X } from "lucide-react";
import { hotel } from "@/data/hotelData";
import { cn } from "@/lib/cn";

const links = [
  { href: "#rooms", label: "Rooms" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

type HeaderProps = {
  onCallMeBack: () => void;
  onBookNow: () => void;
};

export default function Header({ onCallMeBack, onBookNow }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/30 bg-cream/70 shadow-[0_10px_40px_-24px_rgba(44,56,41,0.45)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-forest">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-cream">
            <TreePine className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl tracking-tight">{hotel.name}</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-forest/80 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-forest"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={onCallMeBack}
            className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/50 px-4 py-2 text-sm text-forest backdrop-blur-md transition hover:border-forest/30 hover:bg-white/80"
          >
            <Phone className="h-4 w-4" />
            Call Me Back
          </button>
          <button
            type="button"
            onClick={onBookNow}
            className="rounded-full bg-forest px-5 py-2 text-sm text-cream shadow-sm transition hover:bg-moss"
          >
            Book Now
          </button>

          <button
            type="button"
            className="rounded-full bg-forest py-3 px-4 text-sm text-cream shadow-sm transition hover:bg-moss"
          >
            O
          </button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/40 text-forest backdrop-blur-md lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/40 bg-cream/90 px-4 py-6 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-4 text-lg text-forest">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onCallMeBack();
                }}
                className="rounded-full border border-forest/15 bg-white/70 px-4 py-3 text-forest"
              >
                Call Me Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onBookNow();
                }}
                className="rounded-full bg-forest px-4 py-3 text-cream"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
