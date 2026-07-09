import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";

export const propertyFixture: Property = {
  id: "property-syd001",
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
  },
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=82",
  ],
  host: {
    name: "Olivia Carter",
    phone: "+61412345678",
  },
};

export const experienceGuideFixture: ExperienceGuide = {
  welcome_message:
    "Your loft is positioned by Sydney Harbour, with easy access to The Rocks, Circular Quay, and waterfront dining.",
  restaurants: [
    {
      name: "Quay Restaurant",
      distance: "Approx. 900 m",
      description: "Fine dining near Circular Quay with views across the harbour.",
    },
    {
      name: "The Glenmore Hotel",
      distance: "Approx. 450 m",
      description: "Classic rooftop pub in The Rocks for casual meals and drinks.",
    },
    {
      name: "Sake Restaurant & Bar",
      distance: "Approx. 550 m",
      description: "Modern Japanese restaurant in The Rocks precinct.",
    },
    {
      name: "Pancakes On The Rocks",
      distance: "Approx. 500 m",
      description: "Long-running casual spot for breakfast and late-night comfort food.",
    },
  ],
  attractions: [
    {
      name: "Sydney Opera House",
      distance: "Approx. 1.3 km",
      description: "Iconic performing arts venue and harbour landmark.",
    },
    {
      name: "Museum of Contemporary Art Australia",
      distance: "Approx. 650 m",
      description: "Major contemporary art museum beside Circular Quay.",
    },
    {
      name: "Sydney Harbour Bridge",
      distance: "Approx. 700 m",
      description: "Landmark bridge with scenic walking access from The Rocks.",
    },
  ],
  essentials: [
    {
      name: "Coles Wynyard",
      type: "supermarket",
      distance: "Approx. 1.2 km",
      description: "Central supermarket for groceries and essentials.",
    },
    {
      name: "Chemist Warehouse Wynyard",
      type: "pharmacy",
      distance: "Approx. 1.1 km",
      description: "Pharmacy for basic health and travel items.",
    },
    {
      name: "Sydney Hospital",
      type: "hospital",
      distance: "Approx. 1.8 km",
      description: "Central hospital and emergency care reference point.",
    },
  ],
  seasonal_tips:
    "Sydney evenings near the harbour can be breezy, so bring a light layer for waterfront walks.",
};
