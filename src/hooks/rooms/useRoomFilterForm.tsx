import { useState, useEffect } from "react";
import { IRoomFilter } from "@/interface/RoomInterface";
import RoomFilterService from "@/services/rooms/RoomFilterService";
import RoomService from "@/services/rooms/RoomService";

export interface ISelectOption {
  value: string;
  label: string;
}

const useRoomFilterForm = () => {
  const [rooms, setRooms] = useState<IRoomFilter[]>([]);
  const [statuses, setStatuses] = useState<ISelectOption[]>([]);
  const [types, setTypes] = useState<ISelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusesData, typesData] = await Promise.all([
          RoomFilterService.list_status(),
          RoomFilterService.list_room_type()
        ]);
        setStatuses(statusesData);
        setTypes(typesData);
      } catch (err) {
        console.error("Failed to load filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleRoomFilter = async (filters?: IRoomFilter) => {
    try {
      const data = await RoomFilterService.room_filter(filters);
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { rooms, statuses, types, loading, handleRoomFilter };
};

export default useRoomFilterForm;