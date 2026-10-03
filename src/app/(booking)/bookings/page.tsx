import { CalendarDays, List, Plus } from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import BookingManagement from "@/components/staff_booking/BookingManagement";
export default function BookingsPage() {
  return (
    <>
      <Topbar/>
      <main className="flex-1 space-y-6 p-6">
        <BookingManagement/>

      </main>
    </>
  );
}