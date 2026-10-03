
import type { LucideIcon } from "lucide-react";

export type StatCardKey =
  | "totalBookings"
  | "confirmed"
  | "checkedIn"
  | "todaysCheckIns"
  | "todaysCheckOuts"
  | "totalRooms"
  | "available"
  | "occupied"
  | "maintenance";


export type StatValues = Partial<Record<StatCardKey, number>>;

export interface StatCardConfig {
  key: StatCardKey;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}



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