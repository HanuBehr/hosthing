import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.NEON_POSTGRES_PRISMA_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  "postgresql://user:password@localhost:5432/staypilot_ai";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const properties = [
  {
    code: "SYD001",
    name: "Harbour Loft Sydney",
    propertyType: "Apartment",
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    address: {
      street: "Hickson Road",
      number: "23",
      complement: "Apt 1204",
      neighborhood: "The Rocks",
      city: "Sydney",
      state: "NSW",
      postal_code: "2000",
    },
    operational: {
      wifi_network: "HarbourLoft_SYD",
      wifi_password: "harbour2026",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Enter through the lobby on Hickson Road and use code 4826 on the smart lock.",
      property_password: "4826",
      has_parking_spot: true,
      parking_spot_identifier: "Bay B12 - underground level 2",
      parking_spot_instructions:
        "Use the garage ramp beside the lobby and park only in bay B12.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Olivia Carter",
      phone: "+61412345678",
    },
  },
  {
    code: "BLI001",
    name: "Bali Beach Villa",
    propertyType: "Villa",
    bedroomQuantity: 3,
    bathroomQuantity: 3,
    guestCapacity: 6,
    address: {
      street: "Jalan Pantai Batu Bolong",
      number: "88",
      complement: "Villa 4",
      neighborhood: "Canggu",
      city: "Badung",
      state: "Bali",
      postal_code: "80351",
    },
    operational: {
      wifi_network: "BaliVilla_4",
      wifi_password: "canggu2026",
      is_self_checkin: false,
      property_access_type: "keybox",
      property_access_instructions:
        "The villa manager will meet you at the main gate. If delayed, use keybox code 7194 beside the wooden door.",
      property_password: "7194",
      has_parking_spot: true,
      parking_spot_identifier: "Private driveway",
      parking_spot_instructions:
        "Scooters and one car can park inside the villa driveway.",
    },
    rules: {
      check_in_time: "14:00",
      check_out_time: "11:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      pool: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Made Pratama",
      phone: "+6281234567890",
    },
  },
  {
    code: "NYG001",
    name: "Greenwich Village Condo",
    propertyType: "Condo",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    address: {
      street: "West 10th Street",
      number: "145",
      complement: "Unit 5B",
      neighborhood: "Greenwich Village",
      city: "New York",
      state: "NY",
      postal_code: "10014",
    },
    operational: {
      wifi_network: "VillageCondo_5B",
      wifi_password: "washingtonsq",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use code 5381 on the building keypad, then code 9042 on the apartment smart lock.",
      property_password: "9042",
      has_parking_spot: false,
      parking_spot_instructions:
        "No dedicated parking is included. Nearby garages are available around 7th Avenue and West 11th Street.",
    },
    rules: {
      check_in_time: "16:00",
      check_out_time: "10:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: false,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      dishwasher: true,
    },
    images: [
      "https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Ethan Brooks",
      phone: "+12125550136",
    },
  },
  {
    code: "MEL001",
    name: "Laneway Apartment Melbourne",
    propertyType: "Apartment",
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    address: {
      street: "Flinders Lane",
      number: "268",
      complement: "Apt 804",
      neighborhood: "Melbourne CBD",
      city: "Melbourne",
      state: "VIC",
      postal_code: "3000",
    },
    operational: {
      wifi_network: "Laneway_MEL804",
      wifi_password: "melbourne2026",
      is_self_checkin: true,
      property_access_type: "keybox",
      property_access_instructions:
        "Collect the fob from the black lockbox inside the mailroom. Code: 2638.",
      property_password: "2638",
      has_parking_spot: false,
      parking_spot_instructions:
        "No dedicated parking. Paid parking is available at Secure Parking on Flinders Lane.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      dishwasher: true,
    },
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Charlotte Nguyen",
      phone: "+61498765432",
    },
  },
  {
    code: "TYO001",
    name: "Shibuya Micro Studio",
    propertyType: "Studio",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    address: {
      street: "Udagawacho",
      number: "12-9",
      complement: "Room 603",
      neighborhood: "Shibuya",
      city: "Tokyo",
      state: "Tokyo",
      postal_code: "150-0042",
    },
    operational: {
      wifi_network: "Shibuya603",
      wifi_password: "tokyo603ai",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use the building entry panel code 6103, then the smart lock code 2884 on room 603.",
      property_password: "2884",
      has_parking_spot: false,
      parking_spot_instructions:
        "No parking is included. Shibuya Station is the recommended arrival point.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "10:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: false,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
    },
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Aiko Tanaka",
      phone: "+81355501984",
    },
  },
  {
    code: "SFO001",
    name: "Mission District Townhouse",
    propertyType: "Townhouse",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    address: {
      street: "Valencia Street",
      number: "742",
      complement: null,
      neighborhood: "Mission District",
      city: "San Francisco",
      state: "CA",
      postal_code: "94110",
    },
    operational: {
      wifi_network: "MissionHouse_SFO",
      wifi_password: "valencia742",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use code 6429 on the front gate and code 1186 on the main door smart lock.",
      property_password: "1186",
      has_parking_spot: true,
      parking_spot_identifier: "Garage space behind the townhouse",
      parking_spot_instructions:
        "Enter from the rear alley and park in the marked private garage space.",
    },
    rules: {
      check_in_time: "16:00",
      check_out_time: "11:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      washing_machine: true,
      dishwasher: true,
      bbq_grill: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Maya Johnson",
      phone: "+14155501921",
    },
  },
  {
    code: "RIO001",
    name: "Ipanema Ocean View Flat",
    propertyType: "Apartment",
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    address: {
      street: "Rua Prudente de Morais",
      number: "1415",
      complement: "Apt 702",
      neighborhood: "Ipanema",
      city: "Rio de Janeiro",
      state: "RJ",
      postal_code: "22420-043",
    },
    operational: {
      wifi_network: "IpanemaView_702",
      wifi_password: "ipanema2026",
      is_self_checkin: false,
      property_access_type: "keybox",
      property_access_instructions:
        "The doorman will confirm your name. The apartment key is in the lockbox near the service elevator. Code: 5541.",
      property_password: "5541",
      has_parking_spot: false,
      parking_spot_instructions:
        "No parking is included. Use ride-share or paid garages near General Osorio Square.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Lucas Almeida",
      phone: "+5521999990101",
    },
  },
  {
    code: "LIS001",
    name: "Alfama Terrace Apartment",
    propertyType: "Apartment",
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    address: {
      street: "Rua dos Remedios",
      number: "62",
      complement: "3rd floor",
      neighborhood: "Alfama",
      city: "Lisbon",
      state: "Lisbon",
      postal_code: "1100-441",
    },
    operational: {
      wifi_network: "AlfamaTerrace",
      wifi_password: "lisboa2026",
      is_self_checkin: true,
      property_access_type: "keybox",
      property_access_instructions:
        "The keybox is attached to the railing beside the blue door. Use code 3370 and return the key after opening.",
      property_password: "3370",
      has_parking_spot: false,
      parking_spot_instructions:
        "No parking is included. Alfama streets are narrow; taxis or public transport are recommended.",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: false,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=82",
    ],
    host: {
      name: "Sofia Martins",
      phone: "+351912345678",
    },
  },
];

async function main() {
  await prisma.experienceGuide.deleteMany();
  await prisma.property.deleteMany();

  for (const property of properties) {
    await prisma.property.create({ data: property });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
