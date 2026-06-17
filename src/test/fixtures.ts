import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";

export const propertyFixture: Property = {
  id: "property-fln001",
  code: "FLN001",
  name: "Apartamento Beira-Mar Florianópolis",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  address: {
    street: "Rua Lauro Linhares",
    number: "589",
    complement: "Apto 301",
    neighborhood: "Trindade",
    city: "Florianópolis",
    state: "SC",
    postal_code: "88036-001",
  },
  operational: {
    wifi_network: "SeaHome_FLN001",
    wifi_password: "floripa2024",
    is_self_checkin: true,
    property_access_type: "smart_lock",
    property_access_instructions: "Use o código 4521 na fechadura eletrônica",
    property_password: "4521",
    has_parking_spot: true,
    parking_spot_identifier: "Vaga 12 - subsolo B1",
    parking_spot_instructions: "Portão lateral, código 7890 no interfone",
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
  images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"],
  host: {
    name: "Ana Paula",
    phone: "+5548991234567",
  },
};

export const experienceGuideFixture: ExperienceGuide = {
  welcome_message:
    "Seu apartamento fica na Trindade, uma região prática para circular por Florianópolis.",
  restaurants: [
    {
      name: "Restaurante Meu Cantinho",
      distance: "Aprox. 700 m",
      description: "Opção casual para almoço no bairro.",
    },
    {
      name: "Pizzaria Basilico",
      distance: "Aprox. 1 km",
      description: "Pizzaria para jantar perto da UFSC.",
    },
    {
      name: "Sushi Yama",
      distance: "Aprox. 1,4 km",
      description: "Restaurante japonês na região central da Trindade.",
    },
    {
      name: "Café Cultura",
      distance: "Aprox. 1,6 km",
      description: "Café para brunch e lanches rápidos.",
    },
  ],
  attractions: [
    {
      name: "UFSC",
      distance: "Aprox. 900 m",
      description: "Campus arborizado e ponto de referência do bairro.",
    },
    {
      name: "Shopping Villa Romana",
      distance: "Aprox. 2,5 km",
      description: "Shopping com lojas, cinema e alimentação.",
    },
    {
      name: "Lagoa da Conceição",
      distance: "Aprox. 9 km",
      description: "Região com restaurantes, bares e vista para a lagoa.",
    },
  ],
  essentials: [
    {
      name: "Farmácia Catarinense",
      type: "pharmacy",
      distance: "Aprox. 500 m",
      description: "Farmácia próxima para compras básicas.",
    },
    {
      name: "Imperatriz Gourmet",
      type: "supermarket",
      distance: "Aprox. 1 km",
      description: "Supermercado com itens de mercado e padaria.",
    },
    {
      name: "Hospital Universitário UFSC",
      type: "hospital",
      distance: "Aprox. 1,5 km",
      description: "Referência hospitalar próxima ao bairro.",
    },
  ],
  seasonal_tips:
    "No inverno, leve um casaco leve para a noite e acompanhe a previsão antes de sair.",
};
