import { prisma } from "@/lib/db/prisma";
import { guideCatalog } from "@/lib/property-catalog";
import {
  experienceGuideSchema,
  type ExperienceGuide,
} from "@/lib/validators/experience-guide";

export async function getExperienceGuideForProperty(
  propertyId: string,
  propertyCode?: string,
): Promise<ExperienceGuide | null> {
  const guide = await prisma.experienceGuide.findUnique({
    where: { propertyId },
  }).catch(() => null);

  if (!guide?.content || guide.status !== "COMPLETED") {
    return propertyCode ? guideCatalog[propertyCode] ?? null : null;
  }

  return experienceGuideSchema.parse(guide.content);
}
