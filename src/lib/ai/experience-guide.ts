import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

import { buildExperienceGuidePrompt } from "@/lib/ai/prompts";
import {
  experienceGuideSchema,
  type ExperienceGuide,
} from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";

export async function generateExperienceGuide(
  property: Property,
): Promise<ExperienceGuide> {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: experienceGuideSchema,
    schemaName: "ExperienceGuide",
    schemaDescription:
      "Guia local personalizado para um imovel da Seazone.",
    prompt: buildExperienceGuidePrompt(property),
  });

  return experienceGuideSchema.parse(result.object);
}
