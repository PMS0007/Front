import { useState, useEffect } from "react";
import { IRoomFilter } from "@/interface/RoomInterface";
import RoomFilterService from "@/services/rooms/RoomFilterService";
import { RoomTypeService } from "@/services/rooms/RoomTypeService";

export interface ISelectOption {
  value: string;
  label: string;
  id?: string | number;
}

export interface IRoomTypeFull {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  base_price: string;
  amenities: { id: number; name: string; description?: string | null; icon?: string | null }[];
}

const useRoomFilterForm = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<ISelectOption[]>([]);
  const [types, setTypes] = useState<ISelectOption[]>([]);
  const [fullTypes, setFullTypes] = useState<IRoomTypeFull[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusesData, typesData, fullTypesData] = await Promise.all([
          RoomFilterService.list_status(),
          RoomFilterService.list_room_type(),
          RoomFilterService.list_room_type_full(),
        ]);
        setStatuses(statusesData);
        setTypes(typesData);
        setFullTypes(fullTypesData);
      } catch (err) {
        console.error("Failed to load filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const refetchRoomTypes = async () => {
    try {
      const [typesData, fullTypesData] = await Promise.all([
        RoomFilterService.list_room_type(),
        RoomFilterService.list_room_type_full(),
      ]);
      setTypes(typesData);
      setFullTypes(fullTypesData);
    } catch (err) {
      console.error("Failed to refetch room types:", err);
    }
  };

  const handleRoomFilter = async (filters?: IRoomFilter) => {
    try {
      const data = await RoomFilterService.room_filter(filters);
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRoomType = async (id: number, payload: Record<string, any>) => {
    try {
      const data = await RoomTypeService.update_room_type(id, payload);
      await refetchRoomTypes();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleDeleteRoomType = async (id: number) => {
    try {
      const ok = await RoomTypeService.destroy_room(id);
      if (ok) await refetchRoomTypes();
      return ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    rooms,
    statuses,
    types,
    fullTypes,
    loading,
    handleRoomFilter,
    handleUpdateRoomType,
    handleDeleteRoomType,
  };
};

export default useRoomFilterForm;