import React from 'react'
import { apiService } from '../BaseApi'
import { urls } from '@/constants/constants'
import { IRoomType } from '@/interface/RoomInterface'

export const RoomTypeService = {
    update_room_type: async (id:number, payload : IRoomType) => {
        try {
            const res = await apiService.patch(`${urls.update_room_type}${id}/`, payload)
            return res.data

        }
        catch (err) {
            throw err
        }
    },

    destroy_room : async(id:number) => {
        try{
            const res = await apiService.delete(`${urls.destroy_room_type}${id}/`)
            return res.data

        }
        catch(err){
            throw err
        }
    }

}
