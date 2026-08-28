"use client";

import {
  LogIn,
  LogOut,
  Eye,
  Sparkles,
  Pencil,
  Trash2,
  Wifi,
  Tv,
  Snowflake,
  BedDouble,
  Users,
} from "lucide-react";
import { IRoom } from "@/interface/RoomInterface";

interface RoomCardProps {
  room: IRoom;
  onEdit?: (room: IRoom) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    dot: string;
    accent: string;
    pill: string;
  }
> = {
  Available: {
    label: "Available",
    dot: "bg-emerald-500",
    accent: "bg-emerald-500",
    pill: "border-emerald-200 text-emerald-700 bg-emerald-50",
  },
  Occupied: {
    label: "Occupied",
    dot: "bg-rose-500",
    accent: "bg-rose-500",
    pill: "border-rose-200 text-rose-700 bg-rose-50",
  },
  Cleaning: {
    label: "Cleaning",
    dot: "bg-sky-500",
    accent: "bg-sky-500",
    pill: "border-sky-200 text-sky-700 bg-sky-50",
  },
};

const DEFAULT_CONFIG = {
  label: "Unknown",
  dot: "bg-slate-400",
  accent: "bg-slate-400",
  pill: "border-slate-200 text-slate-600 bg-slate-50",
};

export default function RoomCard({ room, onEdit, onDelete, onStatusChange }: RoomCardProps) {
  const { room_number, room_type, status } = room;
  const config = STATUS_CONFIG[status ?? ""] || {
    ...DEFAULT_CONFIG,
    label: status || "Unknown",
  };


  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className={`h-1 w-full ${config.accent}`} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <BedDouble className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm leading-tight">
                Room {room_number}
              </div>
              <div className="text-xs text-slate-400">{room_type?.name}</div>
            </div>
          </div>

          <span
            className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full border ${config.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100 mb-3">
          <div className="py-2 pr-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
              Rate / night
            </div>
            <div className="text-sm font-semibold text-slate-900">
              ${room_type?.base_price}
            </div>
          </div>
          <div className="py-2 pl-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Occupancy
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {room_type?.capacity} guests
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <AmenityIcon icon={<Wifi className="w-3.5 h-3.5" />} label="WiFi" />
          <AmenityIcon icon={<Tv className="w-3.5 h-3.5" />} label="TV" />
          <AmenityIcon icon={<Snowflake className="w-3.5 h-3.5" />} label="Air conditioning" />
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-1.5">
            {status === "available" && (
              <button
                onClick={() => onStatusChange?.(room?.id!, "Occupied")}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Check in
              </button>
            )}

            {status === "occupied" && (
              <button
                onClick={() => onStatusChange?.(room?.id!, "Available")}
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Check out
              </button>
            )}

            {status === "Reserved" && (
              <button className="flex items-center justify-center gap-1.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium py-2 rounded-lg transition-colors">
                <Eye className="w-3.5 h-3.5" /> View booking
              </button>
            )}

            {status === "Cleaning" && (
              <div className="flex items-center justify-center gap-1.5 border border-dashed border-sky-200 text-sky-500 text-xs font-medium py-2 rounded-lg">
                In progress
              </div>
            )}

            <button
              onClick={() => onStatusChange?.(room.id!, "Cleaning")}
              className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 text-slate-500 text-xs font-medium py-2 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Cleaning
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {status !== "Reserved" && (
              <button className="flex items-center justify-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-medium py-2 rounded-lg transition-colors">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            )}

            <button
              onClick={() => onEdit?.(room)}
              className={`flex items-center justify-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-medium py-2 rounded-lg transition-colors ${
                status === "Reserved" ? "col-span-2" : ""
              }`}
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>

            <button
              onClick={() => onDelete?.(room.id!)}
              className="flex items-center justify-center border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 py-2 rounded-lg transition-colors"
              aria-label="Delete room"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmenityIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      title={label}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-colors"
    >
      {icon}
    </span>
  );
}