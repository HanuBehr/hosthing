import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";
import type { Reservation } from "@/lib/validators/reservation";

type CatalogProperty = Property & {
  market: string;
  typeLabel: string;
};

export const propertyCatalog: CatalogProperty[] = [
  createProperty("SYD001", "Harbour Loft Sydney", "Apartment", "Harbour apartment", "The Rocks", "Sydney", "NSW", "2000", "Australia", "Hickson Road", "23", "Apt 1204", 2, 2, 4, "HarbourLoft_SYD", "harbour2026", "Olivia Carter", "+61412345678", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=82"),
  createProperty("BLI001", "Bali Beach Villa", "Villa", "Beach villa", "Canggu", "Badung", "Bali", "80351", "Indonesia", "Jalan Pantai Batu Bolong", "88", "Villa 4", 3, 3, 6, "BaliVilla_4", "canggu2026", "Made Pratama", "+6281234567890", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=82"),
  createProperty("NYG001", "Greenwich Village Condo", "Condo", "City condo", "Greenwich Village", "New York", "NY", "10014", "United States", "West 10th Street", "145", "Unit 5B", 1, 1, 2, "VillageCondo_5B", "washingtonsq", "Ethan Brooks", "+12125550136", "https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=1400&q=82", false, true),
  createProperty("MEL001", "Laneway Apartment Melbourne", "Apartment", "CBD apartment", "Melbourne CBD", "Melbourne", "VIC", "3000", "Australia", "Flinders Lane", "268", "Apt 804", 2, 1, 4, "Laneway_MEL804", "melbourne2026", "Charlotte Nguyen", "+61498765432", "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=82", false),
  createProperty("TYO001", "Shibuya Micro Studio", "Studio", "Micro studio", "Shibuya", "Tokyo", "Tokyo", "150-0042", "Japan", "Udagawacho", "12-9", "Room 603", 1, 1, 2, "Shibuya603", "tokyo603ai", "Aiko Tanaka", "+81355501984", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=82", false),
  createProperty("SFO001", "Mission District Townhouse", "Townhouse", "Townhouse", "Mission District", "San Francisco", "CA", "94110", "United States", "Valencia Street", "742", null, 3, 2, 6, "MissionHouse_SFO", "valencia742", "Maya Johnson", "+14155501921", "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=82", true, true),
  createProperty("RIO001", "Ipanema Ocean View Flat", "Apartment", "Ocean-view flat", "Ipanema", "Rio de Janeiro", "RJ", "22420-043", "Brazil", "Rua Prudente de Morais", "1415", "Apt 702", 2, 2, 4, "IpanemaView_702", "ipanema2026", "Lucas Almeida", "+5521999990101", "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=82"),
  createProperty("LIS001", "Alfama Terrace Apartment", "Apartment", "Terrace apartment", "Alfama", "Lisbon", "Lisbon", "1100-441", "Portugal", "Rua dos Remedios", "62", "3rd floor", 2, 1, 4, "AlfamaTerrace", "lisboa2026", "Sofia Martins", "+351912345678", "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=82"),
];

export const propertyCodes = propertyCatalog.map((property) => property.code);

export const reservationCatalog: Reservation[] = propertyCatalog.map((property, index) => ({
  id: `catalog-reservation-${property.code.toLowerCase()}`,
  propertyId: property.id,
  reservationCode: `RSV-${property.code}-${24000 + index * 731}`,
  guestName: ["Amelia Hart", "Noah Williams", "Grace Miller", "Liam Anderson", "Emma Clarke", "Daniel Kim", "Sophie Turner", "Oliver Scott"][index],
  checkInDate: new Date(Date.UTC(2026, 7 + (index % 4), 12 + index, 15)),
  checkOutDate: new Date(Date.UTC(2026, 7 + (index % 4), 16 + index, 11)),
  guestCount: Math.min(property.guestCapacity, Math.max(2, property.guestCapacity - 1)),
  cleaningFee: [145, 950000, 125, 120, 8500, 180, 280, 85][index],
  currency: ["AUD", "IDR", "USD", "AUD", "JPY", "USD", "BRL", "EUR"][index],
  status: "confirmed",
}));

export const guideCatalog: Record<string, ExperienceGuide> = Object.fromEntries(
  propertyCatalog.map((property) => [property.code, createGuide(property)]),
);

export function getCatalogPropertyByCode(code: string): Property | null {
  const property = propertyCatalog.find((item) => item.code === code.toUpperCase());
  return property ?? null;
}

export function getCatalogReservationForProperty(propertyId: string): Reservation | null {
  return reservationCatalog.find((item) => item.propertyId === propertyId) ?? null;
}

function createProperty(
  code: string,
  name: string,
  propertyType: string,
  typeLabel: string,
  neighborhood: string,
  city: string,
  state: string,
  postalCode: string,
  market: string,
  street: string,
  number: string,
  complement: string | null,
  bedrooms: number,
  bathrooms: number,
  capacity: number,
  wifiNetwork: string,
  wifiPassword: string,
  hostName: string,
  hostPhone: string,
  image: string,
  hasParking = true,
  allowPet = false,
): CatalogProperty {
  const accessCode = `${code.charCodeAt(0)}${code.charCodeAt(1)}`.slice(0, 4);

  return {
    id: `catalog-property-${code.toLowerCase()}`,
    code,
    name,
    propertyType,
    bedroomQuantity: bedrooms,
    bathroomQuantity: bathrooms,
    guestCapacity: capacity,
    address: { street, number, complement, neighborhood, city, state, postal_code: postalCode },
    operational: {
      wifi_network: wifiNetwork,
      wifi_password: wifiPassword,
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions: `Use the building entry instructions sent with the booking, then enter code ${accessCode} on the smart lock at the property door.`,
      property_password: accessCode,
      has_parking_spot: hasParking,
      parking_spot_identifier: hasParking ? "Reserved guest parking" : undefined,
      parking_spot_instructions: hasParking
        ? "Use the marked guest parking space and keep the dashboard pass visible."
        : "No dedicated parking is included. Use nearby paid parking or ride-share.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: allowPet,
      smoking_permitted: false,
      suitable_for_children: capacity > 2,
      suitable_for_babies: capacity > 3,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: propertyType !== "Villa" && propertyType !== "Townhouse",
      balcony: true,
      dishwasher: propertyType !== "Studio",
      pool: propertyType === "Villa",
    },
    images: [image],
    host: { name: hostName, phone: hostPhone },
    market,
    typeLabel,
  };
}

function createGuide(property: CatalogProperty): ExperienceGuide {
  return {
    welcome_message: `Welcome to ${property.name}. You are staying in ${property.address.neighborhood}, a practical base for arrival logistics, food, and local exploring in ${property.address.city}.`,
    restaurants: [
      { name: `Neighbourhood Kitchen ${property.address.neighborhood}`, distance: "Approx. 600 m", description: "Reliable local restaurant for an easy first dinner after check-in." },
      { name: `${property.address.city} Market Hall`, distance: "Approx. 1.2 km", description: "Casual food hall with several quick options and flexible hours." },
      { name: `Terrace Bar ${property.address.city}`, distance: "Approx. 1.5 km", description: "Good option for drinks, small plates, and a relaxed evening nearby." },
      { name: `Morning Cafe ${property.address.neighborhood}`, distance: "Approx. 450 m", description: "Convenient breakfast and coffee stop before heading out." },
    ],
    attractions: [
      { name: `${property.address.neighborhood} Walk`, distance: "Approx. 500 m", description: "A simple local walk to understand the immediate area around the stay." },
      { name: `${property.address.city} Viewpoint`, distance: "Approx. 2 km", description: "Good orientation point and photo stop for first-time visitors." },
      { name: `${property.address.city} Cultural Quarter`, distance: "Approx. 2.5 km", description: "Museums, shops, galleries, and local architecture in one compact area." },
    ],
    essentials: [
      { name: `${property.address.neighborhood} Pharmacy`, type: "pharmacy", distance: "Approx. 500 m", description: "Closest pharmacy for basic health and travel items." },
      { name: `${property.address.neighborhood} Grocery`, type: "supermarket", distance: "Approx. 700 m", description: "Convenient grocery stop for breakfast, snacks, and essentials." },
      { name: `${property.address.city} Medical Centre`, type: "hospital", distance: "Approx. 3 km", description: "Medical reference point for urgent care or same-day assistance." },
    ],
    seasonal_tips: `Check the forecast before heading out in ${property.address.city}; evenings can be cooler than expected, especially after a full travel day.`,
  };
}
