import type { Property } from "@/lib/validators/property";

const lockedPrivateValue = "Private detail available only from a valid guest link.";

export function redactPrivatePropertyData(property: Property): Property {
  return {
    ...property,
    operational: {
      ...property.operational,
      wifi_password: lockedPrivateValue,
      property_access_instructions:
        "Open this guide from the signed guest link to view arrival instructions.",
      property_password: undefined,
      parking_spot_identifier: property.operational.has_parking_spot
        ? "Available with signed guest link"
        : property.operational.parking_spot_identifier,
      parking_spot_instructions: property.operational.has_parking_spot
        ? "Open this guide from the signed guest link to view the exact parking instructions."
        : property.operational.parking_spot_instructions,
    },
    host: {
      ...property.host,
      phone: "Available from a valid guest link",
    },
  };
}

export function hasPrivatePropertyData(property: Property) {
  return property.operational.wifi_password !== lockedPrivateValue;
}
