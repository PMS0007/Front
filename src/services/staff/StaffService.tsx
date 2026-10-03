import { urls } from '@/constants/constants'
import { apiService } from '../BaseApi'
import { UserProfileData } from '@/interface/UserInterface'
import {
  CreateStaffPayload,
  DashboardStatus,
  StaffListItem,
} from '@/interface/StaffInterface'

export const StaffService = {
  getMe: async (): Promise<UserProfileData> => {
    const res = await apiService.get<UserProfileData>(urls.get_me)
    return res.data
  },

  listStaff: async (): Promise<StaffListItem[]> => {
    const res = await apiService.get<StaffListItem[] | { results: StaffListItem[] }>(
      urls.list_staff
    )
    const data = res.data
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as { results: StaffListItem[] }).results)) {
      return (data as { results: StaffListItem[] }).results
    }
    return []
  },

  searchStaff: async (fullName: string): Promise<StaffListItem[]> => {
    const res = await apiService.get<StaffListItem[] | { results: StaffListItem[] }>(
      urls.search_staff,
      { params: { full_name: fullName } }
    )
    const data = res.data
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as { results: StaffListItem[] }).results)) {
      return (data as { results: StaffListItem[] }).results
    }
    return []
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

  getDashboardStatus: async (): Promise<DashboardStatus> => {
    const res = await apiService.get<DashboardStatus>(urls.get_dashboard_status)
    return res.data
  },
}

export default StaffService
