"use client";

import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  Coffee,
  Flame,
  Leaf,
  Mountain,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import {
  amenitiesCatalog,
  type Room,
  type RoomAmenity,
} from "@/data/hotelData";
import { formatMoney } from "@/lib/booking";

const amenityIcons: Record<RoomAmenity["icon"], LucideIcon> = {
  wifi: Wifi,
  bed: BedDouble,
  view: Mountain,
  pool: Waves,
  bath: Bath,
  fireplace: Flame,
  coffee: Coffee,
  leaf: Leaf,
};

type RoomCardProps = {
  room: Room;
  onBook: (roomId: string) => void;
};

export default function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-3xl border border-sand bg-white/70 shadow-[0_24px_50px_-32px_rgba(44,56,41,0.4)] backdrop-blur-md"
    >
      <div
        className="h-56 bg-cover bg-center sm:h-64"
        style={{ backgroundImage: `url(${room.image})` }}
        role="img"
        aria-label={room.title}
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-forest">{room.title}</h3>
            <p className="mt-1 text-sm text-muted">
              Up to {room.maxGuests} guests
            </p>
          </div>
          <p className="text-right">
            <span className="block font-display text-2xl text-forest">
              {formatMoney(room.price)}
            </span>
            <span className="text-xs text-muted">per night</span>
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{room.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {room.amenities.map((id) => {
            const amenity = amenitiesCatalog[id];
            const Icon = amenityIcons[amenity.icon];
            return (
              <li
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-fog px-3 py-1.5 text-xs text-forest"
              >
                <Icon className="h-3.5 w-3.5" />
                {amenity.label}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => onBook(room.id)}
          className="mt-6 w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss"
        >
          Book This Room
        </button>
      </div>
    </motion.article>
  );
}
