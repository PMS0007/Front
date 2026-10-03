"use client";

import { useState } from "react";
import { CalendarDays, List, Plus } from "lucide-react";
import BookingsCalendar from "@/components/staff_booking/BookingsCalendar";
import { BookingStatCards } from "@/components/staff_booking/BookingStatCards";
import AddBookingModal from "./AddBookingModal";
import { BookingFormPayload } from "@/interface/BookingInterface";
import { useBookingForm } from "@/hooks/booking/useBookingForm";

export default function BookingManagement() {
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);

  const {handleCreateBookingByStaff} = useBookingForm()

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bookings & Reservations
          </h2>
          <p className="text-sm text-slate-500">
            Manage guest reservations and check-ins
          </p>
        </div>

        <div className="flex items-center gap-3">


          <button
            type="button"
            onClick={() => setIsAddBookingModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      <BookingStatCards />
      <BookingsCalendar />

      <AddBookingModal
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onSubmit={handleCreateBookingByStaff} 
      />
    </>
  );
}