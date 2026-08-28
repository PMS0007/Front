'use client'
import { rooms } from '@/data/hotelData'
import { UpdateRoomPayload } from '@/interface/RoomInterface'
import { RoomService } from '@/services/rooms/RoomService'
import { number } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useEffect } from 'react'

const useRoomForm = <T = any>() => {
    const [data, setData] = useState<T | null>(null)
    const [distribution, setDistribution] = useState<T | null>(null)

    const [room_type, setRoomType] = useState<number | undefined>()
    const [room_number, setRoomNumber] = useState<number | undefined>()
    const [room, SetRoom] = useState<any>(null)

    const [name, setName] = useState("")
    const [base_price, setBasePrice] = useState<number | undefined>()
    const [capacity, setCapacity] = useState<number | undefined>()

    const [roomList, setRoomList] = useState<any[]>([])



    const handleRoomInfo = async () => {
        try {
            const res = await RoomService.getAllRoomInformation()
            setData(res)
            return res

        }
        catch (err) {
            console.log(err)
        }


    }

    const handleRoomStatusDistribution = async () => {
        try {
            const res = await RoomService.roomStatusDistribution()
            setDistribution(res)
            return res

        }
        catch (err) {
            console.log(err)
        }
    }

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await RoomService.createRoom({ room_type, room_number })
            if (res.data?.id) {
                setRoomType(res.data.id);
            }

            console.log(res.data)
            setRoomNumber(undefined);
            setRoomType(undefined);
            handleRoomInfo()
            return true


        }
        catch (err: any) {
            console.log(err?.response?.data);
            return false
        }
    }

    const handleCreateRoomType = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await RoomService.createRoomType({ name, base_price, capacity })
            setRoomType(res.data)
            alert("ok")
            handleRoomInfo()
            return true

        }
        catch (err: any) {
            console.log(err?.response.data)
            return false
        }
    }

    const handleListRoom = async () => {
        try {
            const res = await RoomService.listRoom()
            setRoomList(res.data ?? res)
            return res
        }
        catch (err: any) {
            console.log(err?.response?.data ?? err)
            return null
        }
    }

    const handleUpdateRoom = async (id: number, payload: UpdateRoomPayload) => {
        try {
            const res = await RoomService.UpdateDestroyRoom(id, payload)
            SetRoom(res)
            await handleListRoom();
            await handleRoomInfo()
            console.log(res)
            return res

        }
        catch (err: any) {
            console.log(err?.response?.data ?? err)
            return null
        }
    }

    useEffect(() => {
        handleRoomInfo()
        handleRoomStatusDistribution()
        handleListRoom()

    }, [])

    return {
        data, refetch: handleRoomInfo, handleRoomStatusDistribution, distribution, handleCreateRoom, room, room_type,
        setRoomType,
        room_number,
        setRoomNumber,
        name, setName, base_price, setBasePrice, capacity, setCapacity, handleCreateRoomType,

        roomList, setRoomList, handleListRoom, handleUpdateRoom
    }
}

export default useRoomForm
