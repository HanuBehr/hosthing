import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { buildChatSystemPrompt } from "@/lib/ai/prompts";
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
    return `Claro. O guia completo deste imóvel está em /${property.code}/guia.`;
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
    return `O check-in pode ser feito a partir das ${property.rules.check_in_time}. ${property.operational.property_access_instructions}`;
  }

  if (normalized.includes("restaurante") || normalized.includes("comer") || normalized.includes("perto")) {
    if (guide?.restaurants.length) {
      const restaurants = guide.restaurants
        .slice(0, 3)
        .map((restaurant) => `${restaurant.name} (${restaurant.distance})`)
        .join(", ");

      return `Perto de você tem ${restaurants}. Veja mais detalhes no guia completo: /${property.code}/guia.`;
    }

    return `Ainda não tenho restaurantes gerados para este imóvel. Você pode abrir o guia completo em /${property.code}/guia para gerar as recomendações locais.`;
  }

  if (normalized.includes("telefone") || normalized.includes("anfitri") || normalized.includes("contato")) {
    return `O anfitrião é ${property.host.name}. O telefone é ${property.host.phone}.`;
  }

  return `Posso te ajudar com WiFi, acesso ao imóvel, regras da estadia, contato do anfitrião e recomendações próximas. Se preferir, abra o guia completo em /${property.code}/guia.`;
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
