import { Plus, CheckCircle2, Users, UtensilsCrossed, Clock } from "lucide-react";

const ACTIONS = [
  { label: "New Booking", icon: Plus, className: "bg-blue-600 hover:bg-blue-700" },
  { label: "Check-in", icon: CheckCircle2, className: "bg-teal-600 hover:bg-teal-700" },
  { label: "Room Management", icon: Users, className: "bg-amber-600 hover:bg-amber-700" },
  { label: "New Order", icon: UtensilsCrossed, className: "bg-emerald-600 hover:bg-emerald-700" },
];

export default function QuickActions({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} /> Last updated: {lastUpdated}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ACTIONS.map(({ label, icon: Icon, className }) => (
          <button
            key={label}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors ${className}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
