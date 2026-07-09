import { generateExperienceGuide } from "@/lib/ai/experience-guide";
import { prisma } from "@/lib/db/prisma";
import { guideCatalog } from "@/lib/property-catalog";
import { experienceGuideSchema } from "@/lib/validators/experience-guide";
import { getPropertyByCode } from "@/server/properties";

export const runtime = "nodejs";

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

type RouteParams = {
  params: Promise<{ code: string }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  const { code } = await params;
  const property = await getPropertyByCode(code);

  if (!property) {
    return Response.json({ error: "Property not found." }, { status: 404 });
  }

  const catalogGuide = guideCatalog[property.code];

  const existingGuide = await prisma.experienceGuide.findUnique({
    where: { propertyId: property.id },
  }).catch(() => null);

  if (existingGuide?.status === "COMPLETED" && existingGuide.content) {
    return Response.json({
      guide: experienceGuideSchema.parse(existingGuide.content),
    });
  }

  const stalePendingCutoff = new Date(Date.now() - 2 * 60 * 1000);
  if (
    existingGuide?.status === "PENDING" &&
    existingGuide.updatedAt > stalePendingCutoff
  ) {
    return Response.json({ status: "pending" }, { status: 202 });
  }

  if (!hasOpenAIKey()) {
    return Response.json({ guide: catalogGuide });
  }

  await prisma.experienceGuide.upsert({
    where: { propertyId: property.id },
    create: { propertyId: property.id, status: "PENDING" },
    update: { status: "PENDING", errorMessage: null },
  }).catch(() => null);

  try {
    const guide = await generateExperienceGuide(property);

    await prisma.experienceGuide.update({
      where: { propertyId: property.id },
      data: {
        status: "COMPLETED",
        content: guide,
        generatedAt: new Date(),
        errorMessage: null,
      },
    }).catch(() => null);

    return Response.json({ guide });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected guide generation failure.";

    await prisma.experienceGuide.update({
      where: { propertyId: property.id },
      data: {
        status: "FAILED",
        errorMessage: message,
      },
    }).catch(() => null);

    return Response.json({ guide: catalogGuide });
  }
}
