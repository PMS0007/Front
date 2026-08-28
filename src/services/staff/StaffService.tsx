
import { urls } from '@/constants/constants'
import { apiService } from '../BaseApi';

export const StaffService = {
    getMe: async () => {
        try {
            const res = await apiService.get(urls.get_me);
            return res.data;
        } catch (err) {
            console.error( err);
            throw err; 
        }
    }
};

export default StaffService;