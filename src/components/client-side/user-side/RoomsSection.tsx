"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { roomFilters, rooms } from "@/data/hotelData";
import { cn } from "@/lib/cn";
import RoomCard from "./RoomCard";

type RoomsSectionProps = {
  onBookRoom: (roomId: string) => void;
};

export default function RoomsSection({ onBookRoom }: RoomsSectionProps) {
  const [filter, setFilter] = useState<(typeof roomFilters)[number]["id"]>(
    "all",
  );

  const visible =
    filter === "all" ? rooms : rooms.filter((room) => room.type === filter);

  return (
    <section id="rooms" className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-moss uppercase">
              Stay
            </p>
            <h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">
              Rooms & suites
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Four quiet rooms, one mood: linen, timber, and a view that asks
              you to linger.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Filter rooms"
            className="flex flex-wrap gap-2"
          >
            {roomFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  filter === item.id
                    ? "bg-forest text-cream"
                    : "bg-white/70 text-forest hover:bg-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((room) => (
              <RoomCard key={room.id} room={room} onBook={onBookRoom} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
