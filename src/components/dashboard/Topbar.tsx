import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { BedDouble } from "lucide-react";

export default function Topbar({ userName = "Sarah Johnson" }: { userName?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-400">Welcome back, {userName}</p>
      </div>

      <ProfileMenu />
    </header>
  );
}

export function WelcomeBanner({ hotelName = "Grand Hotel" }: { hotelName?: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-blue-600 to-teal-500 px-6 py-6 text-white">
      <div>
        <h2 className="text-xl font-semibold">Welcome to {hotelName}</h2>
        <p className="mt-1 text-sm text-white/80">Here&apos;s what&apos;s happening today</p>
      </div>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
        <BedDouble size={22} />
      </span>
    </div>
  );
}