
import StatCards from "@/components/dashboard/StatCards";
import { ChartCard, BarChart, PieChart } from "@/components/dashboard/Charts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { WelcomeBanner } from "@/components/dashboard/Topbar";

export default function DashboardPage() {
  return (
    <>
      <WelcomeBanner />

      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard title="Weekly Occupancy Rate">
                <BarChart />
              </ChartCard>
            </div>
            <RecentActivity />
          </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Room Status Distribution">
          <PieChart />
        </ChartCard>
        <ChartCard title="Monthly Revenue Trend">
          <BarChart />
        </ChartCard>
      </div>

      <QuickActions lastUpdated="3:42:52 PM" />
    </>
  );
}