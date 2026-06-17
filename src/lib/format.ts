import type { Property } from "@/lib/validators/property";

const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  tv: "TV",
  air_conditioning: "Ar-condicionado",
  kitchen: "Cozinha",
  washing_machine: "Máquina de lavar",
  elevator: "Elevador",
  balcony: "Sacada",
  bbq_grill: "Churrasqueira",
  dishwasher: "Lava-louças",
  pool: "Piscina",
};

const accessTypeLabels: Record<string, string> = {
  smart_lock: "Fechadura eletrônica",
  keybox: "Cofre de chaves",
};

export function formatAmenity(key: string) {
  return amenityLabels[key] ?? key.replaceAll("_", " ");
}

export function getEnabledAmenities(property: Property) {
  return Object.entries(property.amenities)
    .filter(([, enabled]) => enabled)
    .map(([key]) => formatAmenity(key));
}

export function formatAccessType(type: string) {
  return accessTypeLabels[type] ?? type.replaceAll("_", " ");
}

export function formatRule(allowed: boolean, positive: string, negative: string) {
  return allowed ? positive : negative;
}

export function formatHour(hour: string) {
  return hour.replace(":00", "h");
}

export function formatPhoneForWhatsApp(phone: string) {
  return phone.replace(/\D/g, "");
}

export function getFullAddress(property: Property) {
  const { address } = property;
  const complement = address.complement ? `, ${address.complement}` : "";

  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.state}, ${address.postal_code}`;
}
