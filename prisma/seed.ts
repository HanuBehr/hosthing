import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://user:password@localhost:5432/seazone_guest_guide";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const properties = [
  {
    code: "FLN001",
    name: "Apartamento Trindade UFSC",
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
      property_access_instructions:
        "Use o código 4521 na fechadura eletrônica",
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
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    ],
    host: {
      name: "Ana Paula",
      phone: "+5548991234567",
    },
  },
  {
    code: "GRM001",
    name: "Chalé Serra Gramado",
    propertyType: "Casa",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    address: {
      street: "Rua das Hortênsias",
      number: "220",
      complement: null,
      neighborhood: "Planalto",
      city: "Gramado",
      state: "RS",
      postal_code: "95670-000",
    },
    operational: {
      wifi_network: "ChaletSerra_GRM",
      wifi_password: "gramado@2024",
      is_self_checkin: false,
      property_access_type: "keybox",
      property_access_instructions:
        "A chave está no cofre na entrada. Código: 1983",
      property_password: "1983",
      has_parking_spot: true,
      parking_spot_instructions: "Garagem própria para 2 carros",
    },
    rules: {
      check_in_time: "14:00",
      check_out_time: "12:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbq_grill: true,
      balcony: true,
      dishwasher: true,
    },
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200",
    ],
    host: {
      name: "Carlos Eduardo",
      phone: "+5554998765432",
    },
  },
  {
    code: "CMP001",
    name: "Casa Praia do Campeche",
    propertyType: "Casa",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    address: {
      street: "Avenida Pequeno Príncipe",
      number: "1650",
      complement: "Casa 04",
      neighborhood: "Campeche",
      city: "Florianópolis",
      state: "SC",
      postal_code: "88063-000",
    },
    operational: {
      wifi_network: "CasaCampeche_CMP",
      wifi_password: "campeche@2026",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use o código 7319 na fechadura eletrônica da porta principal",
      property_password: "7319",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 04 - pátio interno",
      parking_spot_instructions:
        "Entre pelo portão branco ao lado da casa e estacione na vaga sinalizada 04",
    },
    rules: {
      check_in_time: "15:00",
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
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      balcony: true,
      bbq_grill: true,
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Florianopolis_Campeche_Ilha.JPG",
    ],
    host: {
      name: "Marina Costa",
      phone: "+5548994455667",
    },
  },
  {
    code: "BNU001",
    name: "Loft Vila Germânica Blumenau",
    propertyType: "Apartamento",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    address: {
      street: "Rua Alberto Stein",
      number: "199",
      complement: "Apto 502",
      neighborhood: "Velha",
      city: "Blumenau",
      state: "SC",
      postal_code: "89036-200",
    },
    operational: {
      wifi_network: "LoftBlumenau_BNU",
      wifi_password: "valeitajai2026",
      is_self_checkin: true,
      property_access_type: "keybox",
      property_access_instructions:
        "Retire a chave no cofre preto ao lado da portaria. Código: 2846",
      property_password: "2846",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 502 - garagem térrea",
      parking_spot_instructions:
        "Use o controle dentro do apartamento para entrada e saída da garagem",
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
      elevator: true,
      dishwasher: true,
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Parque_Vila_Germanica_Blumenau_SC_%2840841592442%29.jpg",
    ],
    host: {
      name: "Roberto Weiss",
      phone: "+5547993344556",
    },
  },
  {
    code: "BCA001",
    name: "Apartamento Barra Sul Balneário Camboriú",
    propertyType: "Apartamento",
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    address: {
      street: "Avenida Atlântica",
      number: "4800",
      complement: "Apto 1802",
      neighborhood: "Barra Sul",
      city: "Balneário Camboriú",
      state: "SC",
      postal_code: "88330-027",
    },
    operational: {
      wifi_network: "SeaView_BCA001",
      wifi_password: "barraSul2026",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use o código 6094 na fechadura digital após liberar o acesso na portaria",
      property_password: "6094",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 1802 - subsolo G2",
      parking_spot_instructions:
        "Informe o apartamento na guarita e utilize a tag disponível no imóvel",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "10:00",
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
      pool: true,
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Balne%C3%A1rio_Cambori%C3%BA_from_Unipraias_Park_2023-04-02.jpg",
    ],
    host: {
      name: "Patrícia Almeida",
      phone: "+5547991122334",
    },
  },
];

async function main() {
  for (const property of properties) {
    await prisma.property.upsert({
      where: { code: property.code },
      update: property,
      create: property,
    });
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
