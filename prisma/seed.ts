import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.NEON_POSTGRES_PRISMA_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
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
      "/properties/fln001.jpg",
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
      "/properties/grm001.jpg",
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
      "/properties/cmp001.jpg",
    ],
    host: {
      name: "Marina Costa",
      phone: "+5548994455667",
    },
  },
  {
    code: "LAG001",
    name: "Apartamento Lagoa da Conceição",
    propertyType: "Apartamento",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 3,
    address: {
      street: "Rua Afonso Luís Borba",
      number: "113",
      complement: "Apto 204",
      neighborhood: "Lagoa da Conceição",
      city: "Florianópolis",
      state: "SC",
      postal_code: "88062-040",
    },
    operational: {
      wifi_network: "LagoaView_LAG001",
      wifi_password: "lagoa2026",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use o código 3842 na fechadura eletrônica após acessar o hall principal",
      property_password: "3842",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 204 - garagem coberta",
      parking_spot_instructions:
        "Entre pelo portão da Rua Afonso Luís Borba e estacione na vaga 204 sinalizada",
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
      elevator: true,
      balcony: true,
    },
    images: [
      "/properties/lag001.jpg",
    ],
    host: {
      name: "Bianca Martins",
      phone: "+5548995566778",
    },
  },
  {
    code: "JUR001",
    name: "Studio Jurerê Internacional",
    propertyType: "Apartamento",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    address: {
      street: "Avenida dos Búzios",
      number: "1760",
      complement: "Studio 108",
      neighborhood: "Jurerê Internacional",
      city: "Florianópolis",
      state: "SC",
      postal_code: "88053-301",
    },
    operational: {
      wifi_network: "StudioJurere_JUR",
      wifi_password: "jurere2026",
      is_self_checkin: true,
      property_access_type: "keybox",
      property_access_instructions:
        "Retire a chave no cofre cinza ao lado da portaria. Código: 9175",
      property_password: "9175",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 108 - térreo",
      parking_spot_instructions:
        "Informe o studio na portaria e utilize a vaga marcada 108 no térreo",
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
      elevator: true,
      balcony: true,
      pool: true,
    },
    images: [
      "/properties/jur001.jpg",
    ],
    host: {
      name: "Lucas Farias",
      phone: "+5548996677889",
    },
  },
  {
    code: "STO001",
    name: "Casa Santo Antônio de Lisboa",
    propertyType: "Casa",
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 5,
    address: {
      street: "Rodovia Gilson da Costa Xavier",
      number: "1340",
      complement: "Casa 02",
      neighborhood: "Santo Antônio de Lisboa",
      city: "Florianópolis",
      state: "SC",
      postal_code: "88050-000",
    },
    operational: {
      wifi_network: "CasaSantoAntonio_STO",
      wifi_password: "santoantonio2026",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions:
        "Use o código 2468 na fechadura eletrônica da porta lateral",
      property_password: "2468",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 02 - pátio interno",
      parking_spot_instructions:
        "Abra o portão branco pelo interfone da Casa 02 e estacione na vaga à esquerda",
    },
    rules: {
      check_in_time: "14:00",
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
      "/properties/sto001.jpg",
    ],
    host: {
      name: "Fernanda Lima",
      phone: "+5548997788990",
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
      "/properties/bnu001.jpg",
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
      "/properties/bca001.jpg",
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
