'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Coffee,
  ClipboardList,
  CheckCircle2,
  Mail,
  Phone,
  Pencil,
  Trash2,
  X,
  ListChecks,
  Filter,
  Loader2,
} from 'lucide-react';
import StaffService from '@/services/staff/StaffService';
import type { DashboardStatus, StaffListItem } from '@/interface/StaffInterface';

const AVATAR_COLORS = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  teal: 'bg-teal-100 text-teal-700',
  rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  cyan: 'bg-cyan-100 text-cyan-700',
} as const;

type AvatarColor = keyof typeof AVATAR_COLORS;

const COLOR_KEYS = Object.keys(AVATAR_COLORS) as AvatarColor[];

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFromId(id: number): AvatarColor {
  return COLOR_KEYS[Math.abs(id) % COLOR_KEYS.length];
}

function groupsLabel(groups?: StaffListItem['groups']): string {
  if (!groups || groups.length === 0) return 'No role';
  return groups
    .map((g) => {
      if (typeof g === 'string') return g;
      if (typeof g === 'number') return `Group #${g}`;
      return g.name || (g.id != null ? `Group #${g.id}` : 'Role');
    })
    .join(', ');
}

function displayName(item: StaffListItem): string {
  return item.staff_profile?.full_name?.trim() || item.email || `Staff #${item.id}`;
}

function StatCard({
  label,
  value,
  sublabel,
  icon,
  badgeClass,
}: {
  label: string;
  value: number;
  sublabel: string;
  icon: ReactNode;
  badgeClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${badgeClass}`}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-gray-500">{label}</span>
      {children}
    </label>
  );
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      const status = await StaffService.getDashboardStatus();
      setDashboard(status);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await StaffService.listStaff();
      setStaff(list);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Failed to load staff list.');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
    loadDashboard();
  }, [loadStaff, loadDashboard]);

  // Debounced search via API when query is non-empty
  useEffect(() => {
    const q = search.trim();
    if (q === '') {
      // restore full list when search cleared
      loadStaff();
      return;
    }

    const t = setTimeout(async () => {
      setSearching(true);
      setError('');
      try {
        const list = await StaffService.searchStaff(q);
        setStaff(list);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.detail || 'Search failed.');
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [search, loadStaff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (activeFilter === 'active') return s.is_active || s.staff_profile?.active;
      if (activeFilter === 'inactive') return !(s.is_active || s.staff_profile?.active);
      return true;
    });
  }, [staff, activeFilter]);

  const stats = {
    total: dashboard?.staff?.total ?? staff.length,
    onDuty: dashboard?.staff?.on_duty ?? 0,
    onBreak: dashboard?.staff?.on_break ?? 0,
    pending:
      (dashboard?.tasks?.new ?? 0) +
      (dashboard?.tasks?.in_progress ?? 0),
    completedToday: dashboard?.tasks?.completed ?? 0,
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('all');
  };

  const handleAddStaff = async (data: {
    email: string;
    full_name: string;
    phone: string;
    active: boolean;
    group_id?: number;
  }) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await StaffService.createStaff({
        email: data.email,
        staff_profile: {
          full_name: data.full_name,
          phone: data.phone,
          active: data.active,
        },
      });

      const newId =
        created?.id ??
        created?.user?.id ??
        created?.staff?.id ??
        null;

      if (data.group_id != null && data.group_id > 0 && newId != null) {
        try {
          await StaffService.createStaffRole(Number(newId), data.group_id);
        } catch (roleErr) {
          console.error('Role assign failed', roleErr);
        }
      }

      setAddStaffOpen(false);
      await loadStaff();
      await loadDashboard();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.email?.[0] ||
          'Failed to create staff.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage hotel employees, roles, and shifts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAddStaffOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Staff
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Staff"
          value={stats.total}
          sublabel="Active employees"
          icon={<Users className="h-5 w-5" />}
          badgeClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="On Duty"
          value={stats.onDuty}
          sublabel="Working right now"
          icon={<UserCheck className="h-5 w-5" />}
          badgeClass="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          label="On Break"
          value={stats.onBreak}
          sublabel="Currently on break"
          icon={<Coffee className="h-5 w-5" />}
          badgeClass="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Pending Tasks"
          value={stats.pending}
          sublabel="New + in progress"
          icon={<ClipboardList className="h-5 w-5" />}
          badgeClass="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Completed"
          value={stats.completedToday}
          sublabel="Tasks finished"
          icon={<CheckCircle2 className="h-5 w-5" />}
          badgeClass="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" /> Filters
          {(searching || loading) && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-sm text-gray-500">Search by name</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Olha"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm text-gray-500">Status</span>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className={inputClass}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {loading && staff.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading staff…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((member) => {
            const name = displayName(member);
            const phone = member.staff_profile?.phone || '—';
            const role = groupsLabel(member.groups);
            const active = Boolean(member.is_active || member.staff_profile?.active);
            const color = colorFromId(member.id);
            const initials = initialsFromName(name);
            const hired = member.staff_profile?.hired_at
              ? new Date(member.staff_profile.hired_at).toLocaleDateString()
              : member.staff_profile?.created_at
                ? new Date(member.staff_profile.created_at).toLocaleDateString()
                : '—';

            return (
              <div
                key={member.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${AVATAR_COLORS[color]}`}
                    >
                      {initials}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">{role}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      active
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    />
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>{phone}</span>
                  </div>
                  <p className="text-xs text-gray-400">Joined · {hired}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled
                    title="Edit API not provided yet"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    disabled
                    title="Delete API not provided yet"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStaff.length === 0 && !loading && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-400">
              No staff match the current filters.
            </div>
          )}
        </div>
      )}

      {addStaffOpen && (
        <AddStaffModal
          onClose={() => setAddStaffOpen(false)}
          onSubmit={handleAddStaff}
          submitting={submitting}
        />
      )}
    </div>
  );
}

function AddStaffModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    full_name: string;
    phone: string;
    active: boolean;
    group_id?: number;
  }) => void;
  submitting: boolean;
}) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(true);
  const [groupId, setGroupId] = useState('');

  return (
    <Modal title="Add Staff" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Full name">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@hotel.com"
            className={inputClass}
          />
        </Field>
        <Field label="Phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380..."
            className={inputClass}
          />
        </Field>
        <Field label="Role group id (optional)">
          <input
            type="number"
            min={1}
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-gray-300"
          />
          Active
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !email.trim() || !fullName.trim()}
            onClick={() =>
              onSubmit({
                email: email.trim(),
                full_name: fullName.trim(),
                phone: phone.trim(),
                active,
                group_id: groupId ? Number(groupId) : undefined,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Staff
          </button>
        </div>
      </div>
    </Modal>
  );
}
