"use client";

import { useRef, useState, useEffect } from "react";
import { BedDouble, Users, X } from "lucide-react";

export interface AmenityItem {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface RoomFormData {
  id?: number;
  number: string;
  type: string;
  status: string;
  rate: number;
  occupancy: number;
  amenities?: AmenityItem[];
}

export interface RoomTypeOption {
  label: string;
  value: string;
  base_price?: string;
  capacity?: number;
  amenities?: AmenityItem[];
}

interface SelectOption {
  label: string;
  value: string;
}

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomFormData;
  types: RoomTypeOption[];
  statuses: SelectOption[];
  onSave?: (updated: RoomFormData) => Promise<void> | void;
}

const DEFAULT_STATUS_STYLE = "bg-slate-100 text-slate-600";
const STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  occupied: "bg-rose-50 text-rose-700",
  cleaning: "bg-sky-50 text-sky-700",
};
const getStatusStyle = (status: string) => STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

export default function EditRoomModal({
  isOpen,
  onClose,
  room,
  types,
  statuses,
  onSave,
}: EditRoomModalProps) {
  const numberRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<string>(room.status);
  const [type, setType] = useState(room.type);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(room.status);
      setType(room.type);
      if (numberRef.current) numberRef.current.value = room.number;
    }
  }, [isOpen, room]);

  if (!isOpen) return null;

  const selectedType = types.find((t) => t.value === type);
  const effectiveRate = selectedType?.base_price !== undefined
    ? Number(selectedType.base_price)
    : room.rate;
  const effectiveOccupancy = selectedType?.capacity ?? room.occupancy;
  const effectiveAmenities = selectedType?.amenities ?? room.amenities ?? [];

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (onSave) {
        await onSave({
          id: room.id,
          number: numberRef.current?.value ?? room.number,
          type,
          status,
          rate: effectiveRate,
          occupancy: effectiveOccupancy,
          amenities: effectiveAmenities,
        });
      }
      onClose();
    } catch (error) {
      console.error("error", error);
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
              onChange={(e) => setStatus(e.target.value)}
              className={`shrink-0 cursor-pointer rounded-full border-none px-3 py-1.5 text-[11.5px] font-semibold outline-none ${getStatusStyle(status)}`}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Rate / Night
              </label>
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">
                ${effectiveRate.toFixed(2)}
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Users size={12} />
                Occupancy
              </label>
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">
                {effectiveOccupancy} guests
              </div>
            </div>
          </div>
          <p className="-mt-3 text-[11px] text-slate-400">
            Set by room type. Edit in Manage Room Types.
          </p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Amenities
            </label>
            {effectiveAmenities.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {effectiveAmenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                  >
                    {amenity.icon && (
                      <img src={amenity.icon} alt={amenity.name} width={16} height={16} />
                    )}
                    <span>{amenity.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Not found amenity</p>
            )}
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