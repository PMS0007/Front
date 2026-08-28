import ProfileMenu from "@/components/dashboard/ProfileMenu";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
        
      </div>

      
    </div>
  );
}