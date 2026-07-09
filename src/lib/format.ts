import type { Property } from "@/lib/validators/property";

const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  tv: "TV",
  air_conditioning: "Air conditioning",
  kitchen: "Kitchen",
  washing_machine: "Washing machine",
  elevator: "Elevator",
  balcony: "Balcony",
  bbq_grill: "BBQ grill",
  dishwasher: "Dishwasher",
  pool: "Pool",
};

const accessTypeLabels: Record<string, string> = {
  smart_lock: "Smart lock",
  keybox: "Key lockbox",
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
  return hour;
}

export function formatPhoneForWhatsApp(phone: string) {
  return phone.replace(/\D/g, "");
}

export function getFullAddress(property: Property) {
  const { address } = property;
  const complement = address.complement ? `, ${address.complement}` : "";

  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.state}, ${address.postal_code}`;
}
