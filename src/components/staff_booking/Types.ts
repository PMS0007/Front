import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface BookingStat {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}