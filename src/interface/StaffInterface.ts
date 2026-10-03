export interface StaffProfileApi {
  id?: number;
  full_name?: string | null;
  phone?: string | null;
  active?: boolean;
  hired_at?: string | null;
  created_at?: string | null;
}

export interface StaffGroupApi {
  id?: number;
  name?: string;
}

export interface StaffListItem {
  id: number;
  email: string;
  is_active: boolean;
  staff_profile?: StaffProfileApi | null;
  groups?: StaffGroupApi[] | string[] | number[];
}

export interface CreateStaffPayload {
  email: string;
  staff_profile: {
    full_name: string;
    phone: string;
    active: boolean;
  };
}

export interface DashboardStatus {
  tasks: {
    total: number;
    new: number;
    in_progress: number;
    completed: number;
    canceled: number;
  };
  staff: {
    total: number;
    on_duty: number;
    off_duty: number;
    on_break: number;
  };
}
