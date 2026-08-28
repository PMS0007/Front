export type RoomAmenity = {
  id: string;
  label: string;
  icon:
    | "wifi"
    | "bed"
    | "view"
    | "pool"
    | "bath"
    | "fireplace"
    | "coffee"
    | "leaf";
};

export type Room = {
  id: string;
  title: string;
  description: string;
  price: number;
  maxGuests: number;
  image: string;
  type: "standard" | "suite" | "cabin";
  amenities: RoomAmenity["id"][];
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: "sofa" | "waves" | "sparkles" | "wine" | "trees" | "sunrise";
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export const hotel = {
  name: "Havenwood",
  tagline: "A boutique chill-zone in the forest",
  phone: "+380 67 412 88 10",
  email: "stay@havenwood.hotel",
  address: "12 Forest Path, Havenwood Valley, Carpathians",
  hours: "Reception 08:00 – 22:00",
} as const;

export const amenitiesCatalog: Record<RoomAmenity["id"], RoomAmenity> = {
  wifi: { id: "wifi", label: "High-speed Wi-Fi", icon: "wifi" },
  bed: { id: "bed", label: "King bed", icon: "bed" },
  view: { id: "view", label: "Forest view", icon: "view" },
  pool: { id: "pool", label: "Pool access", icon: "pool" },
  bath: { id: "bath", label: "Deep soaking tub", icon: "bath" },
  fireplace: { id: "fireplace", label: "Fireplace", icon: "fireplace" },
  coffee: { id: "coffee", label: "In-room coffee", icon: "coffee" },
  leaf: { id: "leaf", label: "Eco materials", icon: "leaf" },
};

export const features: Feature[] = [
  {
    id: "lounge",
    title: "Lounge Area",
    description:
      "Low lighting, vinyl, and deep sofas for slow afternoons with nowhere to be.",
    icon: "sofa",
  },
  {
    id: "pool",
    title: "Outdoor Pool",
    description:
      "A heated mineral pool framed by pines. Swim at dusk, then wrap in a linen robe.",
    icon: "waves",
  },
  {
    id: "spa",
    title: "Spa & Sauna",
    description:
      "Wood-fired sauna, herbal steam, and quiet treatment rooms for unhurried resets.",
    icon: "sparkles",
  },
  {
    id: "bar",
    title: "Craft Bar",
    description:
      "Seasonal infusions, local wines, and a short menu designed for sharing.",
    icon: "wine",
  },
  {
    id: "nature",
    title: "Eco Nature Surroundings",
    description:
      "Trails start at the garden gate. Birds, moss, and mist — no traffic in earshot.",
    icon: "trees",
  },
  {
    id: "breakfast",
    title: "Slow Morning Breakfast",
    description:
      "Farm eggs, sourdough, and mountain honey served until you actually wake up.",
    icon: "sunrise",
  },
];

export const rooms: Room[] = [
  {
    id: "chill-standard",
    title: "Standard Chill Room",
    description:
      "Soft linen, warm timber, and a quiet garden-facing window. The essential Havenwood stay.",
    price: 180,
    maxGuests: 2,
    type: "standard",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
    amenities: ["wifi", "bed", "coffee", "pool"],
  },
  {
    id: "panorama-suite",
    title: "Deluxe Panorama Suite",
    description:
      "Floor-to-ceiling forest views, a soaking tub, and space to linger with morning light.",
    price: 320,
    maxGuests: 3,
    type: "suite",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    amenities: ["wifi", "bed", "view", "bath", "pool"],
  },
  {
    id: "forest-cabin",
    title: "Forest Eco Cabin",
    description:
      "A standalone cabin among the pines. Fireplace, eco materials, and birdsong as the alarm.",
    price: 260,
    maxGuests: 4,
    type: "cabin",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1600&q=80",
    amenities: ["wifi", "fireplace", "leaf", "view", "coffee"],
  },
  {
    id: "garden-loft",
    title: "Garden Loft",
    description:
      "A light-filled loft above the herb garden — airy, private, and made for long breakfasts.",
    price: 210,
    maxGuests: 2,
    type: "standard",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    amenities: ["wifi", "bed", "view", "coffee", "pool"],
  },
];

export const faqs: FAQ[] = [
  {
    id: "checkin",
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is from 15:00, check-out by 11:00. Early arrival and late departure are often possible — message us and we will hold a quiet lounge seat if your room is not ready.",
  },
  {
    id: "pets",
    question: "Do you welcome pets?",
    answer:
      "Well-behaved dogs are welcome in Forest Eco Cabin and Garden Loft for a $35 stay fee. Please tell us in advance so we can prepare a water bowl and a blanket.",
  },
  {
    id: "parking",
    question: "Is parking available?",
    answer:
      "Yes — complimentary private parking is on site, a short walk from the lodge through the garden. EV charging is available on request.",
  },
  {
    id: "cancel",
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation up to 48 hours before arrival. Later cancellations are charged for the first night. We are flexible when weather closes the mountain roads — just call.",
  },
  {
    id: "breakfast",
    question: "Is breakfast included?",
    answer:
      "A slow breakfast is included with every stay: sourdough, farm eggs, seasonal fruit, and pour-over coffee. Served 08:00–11:00 in the lounge or as a quiet tray to your room.",
  },
  {
    id: "spa",
    question: "How do I book the spa and sauna?",
    answer:
      "The wood-fired sauna is open 16:00–21:00 for guests. Treatments can be reserved at reception or when you complete your booking. We recommend booking the same day you arrive.",
  },
];

export const roomFilters = [
  { id: "all", label: "All rooms" },
  { id: "standard", label: "Chill rooms" },
  { id: "suite", label: "Suites" },
  { id: "cabin", label: "Cabins" },
] as const;

export const socials = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "maps", label: "Maps", href: "https://maps.google.com" },
] as const;
