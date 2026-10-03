"use client";

import { useState } from "react";
import { Pencil, Trash2, Tag } from "lucide-react";
import EditRoomTypeModal, { RoomTypeFormData } from "./EditRoomTypeModal";

export interface RoomTypeSummary extends RoomTypeFormData {
  id: number;
  roomsCount: number;
}

interface RoomTypesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomTypeSummary[];
  onSave: (updated: RoomTypeFormData) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}

export default function RoomTypesPanel({
  isOpen,
  onClose,
  roomTypes,
  onSave,
  onDelete,
}: RoomTypesPanelProps) {
  const [editingType, setEditingType] = useState<RoomTypeFormData | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-4xl max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Room Types
            </span>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>

        <div className="overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Base Price</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Amenities</th>
                <th className="px-5 py-3">Rooms</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((rt) => (
                <tr key={rt.id} className="border-b border-slate-50 align-top hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-800">{rt.name}</div>
                    {rt.description && (
                      <div className="mt-0.5 max-w-52 truncate text-xs text-slate-400" title={rt.description}>
                        {rt.description}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600">${Number(rt.base_price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-600">{rt.capacity} guests</td>
                  <td className="px-5 py-3">
                    {rt.amenities && rt.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {rt.amenities.map((a) => (
                          <span
                            key={a.id}
                            className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{rt.roomsCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingType(rt)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Edit type"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(rt.id)}
                        disabled={rt.roomsCount > 0}
                        title={rt.roomsCount > 0 ? "Cannot delete: rooms use this type" : "Delete"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingType && (
        <EditRoomTypeModal
          isOpen={!!editingType}
          onClose={() => setEditingType(null)}
          roomType={editingType}
          onSave={async (updated) => {
            await onSave(updated);
            setEditingType(null);
          }}
        />
      )}
    </div>
  );
}