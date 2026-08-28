import { UserRound, UtensilsCrossed, BookmarkCheck, UserX } from "lucide-react";

import { recentActivity, type ActivityItem } from  "@/data/dashboard-data";

const ICONS: Record<ActivityItem["icon"], React.ElementType> = {
  user: UserRound,
  food: UtensilsCrossed,
  booking: BookmarkCheck,
  checkout: UserX,
};

const TONES: Record<ActivityItem["tone"], string> = {
  blue: "text-blue-600 bg-blue-50",
  orange: "text-amber-600 bg-amber-50",
  green: "text-emerald-600 bg-emerald-50",
  red: "text-red-600 bg-red-50",
};

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Recent Activity</h3>
      <ul className="space-y-4">
        {recentActivity.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.title} className="flex items-start gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${TONES[item.tone]}`}>
                <Icon size={15} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-400">{item.meta}</p>
                <p className="text-xs text-slate-300">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
