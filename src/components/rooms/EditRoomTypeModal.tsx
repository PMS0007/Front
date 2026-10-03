"use client";

import { useRef, useState, useEffect } from "react";
import { Tag, Users, X } from "lucide-react";

export interface AmenityItem {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface RoomTypeFormData {
  id?: number;
  name: string;
  description?: string | null;
  base_price: string; // бекенд повертає рядок ("200.00") — не приводимо до number без потреби
  capacity: number;
  amenities?: AmenityItem[];
}

interface EditRoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType: RoomTypeFormData;
  onSave?: (updated: RoomTypeFormData) => Promise<void> | void;
}

export default function EditRoomTypeModal({ isOpen, onClose, roomType, onSave }: EditRoomTypeModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (nameRef.current) nameRef.current.value = roomType.name;
      if (descriptionRef.current) descriptionRef.current.value = roomType.description ?? "";
      if (priceRef.current) priceRef.current.value = roomType.base_price;
      if (capacityRef.current) capacityRef.current.value = String(roomType.capacity);
    }
  }, [isOpen, roomType]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (onSave) {
        await onSave({
          id: roomType.id,
          name: nameRef.current?.value ?? roomType.name,
          description: descriptionRef.current?.value || null,
          base_price: priceRef.current?.value ?? roomType.base_price,
          capacity: Number(capacityRef.current?.value ?? roomType.capacity),
          amenities: roomType.amenities,
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
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Edit Room Type
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
              <Tag size={18} />
            </div>
            <input
              ref={nameRef}
              type="text"
              defaultValue={roomType.name}
              placeholder="Type name"
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[15px] font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Description
            </label>
            <textarea
              ref={descriptionRef}
              defaultValue={roomType.description ?? ""}
              placeholder="Optional description"
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Base Rate / Night
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>
                <input
                  ref={priceRef}
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={roomType.base_price}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-6 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Users size={12} />
                Capacity
              </label>
              <input
                ref={capacityRef}
                type="number"
                min={1}
                defaultValue={roomType.capacity}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Changing these values updates every room of this type.
          </p>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}