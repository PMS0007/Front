import { Save } from "lucide-react";
import RoomModal, { Field, Checkbox } from "./RoomModal";
import useRoomForm from "@/hooks/rooms/useRoomForm";

export interface IAmenity {
  id: number;
  name: string;
  icon?: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAmenities: IAmenity[]; 
}

export default function AddRoomTypeModal({ isOpen, onClose, allAmenities }: AddRoomModalProps) {
  const {
    name,
    setName,
    base_price,
    setBasePrice,
    capacity,
    setCapacity,
    selectedAmenities,
    setSelectedAmenities,
    handleCreateRoomType,
  } = useRoomForm();
  

  const handleAmenityToggle = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleCreateRoomType(e);
    if (success) {
      onClose();
    }
  };

  return (
    <RoomModal isOpen={isOpen} onClose={onClose} title="Add New Room Type">
      <form onSubmit={onSubmit}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <input
              type="text"
              placeholder="e.g. Deluxe Suite"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>

          <Field label="Base Price" required>
            <input
              type="number"
              placeholder="Base Price"
              value={base_price ?? ""}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>

          <Field label="Capacity" required>
            <input
              type="number"
              placeholder="Capacity"
              value={capacity ?? ""}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>
        </div>

        <div className="mb-6">
          <div className="mb-3 text-sm font-medium text-gray-700">Amenities</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {allAmenities?.map((amenity) => (
              <Checkbox
                key={amenity.id}
                label={amenity.name}
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Room Type
        </button>
      </form>
    </RoomModal>
  );
}