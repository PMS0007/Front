import { apiService } from './BaseApi'
import { urls } from '@/constants/constants'

export const AuthService = {
    userLogin: async (data: any) => {
        const res = await apiService.post(urls.login, data)

        if (res.data.access) {
            localStorage.setItem('access', res.data.access);
            document.cookie = `access_token=${res.data.access}; path=/; max-age=3600; SameSite=Lax`;
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
        document.cookie = "access_token=; path=/; max-age=0";
        return res.data
    },
}

export default AuthService