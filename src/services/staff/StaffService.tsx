
import { urls } from '@/constants/constants'
import { apiService } from '../BaseApi';
import { UserProfileData } from '@/interface/UserInterface';

export const StaffService = {
    getMe: async ()  : Promise<UserProfileData>=> {
        try {
            const res = await apiService.get<UserProfileData>(urls.get_me);
            return res.data;
        } catch (err) {
            console.error( err);
            throw err; 
        }
    }
};

export default StaffService;