import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { formatHour } from "@/lib/format";
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

const fallbackRestaurants: Record<
  string,
  Array<{ name: string; distance: string; description: string }>
> = {
  FLN001: [
    {
      name: "Box 32",
      distance: "aprox. 6 km",
      description: "tradicional em Florianópolis, conhecido pelos petiscos",
    },
    {
      name: "Armazém Vieira",
      distance: "aprox. 5 km",
      description: "referência local em frutos do mar e ambiente histórico",
    },
  ],
  GRM001: [
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
  CMP001: [
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
  BNU001: [
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
  BCA001: [
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

  const guide = await getExperienceGuideForProperty(property.id);

  if (!process.env.OPENAI_API_KEY) {
    const lastUserMessage = [...body.data.messages]
      .reverse()
      .find((message) => message.role === "user")?.content;

    return streamPlainText(
      buildFallbackAnswer(property, guide, lastUserMessage ?? ""),
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: buildChatSystemPrompt(property, guide),
    messages: body.data.messages,
  });

  return result.toTextStreamResponse();
}

function buildFallbackAnswer(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  guide: Awaited<ReturnType<typeof getExperienceGuideForProperty>>,
  message: string,
) {
  const normalized = message.toLowerCase();

  if (normalized.includes("guia")) {
    return "Claro. Use o botão Ver guia completo da estadia para abrir todas as informações organizadas.";
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

  if (normalized.includes("restaurante") || normalized.includes("comer") || normalized.includes("perto")) {
    if (guide?.restaurants.length) {
      const restaurants = guide.restaurants
        .slice(0, 3)
        .map((restaurant) => `${restaurant.name} (${restaurant.distance})`)
        .join(", ");

      return `Perto de você tem ${restaurants}. Para ver mais detalhes, use o botão Ver guia completo da estadia.`;
    }

    const fallback = fallbackRestaurants[property.code];

    if (fallback?.length) {
      const restaurants = fallback
        .map(
          (restaurant) =>
            `${restaurant.name} (${restaurant.distance}), ${restaurant.description}`,
        )
        .join("; ");

      return `Perto de você tem ${restaurants}.`;
    }

    return "Ainda não tenho restaurantes gerados para este imóvel. Você pode abrir o guia completo da estadia para gerar as recomendações locais.";
  }

  if (normalized.includes("telefone") || normalized.includes("anfitri") || normalized.includes("contato")) {
    return `O anfitrião é ${property.host.name}. O telefone é ${property.host.phone}.`;
  }

  return "Posso te ajudar com WiFi, acesso ao imóvel, regras da estadia, contato do anfitrião e recomendações próximas. Se preferir, use o botão Ver guia completo da estadia.";
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
