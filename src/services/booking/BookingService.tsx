import { tryLoadManifestWithRetries } from 'next/dist/server/load-components';
import { apiService } from '../BaseApi';
import { urls } from '@/constants/constants';

export const BookingService = {
    get_booking_info: async () => {
        try {
            const res = await apiService.get(urls.get_booking_information);
            return res.data;
        } catch (err) {           
            throw err; 
        }
    },
    create_booking_by_staff : async(data: { room_type?: number, check_in_date?: string, check_out_date?:string, guest_count : number, email : string, full_name : string, phone : string }) => apiService.post(urls.create_booking_by_staff, data),

    get_booking : async() => {
        try{
            const res = await apiService.get(urls.get_booking)
            return res.data
        }
        catch(err){
            throw err
        }
    }

};

export default BookingService  