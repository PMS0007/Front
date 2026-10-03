'use client';

import { useMemo, useState, type ReactNode } from 'react';
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
  LogOut,
  LogIn,
  Filter,
} from 'lucide-react';


type Department =
  | 'Housekeeping'
  | 'Front Desk'
  | 'Maintenance'
  | 'Food & Beverage'
  | 'Management'
  | 'Security';

type DutyStatus = 'on-duty' | 'off-duty' | 'on-break';
type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  status: DutyStatus;
  email: string;
  phone: string;
  shift: string;
  initials: string;
  color: keyof typeof AVATAR_COLORS;
}

interface Task {
  id: string;
  staffId: string;
  title: string;
  priority: Priority;
  dueTime: string;
  status: TaskStatus;
}



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

const STATUS_META: Record<DutyStatus, { label: string; dot: string; badge: string }> = {
  'on-duty': { label: 'On duty', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'on-break': { label: 'On break', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  'off-duty': { label: 'Off duty', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const PRIORITY_META: Record<Priority, { label: string; dot: string }> = {
  high: { label: 'High', dot: 'bg-red-500' },
  medium: { label: 'Medium', dot: 'bg-amber-500' },
  low: { label: 'Low', dot: 'bg-gray-400' },
};

const DEPARTMENTS: Department[] = [
  'Housekeeping',
  'Front Desk',
  'Maintenance',
  'Food & Beverage',
  'Management',
  'Security',
];


const initialStaff: StaffMember[] = [
  { id: 's1', name: 'Olena Petrenko', role: 'Head Housekeeper', department: 'Housekeeping', status: 'on-duty', email: 'olena.p@grandhotel.com', phone: '+380 67 123 4501', shift: 'Morning · 07:00–15:00', initials: 'OP', color: 'blue' },
  { id: 's2', name: 'Marco Ricci', role: 'Front Desk Agent', department: 'Front Desk', status: 'on-duty', email: 'marco.r@grandhotel.com', phone: '+380 67 123 4502', shift: 'Morning · 08:00–16:00', initials: 'MR', color: 'purple' },
  { id: 's3', name: 'Sofia Kravets', role: 'Housekeeper', department: 'Housekeeping', status: 'on-break', email: 'sofia.k@grandhotel.com', phone: '+380 67 123 4503', shift: 'Morning · 07:00–15:00', initials: 'SK', color: 'teal' },
  { id: 's4', name: 'Daniel Weiss', role: 'Maintenance Technician', department: 'Maintenance', status: 'off-duty', email: 'daniel.w@grandhotel.com', phone: '+380 67 123 4504', shift: 'Night · 22:00–06:00', initials: 'DW', color: 'rose' },
  { id: 's5', name: 'Anna Bilyk', role: 'Concierge', department: 'Front Desk', status: 'on-duty', email: 'anna.b@grandhotel.com', phone: '+380 67 123 4505', shift: 'Afternoon · 15:00–23:00', initials: 'AB', color: 'amber' },
  { id: 's6', name: 'Ivan Melnyk', role: 'Restaurant Manager', department: 'Food & Beverage', status: 'on-duty', email: 'ivan.m@grandhotel.com', phone: '+380 67 123 4506', shift: 'Morning · 09:00–17:00', initials: 'IM', color: 'indigo' },
  { id: 's7', name: 'Julia Tkachenko', role: 'General Manager', department: 'Management', status: 'on-duty', email: 'julia.t@grandhotel.com', phone: '+380 67 123 4507', shift: 'Full day · 09:00–18:00', initials: 'JT', color: 'emerald' },
  { id: 's8', name: 'Petro Sydorenko', role: 'Security Officer', department: 'Security', status: 'off-duty', email: 'petro.s@grandhotel.com', phone: '+380 67 123 4508', shift: 'Night · 23:00–07:00', initials: 'PS', color: 'cyan' },
];

const initialTasks: Task[] = [
  { id: 't1', staffId: 's1', title: 'Inspect rooms 30–45 after checkout', priority: 'high', dueTime: 'Today, 12:00', status: 'in-progress' },
  { id: 't2', staffId: 's1', title: 'Restock housekeeping cart 2', priority: 'low', dueTime: 'Today, 16:00', status: 'pending' },
  { id: 't3', staffId: 's3', title: 'Deep clean Room 56 before arrival', priority: 'high', dueTime: 'Today, 14:00', status: 'pending' },
  { id: 't4', staffId: 's4', title: 'Fix AC unit in Room 9', priority: 'medium', dueTime: 'Tomorrow, 09:00', status: 'pending' },
  { id: 't5', staffId: 's2', title: 'Prepare welcome folder for VIP guest', priority: 'medium', dueTime: 'Today, 11:00', status: 'completed' },
  { id: 't6', staffId: 's6', title: 'Confirm banquet setup for evening event', priority: 'high', dueTime: 'Today, 17:00', status: 'in-progress' },
];

let idCounter = 100;
const nextId = (prefix: string) => `${prefix}${idCounter++}`;

/* ------------------------------ Small pieces ------------------------------- */

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

function StatusBadge({ status }: { status: DutyStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
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
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

/* --------------------------------- Page ------------------------------------ */

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DutyStatus>('all');
  const [deptFilter, setDeptFilter] = useState<'all' | Department>('all');

  const [assignModalStaffId, setAssignModalStaffId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [addStaffOpen, setAddStaffOpen] = useState(false);

  const tasksByStaff = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const list = map.get(t.staffId) ?? [];
      list.push(t);
      map.set(t.staffId, list);
    }
    return map;
  }, [tasks]);

  const stats = useMemo(() => {
    const onDuty = staff.filter((s) => s.status === 'on-duty').length;
    const onBreak = staff.filter((s) => s.status === 'on-break').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    const completedToday = tasks.filter((t) => t.status === 'completed').length;
    return { total: staff.length, onDuty, onBreak, pending, completedToday };
  }, [staff, tasks]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        search.trim() === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesDept = deptFilter === 'all' || s.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [staff, search, statusFilter, deptFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDeptFilter('all');
  };

  const toggleDuty = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'off-duty' ? 'on-duty' : 'off-duty' }
          : s
      )
    );
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    setTasks((prev) => prev.filter((t) => t.staffId !== id));
  };

  const openAssignModal = (staffId: string) => {
    setAssignModalStaffId(staffId);
    setAssignModalOpen(true);
  };

  const handleAssignTask = (data: { staffId: string; title: string; priority: Priority; dueTime: string }) => {
    if (!data.staffId || !data.title.trim()) return;
    setTasks((prev) => [
      { id: nextId('t'), staffId: data.staffId, title: data.title.trim(), priority: data.priority, dueTime: data.dueTime || 'No due date', status: 'pending' },
      ...prev,
    ]);
    setAssignModalOpen(false);
    setAssignModalStaffId(null);
  };

  const handleAddStaff = (data: Omit<StaffMember, 'id' | 'initials' | 'color' | 'status'>) => {
    if (!data.name.trim()) return;
    const initials = data.name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    const colors = Object.keys(AVATAR_COLORS) as (keyof typeof AVATAR_COLORS)[];
    const color = colors[staff.length % colors.length];
    setStaff((prev) => [
      { ...data, id: nextId('s'), initials, color, status: 'off-duty' },
      ...prev,
    ]);
    setAddStaffOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">Assign tasks, track shifts and monitor team workload</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAddStaffOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Staff
          </button>
          <button
            onClick={() => {
              setAssignModalStaffId(staff[0]?.id ?? null);
              setAssignModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Assign Task
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage Departments
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Staff" value={stats.total} sublabel="Active employees" icon={<Users className="h-5 w-5" />} badgeClass="bg-blue-100 text-blue-600" />
        <StatCard label="On Duty" value={stats.onDuty} sublabel="Working right now" icon={<UserCheck className="h-5 w-5" />} badgeClass="bg-emerald-100 text-emerald-600" />
        <StatCard label="On Break" value={stats.onBreak} sublabel="Currently on break" icon={<Coffee className="h-5 w-5" />} badgeClass="bg-amber-100 text-amber-600" />
        <StatCard label="Pending Tasks" value={stats.pending} sublabel="Not yet completed" icon={<ClipboardList className="h-5 w-5" />} badgeClass="bg-orange-100 text-orange-600" />
        <StatCard label="Completed Today" value={stats.completedToday} sublabel="Tasks finished" icon={<CheckCircle2 className="h-5 w-5" />} badgeClass="bg-purple-100 text-purple-600" />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-sm text-gray-500">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or role..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm text-gray-500">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | DutyStatus)}
              className={inputClass}
            >
              <option value="all">All Statuses</option>
              <option value="on-duty">On duty</option>
              <option value="on-break">On break</option>
              <option value="off-duty">Off duty</option>
            </select>
          </div>
          <div>
            <span className="mb-1.5 block text-sm text-gray-500">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as 'all' | Department)}
              className={inputClass}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={clearFilters}
          className="mt-4 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
        >
          Clear Filters
        </button>
      </div>

      {/* Results row */}
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {filteredStaff.length} of {staff.length} staff
        </span>
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStaff.map((member) => {
          const memberTasks = tasksByStaff.get(member.id) ?? [];
          const completed = memberTasks.filter((t) => t.status === 'completed').length;
          const openTasks = memberTasks.filter((t) => t.status !== 'completed');

          return (
            <div key={member.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${AVATAR_COLORS[member.color]}`}>
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <StatusBadge status={member.status} />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[11px] text-gray-400">Tasks Assigned</p>
                  <p className="text-sm font-semibold text-gray-900">{memberTasks.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Completed</p>
                  <p className="text-sm font-semibold text-gray-900">{completed}</p>
                </div>
              </div>

              <div className="mb-4 space-y-1.5 border-b border-gray-100 pb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{member.phone}</span>
                </div>
                <div className="pt-0.5 text-gray-400">{member.shift}</div>
              </div>

              <div className="mb-4 flex-1">
                <p className="mb-2 text-[11px] text-gray-400">Current Tasks</p>
                {openTasks.length === 0 ? (
                  <p className="text-xs italic text-gray-400">No tasks assigned</p>
                ) : (
                  <ul className="space-y-1.5">
                    {openTasks.slice(0, 2).map((t) => (
                      <li key={t.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_META[t.priority].dot}`} />
                        <span className="truncate">{t.title}</span>
                      </li>
                    ))}
                    {openTasks.length > 2 && (
                      <li className="text-xs text-gray-400">+{openTasks.length - 2} more</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                {member.status === 'off-duty' ? (
                  <button
                    onClick={() => toggleDuty(member.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    <LogIn className="h-4 w-4" /> Start Shift
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDuty(member.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4" /> End Shift
                  </button>
                )}
                <button
                  onClick={() => openAssignModal(member.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ListChecks className="h-4 w-4" /> Assign Task
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredStaff.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-400">
            No staff match the current filters.
          </div>
        )}
      </div>

      {/* Assign Task modal */}
      {assignModalOpen && (
        <AssignTaskModal
          staff={staff}
          defaultStaffId={assignModalStaffId}
          onClose={() => setAssignModalOpen(false)}
          onSubmit={handleAssignTask}
        />
      )}


      {addStaffOpen && (
        <AddStaffModal onClose={() => setAddStaffOpen(false)} onSubmit={handleAddStaff} />
      )}
    </div>
  );
}



function AssignTaskModal({
  staff,
  defaultStaffId,
  onClose,
  onSubmit,
}: {
  staff: StaffMember[];
  defaultStaffId: string | null;
  onClose: () => void;
  onSubmit: (data: { staffId: string; title: string; priority: Priority; dueTime: string }) => void;
}) {
  const [staffId, setStaffId] = useState(defaultStaffId ?? staff[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueTime, setDueTime] = useState('');

  return (
    <Modal title="Assign Task" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Staff member">
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className={inputClass}>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.role}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Task">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clean rooms 12–18"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Due">
            <input
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              placeholder="Today, 16:00"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ staffId, title, priority, dueTime })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Assign Task
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------- Add Staff modal ----------------------------- */

function AddStaffModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<StaffMember, 'id' | 'initials' | 'color' | 'status'>) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Department>('Housekeeping');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState('');

  return (
    <Modal title="Add Staff" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
        </Field>
        <Field label="Role">
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Housekeeper" className={inputClass} />
        </Field>
        <Field label="Department">
          <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} className={inputClass}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@hotel.com" className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 ..." className={inputClass} />
          </Field>
        </div>
        <Field label="Shift">
          <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Morning · 08:00–16:00" className={inputClass} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ name, role, department, email, phone, shift })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Staff
          </button>
        </div>
      </div>
    </Modal>
  );
}