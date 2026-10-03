import Sidebar from "@/components/dashboard/Sidebar";
import { requireHotelStaff } from "@/lib/staff-auth";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireHotelStaff();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
