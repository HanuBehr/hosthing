import { generateExperienceGuide } from "@/lib/ai/experience-guide";
import { prisma } from "@/lib/db/prisma";
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

  const existingGuide = await prisma.experienceGuide.findUnique({
    where: { propertyId: property.id },
  });

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

  await prisma.experienceGuide.upsert({
    where: { propertyId: property.id },
    create: { propertyId: property.id, status: "PENDING" },
    update: { status: "PENDING", errorMessage: null },
  });

  if (!hasOpenAIKey()) {
    await prisma.experienceGuide.update({
      where: { propertyId: property.id },
      data: {
        status: "FAILED",
        errorMessage: "OPENAI_API_KEY is not configured.",
      },
    });
    return Response.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 },
    );
  }

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
    });

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
    });

    return Response.json({ error: message }, { status: 500 });
  }
}
