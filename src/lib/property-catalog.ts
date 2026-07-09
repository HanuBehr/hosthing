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

const localGuides: Record<string, ExperienceGuide> = {
  SYD001: {
    welcome_message:
      "Welcome to Harbour Loft Sydney. From The Rocks you can walk to Circular Quay, Barangaroo, and the harbour foreshore without needing a car.",
    restaurants: [
      { name: "The Glenmore Rooftop", distance: "Approx. 450 m", description: "Casual pub meals and harbour views, useful for an easy first night after check-in." },
      { name: "Pony Dining The Rocks", distance: "Approx. 550 m", description: "Modern Australian grill with a lively courtyard and reliable dinner service." },
      { name: "MCA Cafe", distance: "Approx. 700 m", description: "Simple breakfast, coffee, and harbour views above Circular Quay." },
      { name: "Barangaroo House", distance: "Approx. 1.1 km", description: "Multi-level waterfront venue for drinks, small plates, or a longer dinner." },
    ],
    attractions: [
      { name: "Sydney Observatory Hill", distance: "Approx. 500 m", description: "Short uphill walk for sunset views over the harbour and bridge." },
      { name: "Circular Quay", distance: "Approx. 900 m", description: "Main ferry hub for Manly, Watsons Bay, and harbour sightseeing." },
      { name: "Barangaroo Reserve", distance: "Approx. 1 km", description: "Harbourfront walking paths, picnic lawns, and public art." },
    ],
    essentials: [
      { name: "Chemist Warehouse George Street", type: "pharmacy", distance: "Approx. 900 m", description: "Large pharmacy for toiletries, medication, and travel basics." },
      { name: "Coles Local Circular Quay", type: "supermarket", distance: "Approx. 1 km", description: "Convenient groceries, breakfast items, and snacks near the station." },
      { name: "Sydney Hospital", type: "hospital", distance: "Approx. 1.8 km", description: "Central medical reference point for urgent care directions." },
    ],
    seasonal_tips:
      "Harbour evenings can turn breezy even in warm months; bring a light layer if walking back from Circular Quay or Barangaroo.",
  },
  BLI001: {
    welcome_message:
      "Welcome to Bali Beach Villa. You are close to Batu Bolong, beach clubs, cafes, and Canggu's easiest surf breaks.",
    restaurants: [
      { name: "Crate Cafe", distance: "Approx. 850 m", description: "Busy breakfast spot for smoothie bowls, coffee, and quick brunch before the beach." },
      { name: "Mason Canggu", distance: "Approx. 1.1 km", description: "Polished dinner option with grilled dishes, cocktails, and a relaxed courtyard." },
      { name: "Warung Bu Mi", distance: "Approx. 1.2 km", description: "Casual local Indonesian plates when you want something fast and affordable." },
      { name: "The Lawn Canggu", distance: "Approx. 1.4 km", description: "Beachfront drinks and sunset seating near Batu Bolong Beach." },
    ],
    attractions: [
      { name: "Batu Bolong Beach", distance: "Approx. 1.2 km", description: "Surf, sunset, and the most practical beach access from the villa." },
      { name: "Love Anchor Market", distance: "Approx. 900 m", description: "Small market for beachwear, gifts, and easy browsing between meals." },
      { name: "Echo Beach", distance: "Approx. 2.4 km", description: "Popular surf beach with seafood grills and sunset views." },
    ],
    essentials: [
      { name: "Guardian Canggu", type: "pharmacy", distance: "Approx. 750 m", description: "Pharmacy chain for sunscreen, toiletries, and basic medication." },
      { name: "Pepito Market Canggu", type: "supermarket", distance: "Approx. 1.8 km", description: "Reliable supermarket for groceries, imported goods, and villa supplies." },
      { name: "BIMC Medical Centre Canggu", type: "hospital", distance: "Approx. 3.5 km", description: "International clinic option for urgent medical questions." },
    ],
    seasonal_tips:
      "During rainy season, book scooters or cars with extra time; short Canggu trips can take longer around sunset and after heavy rain.",
  },
  NYG001: {
    welcome_message:
      "Welcome to Greenwich Village Condo. West Village streets, Washington Square Park, cafes, subway lines, and small restaurants are all close by.",
    restaurants: [
      { name: "Buvette", distance: "Approx. 500 m", description: "Tiny French-style spot for brunch, coffee, and wine bar plates." },
      { name: "L'Artusi", distance: "Approx. 650 m", description: "Popular Italian dinner option; reserve ahead when possible." },
      { name: "Joe's Pizza Carmine Street", distance: "Approx. 550 m", description: "Classic New York slice when you want something quick nearby." },
      { name: "Daily Provisions West Village", distance: "Approx. 700 m", description: "Breakfast sandwiches, coffee, pastries, and easy takeout." },
    ],
    attractions: [
      { name: "Washington Square Park", distance: "Approx. 750 m", description: "Village landmark for people-watching, music, and a quick neighborhood walk." },
      { name: "Whitney Museum of American Art", distance: "Approx. 1.4 km", description: "Major museum near the High Line and Meatpacking District." },
      { name: "Hudson River Park", distance: "Approx. 1 km", description: "Waterfront paths for running, walking, and sunset views." },
    ],
    essentials: [
      { name: "CVS Pharmacy Bleecker Street", type: "pharmacy", distance: "Approx. 450 m", description: "Convenient pharmacy for toiletries, snacks, and travel basics." },
      { name: "Westside Market NYC", type: "supermarket", distance: "Approx. 500 m", description: "Good grocery stop for prepared foods, breakfast, and apartment supplies." },
      { name: "Lenox Health Greenwich Village", type: "hospital", distance: "Approx. 850 m", description: "Nearby emergency care reference in the Village." },
    ],
    seasonal_tips:
      "Village restaurants are compact and fill quickly; reserve dinner when you can or plan an earlier walk-in before 6:30 pm.",
  },
  MEL001: {
    welcome_message:
      "Welcome to Laneway Apartment Melbourne. Flinders Lane puts you near cafes, trams, theatres, Federation Square, and the Yarra riverfront.",
    restaurants: [
      { name: "Cumulus Inc.", distance: "Approx. 300 m", description: "All-day dining with strong breakfast, lunch, and dinner options on Flinders Lane." },
      { name: "Chin Chin", distance: "Approx. 450 m", description: "High-energy Thai-inspired restaurant; expect queues at peak times." },
      { name: "Dukes Coffee Roasters", distance: "Approx. 350 m", description: "Reliable specialty coffee and pastries before exploring the CBD." },
      { name: "Supernormal", distance: "Approx. 550 m", description: "Modern Asian dining with a polished city atmosphere." },
    ],
    attractions: [
      { name: "Federation Square", distance: "Approx. 500 m", description: "Central meeting point with galleries, events, and access to the river." },
      { name: "Hosier Lane", distance: "Approx. 350 m", description: "Street-art laneway and a quick photo stop near the apartment." },
      { name: "National Gallery of Victoria", distance: "Approx. 1.1 km", description: "Major gallery across the river with strong permanent and touring shows." },
    ],
    essentials: [
      { name: "Priceline Pharmacy Bourke Street", type: "pharmacy", distance: "Approx. 650 m", description: "Pharmacy for medication, toiletries, and travel supplies." },
      { name: "Woolworths Metro Flinders Street", type: "supermarket", distance: "Approx. 450 m", description: "Easy grocery run for snacks, drinks, and breakfast basics." },
      { name: "St Vincent's Hospital Melbourne", type: "hospital", distance: "Approx. 1.6 km", description: "Central hospital reference point for urgent care." },
    ],
    seasonal_tips:
      "Melbourne weather changes quickly; carry a compact umbrella even if the morning looks clear.",
  },
  TYO001: {
    welcome_message:
      "Welcome to Shibuya Micro Studio. The studio is compact, central, and close to Shibuya Station, department stores, nightlife, and late-night food.",
    restaurants: [
      { name: "Uobei Shibuya Dogenzaka", distance: "Approx. 450 m", description: "Fast conveyor-style sushi with English ordering screens and late hours." },
      { name: "Ichiran Shibuya", distance: "Approx. 650 m", description: "Solo-friendly ramen booths and consistent tonkotsu ramen." },
      { name: "Streamer Coffee Company Shibuya", distance: "Approx. 700 m", description: "Coffee and light breakfast before taking the train." },
      { name: "Shibuya Yokocho", distance: "Approx. 900 m", description: "Indoor alley of casual izakaya-style counters for a lively evening." },
    ],
    attractions: [
      { name: "Shibuya Scramble Crossing", distance: "Approx. 700 m", description: "Iconic crossing and easiest orientation point near the station." },
      { name: "Miyashita Park", distance: "Approx. 900 m", description: "Rooftop park, shops, and casual food above central Shibuya." },
      { name: "Yoyogi Park", distance: "Approx. 1.8 km", description: "Large green space for a quieter walk toward Harajuku." },
    ],
    essentials: [
      { name: "Matsumoto Kiyoshi Shibuya", type: "pharmacy", distance: "Approx. 550 m", description: "Drugstore for toiletries, medicine, and travel essentials." },
      { name: "Tokyu Store Shibuya", type: "supermarket", distance: "Approx. 700 m", description: "Convenient groceries, prepared meals, and drinks near the station." },
      { name: "Japanese Red Cross Medical Center", type: "hospital", distance: "Approx. 3.2 km", description: "Large hospital reference point for urgent medical care." },
    ],
    seasonal_tips:
      "Use coin lockers around Shibuya Station if you arrive before check-in; large suitcases are awkward in crowded trains and small cafes.",
  },
  SFO001: {
    welcome_message:
      "Welcome to Mission District Townhouse. Valencia Street gives you walkable food, coffee, murals, parks, and easy transit across San Francisco.",
    restaurants: [
      { name: "Tartine Bakery", distance: "Approx. 700 m", description: "Famous bakery for morning pastries, bread, and coffee; lines move steadily." },
      { name: "Foreign Cinema", distance: "Approx. 850 m", description: "Mission classic for dinner in a courtyard setting; reservations help." },
      { name: "La Taqueria", distance: "Approx. 900 m", description: "Well-known Mission burritos and tacos for a casual meal." },
      { name: "Ritual Coffee Roasters", distance: "Approx. 500 m", description: "Local coffee stop on Valencia for mornings or remote-work breaks." },
    ],
    attractions: [
      { name: "Clarion Alley Murals", distance: "Approx. 700 m", description: "Outdoor mural alley with rotating political and community artwork." },
      { name: "Dolores Park", distance: "Approx. 1.1 km", description: "Classic city park with skyline views and sunny afternoon energy." },
      { name: "Mission Dolores", distance: "Approx. 1.3 km", description: "Historic mission and nearby neighborhood landmark." },
    ],
    essentials: [
      { name: "Walgreens Mission Street", type: "pharmacy", distance: "Approx. 750 m", description: "Pharmacy for medication, toiletries, and quick supplies." },
      { name: "Bi-Rite Market", type: "supermarket", distance: "Approx. 1 km", description: "Quality groceries, prepared foods, wine, and picnic items." },
      { name: "CPMC Mission Bernal Campus", type: "hospital", distance: "Approx. 2.2 km", description: "Nearby hospital reference for urgent medical needs." },
    ],
    seasonal_tips:
      "San Francisco evenings cool down fast; bring a jacket even when Valencia Street feels warm during the day.",
  },
  RIO001: {
    welcome_message:
      "Welcome to Ipanema Ocean View Flat. You are close to Posto 9, Lagoa, beach kiosks, groceries, and classic Rio dining.",
    restaurants: [
      { name: "Zaza Bistro Tropical", distance: "Approx. 500 m", description: "Colorful Ipanema dinner spot with Brazilian and tropical influences." },
      { name: "Garota de Ipanema", distance: "Approx. 800 m", description: "Classic restaurant and bar tied to the famous song and beach neighborhood." },
      { name: "Emporio Jardim", distance: "Approx. 650 m", description: "Popular all-day breakfast and brunch option near the flat." },
      { name: "Quiteria Restaurante", distance: "Approx. 900 m", description: "Polished Brazilian dishes and cocktails near the beach." },
    ],
    attractions: [
      { name: "Ipanema Beach Posto 9", distance: "Approx. 450 m", description: "Main beach reference point for swimming, people-watching, and sunset." },
      { name: "Lagoa Rodrigo de Freitas", distance: "Approx. 1.2 km", description: "Lakeside path for walking, cycling, and skyline views." },
      { name: "Arpoador Rock", distance: "Approx. 1.7 km", description: "Best nearby sunset viewpoint between Ipanema and Copacabana." },
    ],
    essentials: [
      { name: "Drogaria Pacheco Ipanema", type: "pharmacy", distance: "Approx. 350 m", description: "Nearby pharmacy for sunscreen, medication, and toiletries." },
      { name: "Zona Sul Ipanema", type: "supermarket", distance: "Approx. 450 m", description: "Reliable supermarket for groceries, snacks, and beach supplies." },
      { name: "Hospital Copa D'Or", type: "hospital", distance: "Approx. 3.7 km", description: "Private hospital reference point for urgent care." },
    ],
    seasonal_tips:
      "Take only what you need to the beach, keep phones secure, and ask the host about current kiosk recommendations before heading out.",
  },
  LIS001: {
    welcome_message:
      "Welcome to Alfama Terrace Apartment. Expect steep lanes, viewpoints, fado houses, trams, and easy access to the riverfront.",
    restaurants: [
      { name: "Prado", distance: "Approx. 900 m", description: "Seasonal Portuguese cooking in a polished but relaxed setting." },
      { name: "O Velho Eurico", distance: "Approx. 700 m", description: "Small, lively Portuguese restaurant; book ahead when possible." },
      { name: "Copenhagen Coffee Lab Alfama", distance: "Approx. 450 m", description: "Coffee, pastries, and a simple breakfast before climbing the hills." },
      { name: "Clube de Fado", distance: "Approx. 550 m", description: "Traditional fado dinner experience close to the apartment." },
    ],
    attractions: [
      { name: "Miradouro de Santa Luzia", distance: "Approx. 400 m", description: "Classic tiled viewpoint over Alfama rooftops and the Tagus." },
      { name: "Sao Jorge Castle", distance: "Approx. 900 m", description: "Historic castle with city views; wear comfortable shoes for the climb." },
      { name: "Lisbon Cathedral", distance: "Approx. 650 m", description: "Historic cathedral and easy landmark on the way downtown." },
    ],
    essentials: [
      { name: "Farmacia Barral", type: "pharmacy", distance: "Approx. 700 m", description: "Central pharmacy for medication, toiletries, and travel basics." },
      { name: "Pingo Doce Chao do Loureiro", type: "supermarket", distance: "Approx. 850 m", description: "Practical supermarket for groceries and apartment supplies." },
      { name: "Hospital CUF Descobertas", type: "hospital", distance: "Approx. 5 km", description: "Private hospital reference for urgent medical assistance." },
    ],
    seasonal_tips:
      "Alfama streets are steep and cobbled; use comfortable shoes and consider rideshare for luggage on arrival or departure.",
  },
};

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
  const guide = localGuides[property.code];

  if (guide) {
    return guide;
  }

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
