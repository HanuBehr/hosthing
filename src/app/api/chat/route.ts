import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { formatHour } from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";
import { getExperienceGuideForProperty } from "@/server/experience-guides";
import { getPropertyByCode } from "@/server/properties";

export const runtime = "nodejs";

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

const chatRequestSchema = z.object({
  propertyCode: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  const body = chatRequestSchema.safeParse(await request.json());

  if (!body.success) {
    return Response.json({ error: "Invalid message." }, { status: 400 });
  }

  const property = await getPropertyByCode(body.data.propertyCode);

  if (!property) {
    return Response.json({ error: "Property not found." }, { status: 404 });
  }

  const guide = await getExperienceGuideForProperty(property.id).catch(() => null);
  const fallbackAnswer = buildFallbackAnswer(
    property,
    guide,
    getLastUserMessage(body.data.messages) ?? "",
  );

  if (!hasOpenAIKey()) {
    return streamPlainText(fallbackAnswer);
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: buildChatSystemPrompt(property, guide),
    messages: body.data.messages,
  });

  return streamWithFallback(result.textStream, fallbackAnswer);
}

function getLastUserMessage(messages: z.infer<typeof chatRequestSchema>["messages"]) {
  return [...messages].reverse().find((message) => message.role === "user")
    ?.content;
}

function buildFallbackAnswer(
  property: Property,
  guide: ExperienceGuide | null,
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

function streamPlainText(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(" ");

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(`${word} `));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function streamWithFallback(
  textStream: AsyncIterable<string>,
  fallbackText: string,
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let emittedText = false;

      try {
        for await (const chunk of textStream) {
          emittedText = true;
          controller.enqueue(encoder.encode(chunk));
        }

        if (!emittedText) {
          controller.enqueue(encoder.encode(fallbackText));
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            emittedText
              ? "\n\nI could not complete the answer right now."
              : fallbackText,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
