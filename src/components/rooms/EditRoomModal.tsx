"use client";

import { useRef, useState, useEffect } from "react";
import { BedDouble, Wifi, Tv, Snowflake, Users, X } from "lucide-react";

export type RoomStatus = "available" | "occupied" | "cleaning";

export interface RoomFormData {
  id?: number;
  number: string;
  type: string; 
  status: RoomStatus;
  rate: number;
  occupancy: number;
  wifi: boolean;
  tv: boolean;
  ac: boolean;
}

interface RoomTypeOption {
  label: string;
  value: string;
}

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomFormData;
  types: RoomTypeOption[];
  onSave?: (updated: RoomFormData) => Promise<void> | void;
}

const STATUS_STYLES: Record<RoomStatus, string> = {
  available: "bg-emerald-50 text-emerald-700",
  occupied: "bg-rose-50 text-rose-700",
  cleaning: "bg-sky-50 text-sky-700",
};

export default function EditRoomModal({ isOpen, onClose, room, types, onSave }: EditRoomModalProps) {
  const numberRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const occupancyRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<RoomStatus>(room.status);
  const [type, setType] = useState(room.type);
  const [wifi, setWifi] = useState(room.wifi);
  const [tv, setTv] = useState(room.tv);
  const [ac, setAc] = useState(room.ac);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Оновлення внутрішнього стану при зміні об'єкта room або відкритті вікна
  useEffect(() => {
    if (isOpen) {
      setStatus(room.status);
      setType(room.type);
      setWifi(room.wifi);
      setTv(room.tv);
      setAc(room.ac);
      
      if (numberRef.current) numberRef.current.value = room.number;
      if (rateRef.current) rateRef.current.value = String(room.rate);
      if (occupancyRef.current) occupancyRef.current.value = String(room.occupancy);
    }
  }, [isOpen, room]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (onSave) {
        await onSave({
          id: room.id,
          number: numberRef.current?.value ?? room.number,
          type, 
          status,
          rate: Number(rateRef.current?.value ?? room.rate),
          occupancy: Number(occupancyRef.current?.value ?? room.occupancy),
          wifi,
          tv,
          ac,
        });
      }
      onClose();
    } catch (error) {
      console.error("Помилка збереження кімнати:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-107.5 max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Edit Room
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                <BedDouble size={20} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <input
                  ref={numberRef}
                  type="text"
                  defaultValue={room.number}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[15px] font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                >
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className={`shrink-0 cursor-pointer rounded-full border-none px-3 py-1.5 text-[11.5px] font-semibold outline-none ${STATUS_STYLES[status]}`}
            >
              <option value="available">available</option>
              <option value="occupied">occupied</option>
              <option value="cleaning">cleaning</option>
            </select>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Rate / Night
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>
                <input
                  ref={rateRef}
                  type="number"
                  min={0}
                  defaultValue={room.rate}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-6 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Users size={12} />
                Occupancy
              </label>
              <div className="relative">
                <input
                  ref={occupancyRef}
                  type="number"
                  min={1}
                  defaultValue={room.occupancy}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-3 pr-14 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  guests
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Amenities
            </label>
            <div className="flex gap-2">
              <ToggleButton active={wifi} onClick={() => setWifi(!wifi)} icon={<Wifi size={16} />} label="WiFi" />
              <ToggleButton active={tv} onClick={() => setTv(!tv)} icon={<Tv size={16} />} label="TV" />
              <ToggleButton active={ac} onClick={() => setAc(!ac)} icon={<Snowflake size={16} />} label="A/C" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg border-[1.5px] px-1.5 py-2.5 text-[10.5px] font-semibold transition-colors ${
        active ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}