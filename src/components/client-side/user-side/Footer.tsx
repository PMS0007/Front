"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { hotel, socials } from "@/data/hotelData";

type FooterProps = {
  onCallMeBack: () => void;
};

export default function Footer({ onCallMeBack }: FooterProps) {
  return (
    <footer id="contact" className="border-t border-sand bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">
            Find us
          </p>
          <h2 className="mt-3 font-display text-4xl">Havenwood Valley</h2>
          <ul className="mt-6 space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" />
              {hotel.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" />
              <a href={`tel:${hotel.phone.replace(/\s/g, "")}`}>{hotel.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" />
              <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-cream/70">{hotel.hours}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-cream/80 hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onCallMeBack}
              className="rounded-full bg-gold/90 px-3 py-1.5 text-xs text-forest"
            >
              Зателефонуйте мені
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="relative min-h-65 bg-[radial-gradient(circle_at_30%_40%,#8aa07a,transparent_35%),radial-gradient(circle_at_70%_70%,#c4a57433,transparent_32%),linear-gradient(160deg,#3d4f38,#2c3829)]">
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] " />
            <div className="absolute top-1/2 left-[42%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_10px_rgba(196,165,116,0.25)]" />
            <div className="absolute top-[18%] right-[12%] max-w-55 rounded-2xl border border-white/20 bg-cream/90 p-4 text-forest shadow-lg backdrop-blur-md">
              <p className="font-display text-xl">Havenwood Lodge</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Interactive map placeholder — pin marks the forest path above
                the valley.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Havenwood. All rights reserved.</p>
          <nav className="flex flex-wrap gap-4">
            <a href="#rooms">Rooms</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
            <a href="#booking">Book</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
