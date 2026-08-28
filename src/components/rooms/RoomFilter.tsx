"use client";

import { Search, Filter } from "lucide-react";
import { FilterState, RoomFiltersProps } from "@/interface/RoomInterface";

export default function RoomFilters({
  filters,
  statuses,
  types,
  loading = false,
  onFilterChange,
  onReset,
}: RoomFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
        <Filter className="w-4 h-4" />
        Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

        <Field label="Search">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search ?? ""}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Room number..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </Field>

        <Field label="Status">
          <select
            value={filters.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Statuses</option>
            {statuses?.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>


        <Field label="Type">
          <select
            value={filters.type ?? ""}
            onChange={(e) => handleChange("type", e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Types</option>
            {types?.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}