"use client";

import { useState, useMemo } from "react";
import useRoomForm from "@/hooks/rooms/useRoomForm";
import useRoomFilterForm from "@/hooks/rooms/useRoomFilterForm";
import { statCards, type StatCardKey, ICONS, TONES } from "@/data/dashboard-data";
import { Plus, Filter, DoorOpen, Tag } from "lucide-react";

import AddRoomModal from "./AddRoomModal";
import AddRoomTypeModal from "./AddRoomTypeModal";
import EditRoomModal, { RoomFormData, RoomTypeOption } from "./EditRoomModal";
import RoomTypesPanel, { RoomTypeSummary } from "./RoomTypesPanel";
import { RoomTypeFormData } from "./EditRoomTypeModal";
import RoomFilters from "./RoomFilter";
import { FilterState, IRoom } from "@/interface/RoomInterface";
import RoomCard from "./RoomCard";
import AddAmenityModal from "./AddAmenityModal";

const DEFAULT_FILTERS: FilterState = { search: "", status: "", type: "", floor: "" };

function mapRoomToFormData(room: IRoom): RoomFormData {
  const rawType = room.room_type;

  let typeId = "";
  if (typeof rawType === "object" && rawType !== null) {
    typeId = String(rawType.id ?? "");
  } else if (rawType !== undefined && rawType !== null) {
    typeId = String(rawType);
  }

  return {
    id: room.id,
    number: room.room_number?.toString() ?? "",
    type: typeId,
    status: room.status ?? "available",
    rate: typeof rawType === "object" ? Number(rawType?.base_price ?? 0) : 0,
    occupancy: typeof rawType === "object" ? (rawType?.capacity ?? 1) : 1,
    amenities: typeof rawType === "object" ? (rawType?.amenities ?? []) : [],
  };
}

export default function RoomManagement() {
  const { roomList, data: roomInfo, handleUpdateRoom, handleListRoom, handleDestroyRoom } = useRoomForm();
  const roomStats = roomInfo?.rooms?.[0];

  const {
    statuses,
    types,
    fullTypes,
    loading,
    handleRoomFilter,
    handleUpdateRoomType,
    handleDeleteRoomType,
  } = useRoomFilterForm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddRoomTypeModalOpen, setIsAddRoomTypeModalOpen] = useState(false);
  const [isRoomTypesPanelOpen, setIsRoomTypesPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [isAddAmenityModalOpen, setIsAddAmenityModalOpen] = useState(false);
  const { amenityList, handleListAmenity } = useRoomForm();

  const formattedTypes: RoomTypeOption[] = useMemo(() => {
    return fullTypes.map((t) => ({
      label: t.name,
      value: String(t.id),
      base_price: String(t.base_price ?? "0"),
      capacity: t.capacity ?? 1,
      amenities: t.amenities ?? [],
    }));
  }, [fullTypes]);

  const roomTypeSummaries: RoomTypeSummary[] = useMemo(() => {
    return fullTypes.map((t) => {
      const roomsCount = roomList.filter((r) => {
        const typeId = typeof r.room_type === "object" ? r.room_type?.id : r.room_type;
        return Number(typeId) === t.id;
      }).length;

      return {
        id: t.id,
        name: t.name,
        description: t.description ?? null,
        base_price: String(t.base_price ?? "0"),
        capacity: t.capacity ?? 1,
        amenities: t.amenities ?? [],
        roomsCount,
      };
    });
  }, [fullTypes, roomList]);

  const filteredRooms = useMemo(() => {
    return roomList.filter((item) => {
      const matchSearch = item.room_number.toString().includes(filters.search.toLowerCase());
      const matchStatus = filters.status ? item.status.toLowerCase() === filters.status.toLowerCase() : true;

      const typeName = typeof item.room_type === "object" ? item.room_type?.name : "";
      const matchType = filters.type
        ? typeName?.toLowerCase() === filters.type.toLowerCase() || String(item.room_type) === filters.type
        : true;

      return matchSearch && matchStatus && matchType;
    });
  }, [roomList, filters]);

  const handleSearch = () => {
    handleRoomFilter(filters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    handleRoomFilter(DEFAULT_FILTERS);
  };

  const handleSaveEdit = async (updatedForm: RoomFormData) => {
    if (!editingRoom?.id) return;

    let parsedTypeId = Number(updatedForm.type);
    if (isNaN(parsedTypeId) || parsedTypeId <= 0) {
      const currentTypeId =
        typeof editingRoom.room_type === "object"
          ? editingRoom.room_type?.id
          : Number(editingRoom.room_type);
      parsedTypeId = Number(currentTypeId) || 0;
    }


    const payload: Record<string, any> = {
      room_number: Number(updatedForm.number.replace(/\D/g, "")) || editingRoom.room_number,
      status: updatedForm.status.toLowerCase(),
    };

    if (parsedTypeId > 0) {
      payload.room_type = parsedTypeId;
    }

    const result = await handleUpdateRoom(editingRoom.id, payload);

    if (result) {
      setEditingRoom(null);
      await handleListRoom();
    }
  };

  const handleSaveRoomType = async (updated: RoomTypeFormData) => {
    if (!updated.id) return;
    const result = await handleUpdateRoomType(updated.id, {
      name: updated.name,
      description: updated.description,
      base_price: updated.base_price,
      capacity: updated.capacity,
    });
    if (result) {
      await handleListRoom(); 
    }
  };

  const handleDeleteRoomTypeClick = async (id: number) => {
    const result = await handleDeleteRoomType(id);
    if (result) {
      await handleListRoom();
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await handleUpdateRoom(id, {
      status: newStatus.toLowerCase(),
    });
    if (res) {
      await handleListRoom();
    }
  };

  const values: Record<StatCardKey, number> = {
    totalRooms: roomStats?.total ?? 0,
    availableRooms: roomStats?.available ?? 0,
    occupiedRooms: roomStats?.occupied ?? 0,
    cleaning: roomStats?.cleaning ?? 0,
    maintenance: roomStats?.maintenance ?? 0,
    checkIns: 0,
  };

  const roomStatCards = statCards.filter((card) => card.key !== "checkIns");

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
          <button
            onClick={() => setIsAddRoomTypeModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Room Type
          </button>
          
          <button
            onClick={() => setIsAddAmenityModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Amenity
          </button>
          <button
            onClick={() => setIsRoomTypesPanelOpen(true)}
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Manage Room Types
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-6">
        {roomStatCards.map((card, index) => {
          const Icon = ICONS[card.icon] || DoorOpen;
          return (
            <div key={`${card.key}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{values[card.key] ?? 0}</p>
                </div>
                <div className={`rounded-full p-2 ${TONES[card.tone] || "bg-gray-500"}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              {card.hint && <p className="mt-2 text-xs text-slate-400">{card.hint}</p>}
            </div>
          );
        })}
      </div>

      <RoomFilters
        filters={filters}
        statuses={statuses}
        types={types}
        loading={loading}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>
          Showing {filteredRooms.length} of {roomList.length} rooms
        </span>
        <span className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filtered by: {filters.status || "All statuses"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredRooms.map((roomItem) => (
          <RoomCard
            key={roomItem.id}
            room={roomItem}
            onEdit={setEditingRoom}
            onDelete={handleDestroyRoom}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <AddRoomModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleListRoom} />
      <AddRoomTypeModal
        allAmenities={amenityList}
        isOpen={isAddRoomTypeModalOpen}
        onClose={() => setIsAddRoomTypeModalOpen(false)}
      />
      <AddAmenityModal isOpen={isAddAmenityModalOpen} onClose={() => setIsAddAmenityModalOpen(false)} />

      {editingRoom && (
        <EditRoomModal
          isOpen={!!editingRoom}
          onClose={() => setEditingRoom(null)}
          room={mapRoomToFormData(editingRoom)}
          statuses={statuses}
          types={formattedTypes}
          onSave={handleSaveEdit}
        />
      )}

      <RoomTypesPanel
        isOpen={isRoomTypesPanelOpen}
        onClose={() => setIsRoomTypesPanelOpen(false)}
        roomTypes={roomTypeSummaries}
        onSave={handleSaveRoomType}
        onDelete={handleDeleteRoomTypeClick}
      />
    </div>
  );
}