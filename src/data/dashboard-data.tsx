import {
  DoorOpen,
  CheckCircle2,
  Users,
  BedDouble,
  AlertTriangle,
} from "lucide-react";

export type StatCardKey =
  | "totalRooms"
  | "availableRooms"
  | "checkIns"
  | "cleaning"
  | "occupiedRooms"
|"maintenance";



export type StatCard = {
  key: StatCardKey;
  label: string;
  hint: string;
  trend?: string;
  icon: "bed" | "check" | "users" | "food" | "door" | "alert" | "box" | "chart";
  tone: "blue" | "green" | "orange" | "red" | "";
};

export type ActivityItem = {
  title: string;
  meta: string;
  time: string;
  icon: "user" | "food" | "booking" | "checkout";
  tone: "blue" | "orange" | "green" | "red";
};

export const ICONS: Record<StatCard["icon"], React.ElementType> = {
  door: DoorOpen,
  check: CheckCircle2,
  users: Users,
  bed: BedDouble,
  alert: AlertTriangle,
};

export const TONES: Record<StatCard["tone"], string> = {
  blue: "bg-blue-600",
  green: "bg-emerald-500",
  orange: "bg-amber-500",
  red: "bg-red-500",
};

export const statCards: StatCard[] = [
  { key: "totalRooms", label: "Total Rooms", hint: "Hotel capacity", icon: "door", tone: "blue" },
  { key: "availableRooms", label: "Available Rooms", hint: "Currently free", icon: "check", tone: "green" },
  { key: "checkIns", label: "Today's Check-ins", hint: "Guests arriving", icon: "users", tone: "orange" },
  { key: "cleaning", label: "Needs Cleaning", hint: "Housekeeping tasks", icon: "alert", tone: "orange" },
  { key: "occupiedRooms", label: "Occupied Rooms", hint: "Currently in use", icon: "bed", tone: "red" },
  { key: "maintenance", label: "Maintenance", hint: "Under maintenance", icon: "alert", tone: "red" },
];



export const monthlyRevenue = [
  { label: "Jan", value: 12000 },
  { label: "Feb", value: 14500 },
  { label: "Mar", value: 18000 },
  { label: "Apr", value: 15500 },
  { label: "May", value: 19500 },
  { label: "Jun", value: 21500 },
];

export const roomStatus = [
  { key: "Available", label: "Available", color: "#3b82f6" },
  { key: "Occupied", label: "Occupied", color: "#22c55e" },
  { key: "Cleaning", label: "Cleaning", color: "#f59e0b" },
  { key: "Maintenance", label: "Maintenance", color: "#ef4444" },
];

export const recentActivity: ActivityItem[] = [
  { title: "John Smith checked in", meta: "Room 102", time: "2 hours ago", icon: "user", tone: "blue" },
  { title: "Room service order placed", meta: "Room 201", time: "3 hours ago", icon: "food", tone: "orange" },
  { title: "New reservation confirmed", meta: "Room 103", time: "4 hours ago", icon: "booking", tone: "blue" },
  { title: "Maria Garcia checked out", meta: "Room 105", time: "5 hours ago", icon: "checkout", tone: "red" },
];

export const navItems = [
  { label: "Dashboard", icon: "grid", href: "/" },
  { label: "Rooms", icon: "door", href: "/rooms" },
  { label: "Bookings", icon: "calendar", href: "/bookings", badge: 3 },
  { label: "Dining", icon: "food", href: "/dining", badge: 5 },
  { label: "Trip Packages", icon: "map", href: "/trip-packages" },
  { label: "Billing", icon: "file", href: "/billing" },
] as const;