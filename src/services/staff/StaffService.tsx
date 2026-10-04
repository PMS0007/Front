import { urls } from '@/constants/constants'
import { apiService } from '../BaseApi'
import { UserProfileData } from '@/interface/UserInterface'
import {
  CreateStaffPayload,
  DashboardStatus,
  StaffListItem,
  StaffSearchItem,
  UpdateStaffPayload,
} from '@/interface/StaffInterface'

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as T[]
    if (Array.isArray(obj.results)) return obj.results as T[]
  }
  return []
}

/** Map search_staff rows into list shape for the same UI cards */
export function mapSearchToListItem(item: StaffSearchItem, index: number): StaffListItem {
  return {
    id: -(index + 1),
    email: '',
    is_active: true,
    staff_profile: {
      full_name: item.full_name ?? null,
      phone: item.phone ?? null,
      hired_at: item.hired_at ?? null,
      active: true,
    },
    groups: [],
  }
}

export const StaffService = {
  getMe: async (): Promise<UserProfileData> => {
    const res = await apiService.get<UserProfileData>(urls.get_me)
    return res.data
  },

  listStaff: async (): Promise<StaffListItem[]> => {
    const res = await apiService.get(urls.list_staff)
    return unwrapList<StaffListItem>(res.data)
  },

  /**
   * GET search_staff/?full_name=
   * Backend returns: { data: [ { full_name, phone, hired_at }, ... ] }
   */
  searchStaff: async (fullName: string): Promise<StaffListItem[]> => {
    const res = await apiService.get(urls.search_staff, {
      params: { full_name: fullName },
    })
    const rows = unwrapList<StaffSearchItem>(res.data)
    return rows.map(mapSearchToListItem)
  },

  createStaff: async (payload: CreateStaffPayload) => {
    const res = await apiService.post(urls.create_staff, payload)
    return res.data
  },

  /** POST create_staff_role/{userId}/ with group_id */
  createStaffRole: async (userId: number, groupId: number) => {
    const res = await apiService.post(`${urls.create_staff_role}${userId}/`, {
      group_id: groupId,
    })
    return res.data
  },

  /** PATCH/PUT update_staff/{staff_profile_id}/ */
  updateStaff: async (staffProfileId: number, payload: UpdateStaffPayload) => {
    const res = await apiService.patch(
      `${urls.update_staff}${staffProfileId}/`,
      payload
    )
    return res.data
  },

  /** DELETE destroy_staff/{staff_profile_id}/ */
  destroyStaff: async (staffProfileId: number) => {
    const res = await apiService.delete(`${urls.destroy_staff}${staffProfileId}/`)
    return res.data
  },

  getDashboardStatus: async (): Promise<DashboardStatus> => {
    const res = await apiService.get<DashboardStatus>(urls.get_dashboard_status)
    return res.data
  },
}

export default StaffService
