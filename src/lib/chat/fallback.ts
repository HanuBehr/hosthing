import { formatHour } from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";
import type { Reservation } from "@/lib/validators/reservation";

export function buildFallbackAnswer(
  property: Property,
  guide: ExperienceGuide | null,
  reservation: Reservation | null,
  message: string,
) {
  const normalized = normalizeMessage(message);

  if (hasAny(normalized, ["wifi", "wi-fi", "password", "network"])) {
    return `The WiFi network is ${property.operational.wifi_network} and the password is ${property.operational.wifi_password}.`;
  }

  if (hasAny(normalized, ["pet", "dog", "cat", "animal"])) {
    return property.rules.allow_pet
      ? "Yes, this property allows pets."
      : "Unfortunately, this property does not allow pets.";
  }

  if (hasAny(normalized, ["check-in", "checkin", "arrival", "arrive"])) {
    return `Check-in starts at ${formatHour(property.rules.check_in_time)}. ${property.operational.property_access_instructions}`;
  }

  if (hasAny(normalized, ["check-out", "checkout", "leave", "departure"])) {
    return `Check-out is until ${formatHour(property.rules.check_out_time)}.`;
  }

  if (hasAny(normalized, ["parking", "garage", "car"])) {
    if (!property.operational.has_parking_spot) {
      return property.operational.parking_spot_instructions
        ? `This property does not include a dedicated parking spot. ${property.operational.parking_spot_instructions}`
        : "This property does not include a dedicated parking spot.";
    }

    return [
      `Parking is available${property.operational.parking_spot_identifier ? ` at ${property.operational.parking_spot_identifier}` : ""}.`,
      property.operational.parking_spot_instructions,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (hasAny(normalized, ["host", "phone", "contact", "call"])) {
    return `The host is ${property.host.name}. The phone number is ${property.host.phone}.`;
  }

  if (hasAny(normalized, ["reservation", "booking", "confirmation", "number"])) {
    if (!reservation) {
      return "I do not have reservation details available in this guide. Please check the booking platform or contact the host.";
    }

    return `The reservation code is ${reservation.reservationCode}. The booking is under ${reservation.guestName} and is currently ${reservation.status}.`;
  }

  if (hasAny(normalized, ["cleaning", "cleaning fee", "fee", "cost", "charge"])) {
    if (!reservation) {
      return "I do not have fee details available in this guide. Please check the booking platform or contact the host.";
    }

    return `The cleaning fee for this reservation is ${formatMoney(reservation.cleaningFee, reservation.currency)}.`;
  }

  if (hasAny(normalized, ["restaurant", "food", "eat", "dinner", "lunch"])) {
    if (guide?.restaurants.length) {
      return `For food near this property, I would consider ${formatPlaces(guide.restaurants.slice(0, 3), property)}. Check hours and route before leaving.`;
    }

    return missingGuideAnswer(property);
  }

  if (hasAny(normalized, ["attraction", "what to do", "visit", "nearby", "around"])) {
    if (guide?.attractions.length) {
      return `Good nearby options around ${property.address.neighborhood}, ${property.address.city}/${property.address.state}: ${formatPlaces(guide.attractions.slice(0, 3), property)}.`;
    }

    return missingGuideAnswer(property);
  }

  if (hasAny(normalized, ["market", "supermarket", "pharmacy", "hospital", "essential"])) {
    if (guide?.essentials.length) {
      return `For essentials near this property, consider ${formatPlaces(guide.essentials.slice(0, 3), property)}.`;
    }

    return missingGuideAnswer(property);
  }

  if (hasAny(normalized, ["guide", "local", "area", "neighborhood"])) {
    return buildLocalGuideOverview(property, guide);
  }

  return "I can help with WiFi, property access, house rules, host contact, restaurants, attractions, and nearby services. I will not invent private details that are not available in this guide.";
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(term));
}

function formatPlaces(
  places: Array<{ name: string; distance: string; description: string }>,
  property: Property,
) {
  return places
    .map((place) => {
      const mapsUrl = buildMapsUrl(
        `${place.name} ${property.address.city} ${property.address.state}`,
      );

      return `${place.name} (${place.distance}), ${place.description}. Maps: ${mapsUrl}`;
    })
    .join("; ");
}

function buildMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildLocalGuideOverview(property: Property, guide: ExperienceGuide | null) {
  if (!guide) {
    return missingGuideAnswer(property);
  }

  return [
    `This property is in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}.`,
    `For food nearby: ${formatPlaces(guide.restaurants.slice(0, 3), property)}.`,
    `For things to do: ${formatPlaces(guide.attractions.slice(0, 3), property)}.`,
    `Useful services: ${formatPlaces(guide.essentials.slice(0, 3), property)}.`,
    guide.seasonal_tips,
  ].join(" ");
}

function missingGuideAnswer(property: Property) {
  return `I do not have local recommendations saved for ${property.name} yet. I can still help with WiFi, access, house rules, and host contact from the property data.`;
}
