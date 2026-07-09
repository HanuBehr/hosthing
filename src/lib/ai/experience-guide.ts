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
      "Personalized local guide for a short-term rental property.",
    prompt: buildExperienceGuidePrompt(property),
  });

  return experienceGuideSchema.parse(result.object);
}
