
'use client'
import useRoomForm from "@/hooks/rooms/useRoomForm";
import useWeeklyOccupancy from "@/hooks/rooms/useWeeklyOccupacy";


type BarDatum = { label: string; value: number };


export function BarChart() {
  const { data } = useWeeklyOccupancy();


  const chartData = Array.isArray(data) ? data : [];

  const maxValue = Math.max(...chartData.map((d) => d.value), 0);
  const max = maxValue === 0 ? 1 : maxValue;

  if (chartData.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <div className="flex h-56 w-full items-end gap-3 px-1">

      {chartData.map((d) => {
        const heightPercent = (d.value / max) * 100;

        return (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              className="w-full rounded-t-md bg-blue-500 transition-all duration-300"
              style={{ height: `${heightPercent}%` }}
            />
            <span className="text-xs text-slate-400">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type PieDatum = { label: string; value: number; color: string };

function PieChart() {

  const { distribution } = useRoomForm()
  const percentages = distribution?.percent || distribution;

  const chartData: PieDatum[] = [
    { label: "Available", value: percentages?.available || 0, color: "#22c55e" },
    { label: "Booked", value: percentages?.booked || 0, color: "#DCED31" },
    { label: "Maintenance", value: percentages?.maintenance || 0, color: "#f59e0b" },
    { label: "Occupied", value: percentages?.occupied || 0, color: "#E90000" },
    { label: "Cleaning", value: percentages?.cleaning || 0, color: "#6B7AFF" }
  ];

  let cumulative = 0;
  const stops = chartData.map((d) => {
    const start = cumulative;
    cumulative += d.value;
    return `${d.color} ${start}% ${cumulative}%`;
  });


  return (
    <div className="flex items-center gap-8">
      <div
        className="h-40 w-40 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
      />
      <ul className="space-y-2 text-sm">
        {chartData.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600">
              {d.label} <span className="font-medium text-slate-900">{d.value}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}



export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

export { PieChart };