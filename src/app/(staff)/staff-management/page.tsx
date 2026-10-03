import Topbar from "@/components/dashboard/Topbar";
import StaffManagement from "@/components/staff-management/StaffManagement";

export default function StaffPage() {
  return (
    <>
      <Topbar />
      <main className="flex-1 space-y-6 p-6">
        <StaffManagement />
      </main>
    </>
  );
}
