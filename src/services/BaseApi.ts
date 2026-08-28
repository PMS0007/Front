import axios from "axios";
import { urls } from "@/constants/constants";


export const apiService = axios.create({
    baseURL: urls.BaseUrl,
    headers: {
        Accept: "application/json",
    },
});

apiService.interceptors.request.use((config) => {
    if (typeof window != "undefined") {
        const access = localStorage.getItem("access")
        if (access && config.headers) {
            config.headers.Authorization = `Bearer ${access}`;
        }
       
    }
     return config;


})




apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._refresh) {
      original._refresh = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        window.dispatchEvent(new Event("unauthorized"));
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${urls.BaseUrl}${urls.refresh}`, { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("token", newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiService(original);
      } catch (refreshErr) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);