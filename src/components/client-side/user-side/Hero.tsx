"use client";

import { motion } from "framer-motion";
import { CalendarDays, Search, Users } from "lucide-react";
import { rooms } from "@/data/hotelData";
import { isoDate, type BookingDraft } from "@/lib/booking";

type HeroProps = {
  draft: BookingDraft;
  onChange: (next: BookingDraft) => void;
  onSearch: () => void;
};

export default function Hero({ draft, onChange, onSearch }: HeroProps) {
  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=2400&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-forest/55 via-forest/25 to-cream" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-forest/40 to-transparent" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-8 pt-28 sm:px-6 lg:justify-center lg:pb-36 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl text-cream"
        >
          <p className="mb-4 text-sm tracking-[0.28em] uppercase text-cream/80">
            Boutique chill-zone hotel
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            Slow down.
            <br />
            Breathe. Stay.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-cream/85 sm:text-lg">
            Havenwood is a quiet lodge for unhurried days — forest air, warm
            timber, a mineral pool, and rooms that feel like an exhale.
          </p>
        </motion.div>

        <motion.form
          id="booking"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-10 rounded-3xl border border-white/50 bg-white/70 p-4 shadow-[0_30px_80px_-36px_rgba(44,56,41,0.55)] backdrop-blur-xl sm:p-5"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_0.8fr_1.2fr_auto]">
            <label className="block rounded-2xl bg-white/70 px-4 py-3">
              <span className="mb-1 flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
                <CalendarDays className="h-3.5 w-3.5" />
                Check-in
              </span>
              <input
                type="date"
                required
                value={draft.checkIn}
                min={isoDate(0)}
                onChange={(event) =>
                  onChange({ ...draft, checkIn: event.target.value })
                }
                className="w-full bg-transparent text-sm text-forest outline-none"
              />
            </label>
            <label className="block rounded-2xl bg-white/70 px-4 py-3">
              <span className="mb-1 flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
                <CalendarDays className="h-3.5 w-3.5" />
                Check-out
              </span>
              <input
                type="date"
                required
                value={draft.checkOut}
                min={draft.checkIn}
                onChange={(event) =>
                  onChange({ ...draft, checkOut: event.target.value })
                }
                className="w-full bg-transparent text-sm text-forest outline-none"
              />
            </label>
            <label className="block rounded-2xl bg-white/70 px-4 py-3">
              <span className="mb-1 flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
                <Users className="h-3.5 w-3.5" />
                Guests
              </span>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={draft.guests}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    guests: Number(event.target.value) || 1,
                  })
                }
                className="w-full bg-transparent text-sm text-forest outline-none"
              />
            </label>
            <label className="block rounded-2xl bg-white/70 px-4 py-3">
              <span className="mb-1 block text-xs tracking-wide text-muted uppercase">
                Room type
              </span>
              <select
                value={draft.roomId}
                onChange={(event) =>
                  onChange({ ...draft, roomId: event.target.value })
                }
                className="w-full bg-transparent text-sm text-forest outline-none"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-sm font-medium text-cream transition hover:bg-moss"
            >
              <Search className="h-4 w-4" />
              Search / Book
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
