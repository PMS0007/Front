import { urls } from '@/constants/constants'
import { apiService } from '../BaseApi'
import { BookingInfoData, IBooking, IBookingCreate } from '@/interface/BookingInterface'

export type ClientCreateBookingPayload = {
  check_in_date: string
  check_out_date: string
  guest_count: number
  room_type: number
  room: number
}

export const BookingService = {
  get_booking_info: async (): Promise<BookingInfoData> => {
    const res = await apiService.get(urls.get_booking_information)
    return res.data
  },

  create_booking_by_staff: async (data: IBookingCreate) => {
    const res = await apiService.post(urls.create_booking_by_staff, data)
    return res
  },

  get_booking: async () => {
    const res = await apiService.get(urls.get_booking)
    return res
  },

  /**
   * Client booking — form-data fields:
   * check_in_date, check_out_date, guest_count, room_type, room
   */
  create_booking: async (payload: ClientCreateBookingPayload): Promise<IBooking> => {
    const form = new FormData()
    form.append('check_in_date', payload.check_in_date)
    form.append('check_out_date', payload.check_out_date)
    form.append('guest_count', String(payload.guest_count))
    form.append('room_type', String(payload.room_type))
    form.append('room', String(payload.room))

    const res = await apiService.post(urls.create_booking, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /** POST create_payment/{bookingId}/ */
  create_payment: async (bookingId: number, payMethod?: string) => {
    // pay_method is optional illusion on client; backend may ignore
    const body = payMethod ? { pay_method: payMethod } : undefined
    const res = await apiService.post(`${urls.create_payment}${bookingId}/`, body)
    return res.data
  },
}

export default BookingService
