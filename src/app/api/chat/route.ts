import { streamText } from "ai";
import { z } from "zod";

import { getOpenAIModel, hasOpenAIKey } from "@/lib/ai/openai";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { formatHour } from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import { getExperienceGuideForProperty } from "@/server/experience-guides";
import { getPropertyByCode } from "@/server/properties";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  propertyCode: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

const fallbackLocalGuides: Record<
  string,
  {
    restaurants: Array<{ name: string; distance: string; description: string }>;
    attractions: Array<{ name: string; distance: string; description: string }>;
    essentials: Array<{
      name: string;
      distance: string;
      description: string;
      type: "pharmacy" | "supermarket" | "hospital" | "other";
    }>;
    seasonalTips: string;
  }
> = {
  FLN001: {
    restaurants: [
      {
        name: "Restaurante Meu Cantinho",
        distance: "aprox. 700 m",
        description: "opção casual para almoço no bairro Trindade",
      },
      {
        name: "Pizzaria Basilico",
        distance: "aprox. 1 km",
        description: "pizzaria prática para jantar perto da UFSC",
      },
    ],
    attractions: [
      {
        name: "UFSC",
        distance: "aprox. 900 m",
        description: "campus arborizado e principal ponto de referência da Trindade",
      },
      {
        name: "Shopping Villa Romana",
        distance: "aprox. 2,5 km",
        description: "shopping com lojas, cinema e opções de alimentação",
      },
    ],
    essentials: [
      {
        name: "Imperatriz Gourmet Trindade",
        distance: "aprox. 1 km",
        description: "supermercado com itens de mercado e padaria",
        type: "supermarket",
      },
      {
        name: "Farmácia Catarinense Trindade",
        distance: "aprox. 500 m",
        description: "farmácia próxima para compras básicas",
        type: "pharmacy",
      },
    ],
    seasonalTips:
      "A Trindade é prática para circular pela região da UFSC; em horários de aula, considere sair com alguns minutos de folga.",
  },
  GRM001: {
    restaurants: [
      {
        name: "Cara de Mau",
        distance: "aprox. 2 km",
        description: "restaurante temático muito conhecido em Gramado",
      },
      {
        name: "George III",
        distance: "aprox. 2 km",
        description: "cozinha contemporânea em uma casa clássica da cidade",
      },
    ],
    attractions: [
      {
        name: "Rua Coberta",
        distance: "aprox. 2 km",
        description: "ponto central para caminhar, comer e ver o movimento",
      },
      {
        name: "Lago Negro",
        distance: "aprox. 3 km",
        description: "passeio clássico de Gramado, bom para fotos e caminhada",
      },
    ],
    essentials: [
      {
        name: "Nacional Gramado",
        distance: "aprox. 2 km",
        description: "supermercado prático para compras rápidas",
        type: "supermarket",
      },
      {
        name: "Panvel Centro Gramado",
        distance: "aprox. 2 km",
        description: "farmácia próxima da área mais turística",
        type: "pharmacy",
      },
    ],
    seasonalTips:
      "Gramado costuma ter noites frias mesmo fora do inverno; leve uma camada extra para sair à noite.",
  },
  CMP001: {
    restaurants: [
      {
        name: "Pachamay",
        distance: "aprox. 1 km",
        description: "cozinha natural e pratos frescos perto da Praia do Campeche",
      },
      {
        name: "Zeca Bar e Restaurante",
        distance: "aprox. 3 km",
        description: "opção tradicional para frutos do mar no sul da ilha",
      },
    ],
    attractions: [
      {
        name: "Praia do Campeche",
        distance: "aprox. 1 km",
        description: "principal passeio da região, ideal para caminhada e mar",
      },
      {
        name: "Lagoa Pequena",
        distance: "aprox. 3 km",
        description: "área tranquila para contato com natureza no sul da ilha",
      },
    ],
    essentials: [
      {
        name: "Hiper Select Campeche",
        distance: "aprox. 2 km",
        description: "supermercado conhecido no bairro",
        type: "supermarket",
      },
      {
        name: "Farmácia Panvel Campeche",
        distance: "aprox. 2 km",
        description: "farmácia útil para itens básicos da estadia",
        type: "pharmacy",
      },
    ],
    seasonalTips:
      "Para praia, prefira chegar cedo ao Campeche e confira a condição do vento antes de sair.",
  },
  BNU001: {
    restaurants: [
      {
        name: "Moinho do Vale",
        distance: "aprox. 3 km",
        description: "restaurante conhecido à beira do rio Itajaí-Açu",
      },
      {
        name: "Thapyoka Restaurante",
        distance: "aprox. 4 km",
        description: "cozinha regional em área histórica de Blumenau",
      },
    ],
    attractions: [
      {
        name: "Vila Germânica",
        distance: "aprox. 4 km",
        description: "principal ponto turístico e espaço de eventos da cidade",
      },
      {
        name: "Museu da Cerveja",
        distance: "aprox. 4 km",
        description: "parada rápida para conhecer a cultura cervejeira local",
      },
    ],
    essentials: [
      {
        name: "Angeloni Blumenau",
        distance: "aprox. 3 km",
        description: "supermercado completo para abastecer a estadia",
        type: "supermarket",
      },
      {
        name: "Panvel Centro Blumenau",
        distance: "aprox. 3 km",
        description: "farmácia em região central",
        type: "pharmacy",
      },
    ],
    seasonalTips:
      "Em períodos de eventos na Vila Germânica, vale sair com antecedência e reservar restaurantes.",
  },
  BCA001: {
    restaurants: [
      {
        name: "Chaplin Restaurante",
        distance: "aprox. 1 km",
        description: "clássico da orla de Balneário Camboriú",
      },
      {
        name: "Guacamole Cocina Mexicana",
        distance: "aprox. 2 km",
        description: "opção descontraída e conhecida para jantar na cidade",
      },
    ],
    attractions: [
      {
        name: "Parque Unipraias",
        distance: "aprox. 4 km",
        description: "teleférico e vista panorâmica da cidade e praias",
      },
      {
        name: "Molhe da Barra Sul",
        distance: "aprox. 3 km",
        description: "bom passeio para caminhar e ver a orla",
      },
    ],
    essentials: [
      {
        name: "Angeloni Balneário Camboriú",
        distance: "aprox. 2 km",
        description: "supermercado completo e central",
        type: "supermarket",
      },
      {
        name: "Panvel Atlântica",
        distance: "aprox. 1 km",
        description: "farmácia próxima da orla",
        type: "pharmacy",
      },
    ],
    seasonalTips:
      "Na alta temporada, planeje deslocamentos com folga e prefira caminhar pela região central quando possível.",
  },
};

export async function POST(request: Request) {
  const body = chatRequestSchema.safeParse(await request.json());

  if (!body.success) {
    return Response.json({ error: "Mensagem inválida." }, { status: 400 });
  }

  const property = await getPropertyByCode(body.data.propertyCode);

  if (!property) {
    return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
  }

  const guide = await getExperienceGuideForProperty(property.id).catch(() => null);

  const fallbackAnswer = buildFallbackAnswer(
    property,
    guide,
    getLastUserMessage(body.data.messages) ?? "",
  );

  if (!hasOpenAIKey()) {
    console.warn("OPENAI_API_KEY is missing or not parseable in production runtime.");
    return streamPlainText(fallbackAnswer);
  }

  const result = streamText({
    model: getOpenAIModel("gpt-4o-mini"),
    system: buildChatSystemPrompt(
      property,
      guide ?? getFallbackExperienceGuide(property.code),
    ),
    messages: body.data.messages,
  });

  return streamWithFallback(result.textStream, fallbackAnswer);
}

function getLastUserMessage(messages: z.infer<typeof chatRequestSchema>["messages"]) {
  return [...messages].reverse().find((message) => message.role === "user")
    ?.content;
}

function buildFallbackAnswer(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  guide: Awaited<ReturnType<typeof getExperienceGuideForProperty>>,
  message: string,
) {
  const normalized = normalizeMessage(message);
  const fallbackGuide = fallbackLocalGuides[property.code];

  if (normalized.includes("guia")) {
    return buildLocalGuideOverview(property, guide, fallbackGuide);
  }

  if (normalized.includes("wifi") || normalized.includes("wi-fi") || normalized.includes("senha")) {
    return `A rede WiFi é ${property.operational.wifi_network} e a senha é ${property.operational.wifi_password}.`;
  }

  if (normalized.includes("cachorro") || normalized.includes("pet") || normalized.includes("animal")) {
    return property.rules.allow_pet
      ? "Sim, este imóvel permite animais de estimação."
      : "Infelizmente este imóvel não permite animais de estimação.";
  }

  if (normalized.includes("check-in") || normalized.includes("checkin") || normalized.includes("entrar")) {
    return `O check-in pode ser feito a partir das ${formatHour(property.rules.check_in_time)}. ${property.operational.property_access_instructions}`;
  }

  if (isRestaurantIntent(normalized)) {
    if (guide?.restaurants.length) {
      return `Perto de você tem ${formatPlaces(guide.restaurants.slice(0, 3))}.`;
    }

    if (fallbackGuide?.restaurants.length) {
      return `Perto de você tem ${formatPlaces(fallbackGuide.restaurants)}.`;
    }

    return "Ainda não tenho restaurantes cadastrados para este imóvel. Posso ajudar com WiFi, acesso, regras e contato do anfitrião.";
  }

  if (isEssentialIntent(normalized)) {
    if (guide?.essentials.length) {
      return `Para itens essenciais, considere ${formatPlaces(guide.essentials.slice(0, 3))}.`;
    }

    if (fallbackGuide?.essentials.length) {
      return `Para itens essenciais, considere ${formatPlaces(fallbackGuide.essentials)}.`;
    }

    return "Ainda não tenho mercados ou farmácias cadastrados para este imóvel. Em caso de urgência, fale com o anfitrião.";
  }

  if (isAttractionIntent(normalized)) {
    if (guide?.attractions.length) {
      return `Boas opções por perto: ${formatPlaces(guide.attractions.slice(0, 3))}.`;
    }

    if (fallbackGuide?.attractions.length) {
      return `Boas opções por perto: ${formatPlaces(fallbackGuide.attractions)}.`;
    }

    return "Ainda não tenho atrações cadastradas para este imóvel. Posso ajudar com WiFi, acesso, regras e contato do anfitrião.";
  }

  if (isSeasonalIntent(normalized)) {
    if (guide?.seasonal_tips) {
      return guide.seasonal_tips;
    }

    if (fallbackGuide?.seasonalTips) {
      return fallbackGuide.seasonalTips;
    }

    return "Ainda não tenho uma dica sazonal cadastrada para este imóvel.";
  }

  if (normalized.includes("telefone") || normalized.includes("anfitri") || normalized.includes("contato")) {
    return `O anfitrião é ${property.host.name}. O telefone é ${property.host.phone}.`;
  }

  return "Posso te ajudar com WiFi, acesso ao imóvel, regras da estadia, contato do anfitrião, restaurantes, atrações e serviços próximos.";
}

function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isRestaurantIntent(message: string) {
  return ["restaurante", "comer", "jantar", "almocar", "almoco", "comida"].some(
    (term) => message.includes(term),
  );
}

function isAttractionIntent(message: string) {
  return ["o que fazer", "passeio", "atracao", "turismo", "praia", "visitar", "perto"].some(
    (term) => message.includes(term),
  );
}

function isEssentialIntent(message: string) {
  return ["mercado", "supermercado", "farmacia", "hospital", "essencial"].some(
    (term) => message.includes(term),
  );
}

function isSeasonalIntent(message: string) {
  return ["dica", "sazonal", "temporada", "chuva", "frio", "calor"].some(
    (term) => message.includes(term),
  );
}

function formatPlaces(
  places: Array<{ name: string; distance: string; description: string }>,
) {
  return places
    .map((place) => `${place.name} (${place.distance}), ${place.description}`)
    .join("; ");
}

function buildLocalGuideOverview(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  guide: Awaited<ReturnType<typeof getExperienceGuideForProperty>>,
  fallbackGuide: (typeof fallbackLocalGuides)[string] | undefined,
) {
  if (guide) {
    return [
      `Para ${property.address.city}, recomendo restaurantes como ${formatPlaces(guide.restaurants.slice(0, 2))}.`,
      `Para passear: ${formatPlaces(guide.attractions.slice(0, 2))}.`,
      `Serviços úteis: ${formatPlaces(guide.essentials.slice(0, 2))}.`,
      guide.seasonal_tips,
    ].join(" ");
  }

  if (fallbackGuide) {
    return [
      `Para ${property.address.city}, recomendo restaurantes como ${formatPlaces(fallbackGuide.restaurants)}.`,
      `Para passear: ${formatPlaces(fallbackGuide.attractions)}.`,
      `Serviços úteis: ${formatPlaces(fallbackGuide.essentials)}.`,
      fallbackGuide.seasonalTips,
    ].join(" ");
  }

  return "Ainda não tenho recomendações locais cadastradas para este imóvel. Posso ajudar com WiFi, acesso, regras e contato do anfitrião.";
}

function getFallbackExperienceGuide(code: string): ExperienceGuide | null {
  const fallbackGuide = fallbackLocalGuides[code];

  if (!fallbackGuide) return null;

  return {
    welcome_message:
      "Estas são recomendações locais para apoiar a estadia neste imóvel.",
    restaurants: fallbackGuide.restaurants,
    attractions: fallbackGuide.attractions,
    essentials: fallbackGuide.essentials,
    seasonal_tips: fallbackGuide.seasonalTips,
  };
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
      } catch (error) {
        console.error("OpenAI stream failed", error);
        controller.enqueue(
          encoder.encode(
            emittedText
              ? "\n\nNão consegui completar a resposta agora."
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
