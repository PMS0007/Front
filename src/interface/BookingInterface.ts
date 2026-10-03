export interface BookingCounts {
  total: number;
  confirmed: number;
  check_in: number;
  check_out: number;
  cancelled: number;
}

export interface BookingInfoData {
  booking: BookingCounts;
}

export interface IBooking {
  id: number;
  room_type: number;
  room: number;
  status: string;
  user: number;
  check_in_date: string;
  check_out_date: string;
  cancellation_policy: string | null;
  total_price: string;
  guest_count: number;
  hold_expired_at: string | null;
  created_at: string;
  invoice_id: number | null;
}

export interface IBookingCreate {
  room_type: number;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  full_name: string; 
  email: string; 
  phone: string;
}




export interface BookingFormPayload {
  room_type: number;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  email: string;
  full_name: string;
  phone: string;
}
