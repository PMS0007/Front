import { Save } from "lucide-react";
import RoomModal, { Field, Checkbox } from "./RoomModal";
import useRoomForm from "@/hooks/rooms/useRoomForm";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRoomTypeModal({ isOpen, onClose }: AddRoomModalProps) {
  const { name, setName, base_price, setBasePrice, capacity, setCapacity, handleCreateRoomType
  } = useRoomForm();


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
              type="string"
              placeholder="e.g. 101"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>

          <Field label="base price" required>
            <input
              type="number"
              placeholder="base price"
              value={base_price ?? ""}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>


          <Field label="capacity" required>
            <input
              type="number"
              placeholder="capacity"
              value={capacity ?? ""}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>
        </div>

        <div className="mb-6">
          <div className="mb-3 text-sm font-medium text-gray-700">Amenities</div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <Checkbox label="WiFi" />
            <Checkbox label="TV" />
            <Checkbox label="AC" />
            <Checkbox label="Mini Bar" />
            <Checkbox label="Balcony" />
            <Checkbox label="Jacuzzi" />
            <Checkbox label="Kitchenette" />
            <Checkbox label="Safe" />
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