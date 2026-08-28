"use client";

import { motion } from "framer-motion";
import {
  Sofa,
  Sparkles,
  Sunrise,
  Trees,
  Waves,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { features, type Feature } from "@/data/hotelData";

const icons: Record<Feature["icon"], LucideIcon> = {
  sofa: Sofa,
  waves: Waves,
  sparkles: Sparkles,
  wine: Wine,
  trees: Trees,
  sunrise: Sunrise,
};

export default function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs tracking-[0.28em] text-moss uppercase">
            The chill zone
          </p>
          <h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">
            A slower kind of stay
          </h2>
          <p className="mt-4 text-muted leading-7">
            Havenwood is built around rest: warm wood, quiet corners, and
            enough nature that your phone starts to feel optional.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = icons[feature.icon];
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-3xl border border-sand bg-white/55 p-6 shadow-[0_20px_50px_-32px_rgba(44,56,41,0.35)] backdrop-blur-md"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-forest">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
