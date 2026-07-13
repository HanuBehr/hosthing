import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { enforceAiLimits } from "@/lib/ai/limits";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { buildFallbackAnswer } from "@/lib/chat/fallback";
import { redactPrivatePropertyData } from "@/lib/security/redaction";
import { verifyGuestAccessToken } from "@/lib/security/guest-access";
import { recordAuditEvent } from "@/server/audit";
import { getExperienceGuideForProperty } from "@/server/experience-guides";
import { getPropertyByCode } from "@/server/properties";

export const runtime = "nodejs";

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

const chatRequestSchema = z.object({
  propertyCode: z.string().min(1),
  accessToken: z.string().optional(),
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

  const guestAccess = await verifyGuestAccessToken(body.data.accessToken, property.id);
  const hasGuestAccess = Boolean(guestAccess);
  const visibleProperty = hasGuestAccess
    ? property
    : redactPrivatePropertyData(property);
  const guide = await getExperienceGuideForProperty(property.id, property.code).catch(() => null);
  const reservation = guestAccess?.reservation ?? null;
  const lastUserMessage = getLastUserMessage(body.data.messages) ?? "";

  await recordAuditEvent({
    propertyId: property.id,
    reservationId: reservation?.id,
    eventType: "assistant_question",
    metadata: {
      hasGuestAccess,
      messageLength: lastUserMessage.length,
    },
  });

  const limit = enforceAiLimits({
    key: guestAccess?.tokenHash ?? `public:${property.code}`,
    messages: body.data.messages,
  });

  if (!limit.allowed) {
    return Response.json({ error: limit.reason }, { status: 429 });
  }

  const fallbackAnswer = buildFallbackAnswer(
    visibleProperty,
    guide,
    reservation,
    lastUserMessage,
  );

  if (!hasOpenAIKey()) {
    return streamPlainText(fallbackAnswer);
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: buildChatSystemPrompt(visibleProperty, guide, reservation),
    messages: body.data.messages,
    maxOutputTokens: limit.maxOutputTokens,
  });

  return streamWithFallback(result.textStream, fallbackAnswer);
}

function getLastUserMessage(messages: z.infer<typeof chatRequestSchema>["messages"]) {
  return [...messages].reverse().find((message) => message.role === "user")
    ?.content;
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
