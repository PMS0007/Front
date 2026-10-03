'use client'
import { useBookingForm } from "@/hooks/booking/useBookingForm";
import { CalendarCheck, CheckCircle2, LogIn, LogOut, XCircle } from "lucide-react";

const bookingStatCards = [
  {
    key: "total",
    label: "Total Bookings",
    hint: "All bookings",
    icon: CalendarCheck,
    tone: "bg-blue-500",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    hint: "Confirmed bookings",
    icon: CheckCircle2,
    tone: "bg-green-500",
  },
  {
    key: "check_in",
    label: "Check-ins",
    hint: "Guests checked in",
    icon: LogIn,
    tone: "bg-indigo-500",
  },
  {
    key: "check_out",
    label: "Check-outs",
    hint: "Guests checked out",
    icon: LogOut,
    tone: "bg-yellow-500",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    hint: "Cancelled bookings",
    icon: XCircle,
    tone: "bg-red-500",
  },
] as const;

export function BookingStatCards() {
  const { data } = useBookingForm();
  const booking = data?.booking;

  const values: Record<string, number> = {
    total: booking?.total ?? 0,
    confirmed: booking?.confirmed ?? 0,
    check_in: booking?.check_in ?? 0,
    check_out: booking?.check_out ?? 0,
    cancelled: booking?.cancelled ?? 0,
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-6">
      {bookingStatCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {values[card.key]}
                </p>
              </div>
              <div className={`rounded-full p-2 ${card.tone}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
}