import { urls } from "@/constants/constants"
import { apiService } from "../BaseApi"
import { IRoomFilter } from "@/interface/RoomInterface"



export const RoomFilterService = {
    room_filter : async(params?:IRoomFilter ) => {
        try{
            const res = await apiService.get(urls.room_filter, {params})
            return res.data

        }
        catch(err){
            throw err
        }
        
    },

    list_status : async() => {
        try{
            const res = await apiService.get(urls.list_status)
            return res.data

        }
        catch (err){
            throw err
        }
    },

    list_room_type: async () => {
    try {
        const res = await apiService.get(urls.list_room_type)
        return res.data.map((item: any) => ({
            value: item.name,      
            label: item.name,
        }))
    }
    catch (err) {
        throw err
    }
},

}

export default RoomFilterService
