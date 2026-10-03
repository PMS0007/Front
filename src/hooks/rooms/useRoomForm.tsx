'use client'
import { rooms } from '@/data/hotelData'
import { UpdateRoomPayload } from '@/interface/RoomInterface'
import { RoomService } from '@/services/rooms/RoomService'
import React, { useState } from 'react'
import { useEffect } from 'react'

const useRoomForm = <T = any>() => {
    const [data, setData] = useState<T | null>(null)
    const [distribution, setDistribution] = useState<T | null>(null)

    const [room_type, setRoomType] = useState<number | undefined>()
    const [room_number, setRoomNumber] = useState<number | undefined>()
    const [room, setRoom] = useState<any>(null)

    const [name, setName] = useState("")
    const [base_price, setBasePrice] = useState<number | undefined>()
    const [capacity, setCapacity] = useState<number | undefined>()
    const [amenity, setAmenity] = useState<T | null>(null)        
    const [amenityList, setAmenityList] = useState<any[]>([])     
    const [roomList, setRoomList] = useState<any[]>([])

    const [amenity_name, setAmenityName] = useState("")
    const [amenity_description, setAmenityDescription] = useState("")

    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);


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
            const res = await RoomService.createRoomType({
                name,
                base_price,
                capacity,
                amenities_id: selectedAmenities,
            });

            setRoomType(res.data);
            alert("ok");
            console.log("response:", res.data)
            setSelectedAmenities([]);
            handleRoomInfo();
            return true;
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
            const res = await RoomService.UpdateRoom(id, payload)
            setRoom(res)
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

    const handleDestroyRoom = async (id: number) => {
        try {
            await RoomService.DestroyRoom(id)
            await handleListRoom();
        } catch (err: any) {
            console.error(err?.response?.data ?? err);
        }
    };

    const handleListAmenity = async () => {
        try {
            const res = await RoomService.listAmenity()
            const list = res.data ?? res
            setAmenityList(list)
            return list
        }
        catch (err) {
            console.error(err)
            return []
        }
    }

    const handleCreateAmenity = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            const res = await RoomService.createAmenity({
                name: amenity_name,
                description: amenity_description
            });

            setAmenity(res.data);
            setAmenityName("");
            setAmenityDescription("");

            await handleListAmenity();

            return res.data;
        } catch (err: any) {
            console.error(err?.response?.data ?? err);
            return null;
        }
    }

    useEffect(() => {
        handleRoomInfo()
        handleRoomStatusDistribution()
        handleListRoom()
        handleListAmenity()
    }, [])

    return {
        data, refetch: handleRoomInfo, handleRoomStatusDistribution, distribution, handleCreateRoom, room, room_type,
        setRoomType,
        room_number,
        setRoomNumber,
        name, setName, base_price, setBasePrice, capacity, setCapacity, handleCreateRoomType,

        roomList, setRoomList, handleListRoom, handleUpdateRoom,
        handleDestroyRoom,
        handleCreateAmenity, amenity, setAmenity, amenity_name, amenity_description, setAmenityName, setAmenityDescription,
        amenityList, handleListAmenity,
        selectedAmenities,
        setSelectedAmenities,
    }
}

export default useRoomForm