import { IRoomFilter } from "@/interface/RoomInterface"
import RoomFilterService from "@/services/rooms/RoomFilterService"
import RoomService from "@/services/rooms/RoomService"
import { useState } from "react"


const useRoomTypeForm = () => {
    const [room_type, setRoomType] = useState<IRoomFilter[]>([])
    const handleRoomType = async () => {
        try {
   
            const data = await RoomService.list_room_type() 
            setRoomType(data)
        } catch (err) {
            console.error( err)
        }
    }
    return {room_type, setRoomType, handleRoomType}
}

export default useRoomTypeForm
