'use client'
import { useEffect, useState } from 'react'
import RoomService from '@/services/rooms/RoomService'

export type OccupancyDatum = {
  label: string
  value: number
}

export const useWeeklyOccupancy = () => {
  const [data, setData] = useState<OccupancyDatum[]>([])


  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await RoomService.get_weekly_occupancy_rate()
        setData(res || []) 
        console.log(res)
      } catch (err: any) {

        console.error(err)
      } 
    }

    fetchData()
  }, [])

  return { data }
}

export default useWeeklyOccupancy