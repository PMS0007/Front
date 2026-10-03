export interface RoomStatus {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
}


export interface RoomStatusResponse {
  rooms: RoomStatus[];
  check_in: number;
}


export interface StatValues {
  totalRooms: number;
  availableRooms: number;
  checkIns: number;
  cleaning: number;
  occupiedRooms: number;
  maintenance: number;
}


export interface IRoomFilter {
  id: number;
  room_type: number;
  room_number: number;
  status: string;
  [key: string]: any;
}


export interface IStatusOption {
    value: string;
    label: string;
}

export interface IRoomType {
  id?: number;
  name?: string;
  description?: string | null;
  capacity?: number;
  base_price?: string;
  amenities ?: IAmenity[]
}

export interface IRoom {
  id?: number;
  room_type?: IRoomType;
  room_number?: number;
  status?: string;
}


export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  search: string;
  status: string;
  type: string;
  floor: string;
}
export interface RoomFiltersProps {
  filters: FilterState;
  statuses: FilterOption[];
  types: FilterOption[];
  loading?: boolean;
  onFilterChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface UpdateRoomPayload {
  room_number?: string;
  status?: string;
  room_type_name?: string;
}
export interface IAmenity {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
}



