'use client'

import BookingService from '@/services/booking/BookingService'
import { useState, useEffect, useCallback } from 'react'
import { BookingInfoData, IBookingCreate } from '@/interface/BookingInterface'
export const useBookingForm = () => {
    const [data, setData] = useState<BookingInfoData | null>(null)
    const [booking, setBooking] = useState<any | null>(null)

    const handleGetBookingInfo = useCallback(async (): Promise<BookingInfoData | undefined> => {
        try {
            const res = await BookingService.get_booking_info()
            setData(res)
            return res
        } catch (err) {
            console.error('Failed to fetch booking info:', err)

        }
    }, [])

    const handleCreateBookingByStaff = async(data : IBookingCreate) => {
        try{
            const res = await BookingService.create_booking_by_staff(data)
            setBooking(res.data)

        }
        catch(err){
            console.log(err)
        }
    }
    const handleGetBooking = async() => {
        try{
            const res = await BookingService.get_booking()
            setBooking(res.data)
        }
        catch(err){
            console.log(err)
        }
    }


    useEffect(() => {
        handleGetBookingInfo()
    }, [])

    return { 
        data, 
        refetch: handleGetBookingInfo , booking, setBooking, handleCreateBookingByStaff, handleGetBooking
    }
}