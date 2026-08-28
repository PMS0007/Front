import React from 'react'
import { apiService } from '../BaseApi';
import { urls } from '@/constants/constants';
import { UpdateRoomPayload } from '@/interface/RoomInterface';

export const RoomService = {
    get_weekly_occupancy_rate: async () => {
        try {
            const res = await apiService.get(urls.get_weekly_occupancy_rate);
            return res.data;
        } catch (err) {
            
            throw err; 
        }
    },
    getAllRoomInformation: async () => {
        try {
            const res = await apiService.get(urls.get_all_room_info)
            return res.data
        } catch (error) {
            
            throw error
        }    
    },
    roomStatusDistribution : async() =>{
        try{
            const res = await apiService.get(urls.room_status_distribution)
            return res.data

        }
        catch(err){
            throw err
        }

    },
    createRoom : async (data: { room_type?: number, room_number?: number }) => apiService.post(urls.create_room, data),
    createRoomType : async (data: { name?: string, base_price?: number, capacity?: number }) => apiService.post(urls.create_room_type, data),
    listRoom : async () => {
        try {
            const res = await apiService.get(urls.list_room)
            return res.data
        } catch (error) {
            throw error
        }    
    },

    UpdateDestroyRoom : async(id:number, payload : UpdateRoomPayload) => {
        try{
            const res = await apiService.patch(`${urls.update_destroy_room}${id}/`, payload)
            return res.data

        }
        catch(err){
            throw err
        }
    }
    
    


};

export default RoomService  