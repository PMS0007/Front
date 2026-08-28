import { Bell, LogOut } from "lucide-react";


export function DashboardTopbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-3.5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Sarah Johnson</p>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative text-muted-foreground" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-3 rounded-full bg-muted/70 py-1.5 pl-1.5 pr-4">
          <span className="flex size-8 items-center justify-center rounded-full bg-teal text-sm font-semibold text-teal-foreground">
            S
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium text-foreground">Sarah Johnson</span>
            <span className="block text-xs text-muted-foreground">receptionist@hotel.com</span>
          </span>
        </div>

        <button type="button" className="text-muted-foreground" aria-label="Sign out">
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}
