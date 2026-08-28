"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  DoorOpen,
  CalendarDays,
  UtensilsCrossed,
  Map,
  FileText,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { navItems } from "@/data/dashboard-data";

const ICONS: Record<string, React.ElementType> = {
  grid: LayoutGrid,
  door: DoorOpen,
  calendar: CalendarDays,
  food: UtensilsCrossed,
  map: Map,
  file: FileText,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <BedDouble size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Grand Hotel</p>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon, href }) => {
          const Icon = ICONS[icon];
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-blue-50 font-medium text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={17} />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            R
          </span>
          <div>
            <p className="text-xs font-medium text-slate-800">Receptionist</p>
            <p className="text-xs text-slate-400">Hotel Staff</p>
          </div>
        </div>
        <LogOut size={16} className="text-slate-400" />
      </div>
    </aside>
  );
}