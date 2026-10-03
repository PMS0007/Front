import { CalendarDays, List, Plus } from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import BookingsCalendar from "@/components/staff_booking/BookingsCalendar";
import { BookingStatCards } from "@/components/staff_booking/BookingStatCards";
import BookingManagement from "@/components/staff_booking/BookingManagement";
import StaffManagementPage from "@/components/staff-management/StaffManagement";
import StaffManagement from "@/components/staff-management/StaffManagement";
export default function StaffPage() {
  return (
    <>
      <Topbar/>

      <main className="flex-1 space-y-6 p-6">
        <StaffManagement/>

      </main>
    </>
  );
}