"use client"
import { statCards } from "@/data/dashboard-data";
import useRoomForm from "@/hooks/rooms/useRoomForm";
import { ICONS, TONES } from "@/data/dashboard-data";
import { RoomStatusResponse, StatValues } from "@/interface/RoomInterface";


export default function StatCards() {
  const { data: roomInfo } = useRoomForm<RoomStatusResponse>();
const room = roomInfo?.rooms?.[0];

  const values: StatValues = {
    totalRooms: room?.total ?? 0,
    availableRooms: room?.available ?? 0,
    checkIns: roomInfo?.check_in ?? 0,
    cleaning: room?.cleaning ?? 0,
    occupiedRooms: room?.occupied ?? 0,
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statCards.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {values[card.key]}
                </p>
              </div>
              <div className={`rounded-full p-2 ${TONES[card.tone]}`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
}