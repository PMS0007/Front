import { IRoomFilter } from "@/interface/RoomInterface"
import { apiService } from "@/services/BaseApi"
import RoomFilterService from "@/services/rooms/RoomFilterService"
import { useState } from "react"


const useRoomStatusForm = () => {

    const [room_status, setRoomStatus] = useState<IRoomFilter[]>([])
    const handleRoomStatus = async () => {
        try {
            const res = await RoomFilterService.list_status()
            setRoomStatus(res.data)
        } catch (err) {
            console.error( err)
        }
    }
    return {room_status, setRoomStatus, handleRoomStatus}
}

export default useRoomStatusForm
