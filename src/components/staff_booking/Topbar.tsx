import { Bell } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle: string;
  userName?: string;
  userEmail?: string;
}

export default function Topbar({
  title,
  subtitle,
  userName = "Admin User",
  userEmail = "admin@hotel.com",
}: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-slate-400 hover:text-slate-600"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
            {userName.charAt(0)}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}