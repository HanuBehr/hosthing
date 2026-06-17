import { prisma } from "@/lib/db/prisma";
import {
  experienceGuideSchema,
  type ExperienceGuide,
} from "@/lib/validators/experience-guide";

export async function getExperienceGuideForProperty(
  propertyId: string,
): Promise<ExperienceGuide | null> {
  const guide = await prisma.experienceGuide.findUnique({
    where: { propertyId },
  });

  if (!guide?.content || guide.status !== "COMPLETED") {
    return null;
  }

  return experienceGuideSchema.parse(guide.content);
}
