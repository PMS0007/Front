
import RoomModal, { Field, Checkbox } from "./RoomModal";
import useRoomForm from "@/hooks/rooms/useRoomForm";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAmenityModal({ isOpen, onClose }: AddRoomModalProps) {
  const { 
    handleCreateAmenity, amenity_name,setAmenityName, amenity_description, setAmenityDescription} = useRoomForm();


  const onSubmit = async (e: React.FormEvent) => {

    const success = await handleCreateAmenity(e);
    if (success) {
      onClose();
    }
  };

  return (
    <RoomModal isOpen={isOpen} onClose={onClose} title="Add Room Amenity">
      <form onSubmit={onSubmit}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <input
              type="string"
              placeholder="input name"
              value={amenity_name ?? ""}
              onChange={(e) => setAmenityName(String(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>

          <Field label="Description" required>
            <input
              type="description"
              placeholder="description"
              value={amenity_description ?? ""}
              onChange={(e) => setAmenityDescription(String(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </Field>
        </div>


        <button 
          type="submit" 
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Amenity
        </button>
      </form>
    </RoomModal>
  );
}