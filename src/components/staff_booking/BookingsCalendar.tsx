"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function BookingsCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const isToday = (day: number | null) =>
    day !== null &&
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();

  const goToPrevMonth = () =>
    setCursor(new Date(year, month - 1, 1));
  const goToNextMonth = () =>
    setCursor(new Date(year, month + 1, 1));
  const goToToday = () =>
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>


      <div className="grid grid-cols-7 border-t border-gray-200 bg-slate-50">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-3 py-2 text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-200">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 divide-x divide-gray-200">
            {week.map((day, dayIdx) => (
              <div key={dayIdx} className="h-24 p-2">
                {day !== null && (
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                      isToday(day)
                        ? "bg-blue-600 font-semibold text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}