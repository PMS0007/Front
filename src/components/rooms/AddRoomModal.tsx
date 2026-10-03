import { Save } from "lucide-react";
import RoomModal, { Field } from "./RoomModal";
import useRoomForm from "@/hooks/rooms/useRoomForm";
import useRoomFilterForm from "@/hooks/rooms/useRoomFilterForm";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoomModal({ isOpen, onClose, onSuccess }: AddRoomModalProps) {
  const { 
    room_number, 
    setRoomNumber, 
    room_type, 
    setRoomType, 
    handleCreateRoom ,
  } = useRoomForm();
  


  const { fullTypes, loading } = useRoomFilterForm();

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleCreateRoom(e);
    if (success) {
      await onSuccess(); 
      onClose();
    }
  };

  return (
    <RoomModal isOpen={isOpen} onClose={onClose} title="Add New Room">
      <form onSubmit={onSubmit}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Field label="Room Number" required>
            <input
              type="number"
              placeholder="e.g. 101"
              value={room_number ?? ""}
              onChange={(e) => setRoomNumber(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Field>

          <Field label="Room Type" required>
            <select
              value={room_type ?? ""}
              onChange={(e) => setRoomType(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                {loading ? "Loading types..." : "Select room type"}
              </option>
              {fullTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <button 
          type="submit" 
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Add Room
        </button>
      </form>
    </RoomModal>
  );
}