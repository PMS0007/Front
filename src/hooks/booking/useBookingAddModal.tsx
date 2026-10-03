import { useState, useMemo, useEffect, useCallback } from "react";
import useRoomFilterForm from "@/hooks/rooms/useRoomFilterForm";
import { BookingFormPayload } from "@/interface/BookingInterface";
import RoomFilterService from "@/services/rooms/RoomFilterService";

const SERVICE_FEE = 12.5;
const DISCOUNT = 0;

interface UseAddBookingModalProps {
  onSubmit?: (payload: BookingFormPayload) => Promise<void> | void;
  onClose?: () => void;
}

export function useAddBookingModal({ onSubmit, onClose }: UseAddBookingModalProps = {}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+39");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState<number | "">("");
  const [rooms, setRooms] = useState(1);
  const [roomNo, setRoomNo] = useState("");

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fullTypes, loading: isTypesLoading } = useRoomFilterForm();

  const resetForm = useCallback(() => {
    setFullName("");
    setEmail("");
    setCountryCode("+39");
    setPhoneNumber("");
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setRoomType("");
    setRooms(1);
    setRoomNo("");
    setAvailableRooms([]);
  }, []);

  useEffect(() => {
    if (!roomType) {
      setAvailableRooms([]);
      setRoomNo("");
      return;
    }

    const fetchFilteredRooms = async () => {
      setIsRoomsLoading(true);
      try {
        const filteredData = await RoomFilterService.room_filter({
          room_type: roomType,
        });
        setAvailableRooms(filteredData || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setAvailableRooms([]);
      } finally {
        setIsRoomsLoading(false);
      }
    };

    setRoomNo("");
    fetchFilteredRooms();
  }, [roomType]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);


  const selectedRoomType = useMemo(() => {
    if (!roomType || !fullTypes) return null;
    return fullTypes.find((item: any) => item.id === Number(roomType));
  }, [roomType, fullTypes]);

  const pricePerNight = useMemo(() => {
    if (!selectedRoomType) return 0;
    return parseFloat(selectedRoomType.base_price || 0);
  }, [selectedRoomType]);

  const subTotal = useMemo(() => {
    const nightCount = nights || 1;
    const roomCount = rooms || 1;
    return pricePerNight * nightCount * roomCount;
  }, [pricePerNight, nights, rooms]);

  const total = subTotal + SERVICE_FEE - DISCOUNT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (roomType === "" || isSubmitting) return;

    const fullPhoneNumber = phoneNumber ? `${countryCode}${phoneNumber}` : "";

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          room_type: roomType,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          guest_count: adults + children,
          email,
          full_name: fullName,
          phone: fullPhoneNumber,
        });
      }

      resetForm();

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to submit booking:", err);
      setIsSubmitting(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults,
    setAdults,
    children,
    setChildren,
    roomType,
    setRoomType,
    rooms,
    setRooms,
    roomNo,
    setRoomNo,

    fullTypes,
    isTypesLoading,
    availableRooms,
    isRoomsLoading,
    isSubmitting,
    nights,
    pricePerNight,
    subTotal,
    serviceFee: SERVICE_FEE,
    discount: DISCOUNT,
    total,

    resetForm,
    handleSubmit,
  };
}