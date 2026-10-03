'use client'
import { UserProfileData } from '@/interface/UserInterface'
import StaffService from '@/services/staff/StaffService'
import React, { useEffect, useState } from 'react'

const useProfileForm = () => {
    const [data, setData ] = useState<UserProfileData | null>(null)
    const handleData =async() => {
        try{
            const res = await StaffService.getMe()
            setData(res)
            console.log(res)
            return res
        }
        catch (err){
            console.log(err)
        }

    }

    useEffect(() => {
        handleData()
    }, [])
  return {data, handleData}
}

export default useProfileForm
