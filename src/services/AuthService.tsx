import { apiService } from './BaseApi'
import { urls } from '@/constants/constants'

function setAuthCookies(access: string, isHotelStaff: boolean) {
    // HttpOnly would be better from backend; client cookies still block casual URL access via middleware
    document.cookie = `access_token=${access}; path=/; max-age=3600; SameSite=Lax`;
    document.cookie = `is_hotel_staff=${isHotelStaff ? "true" : "false"}; path=/; max-age=3600; SameSite=Lax`;
}

function clearAuthCookies() {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "is_hotel_staff=; path=/; max-age=0";
}

export const AuthService = {
    userLogin: async (data: any) => {
        const res = await apiService.post(urls.login, data)

        if (res.data.access) {
            localStorage.setItem('access', res.data.access);
            const isHotelStaff = Boolean(res.data.user?.is_hotel_staff);
            setAuthCookies(res.data.access, isHotelStaff);
        }
        if (res.data.refresh) {
            localStorage.setItem('refresh', res.data.refresh);
        }
        return res.data
    },

    userSignIn: async (data: { email: string, password: string }) => apiService.post(urls.signin, data),

    LogOut: async () => {
        const refresh = localStorage.getItem("refresh")
        const res = await apiService.post(urls.logout, { refresh });
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        clearAuthCookies();
        return res.data
    },
}

export default AuthService
