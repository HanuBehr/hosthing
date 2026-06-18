import { prisma } from "@/lib/db/prisma";
import { propertySchema, type Property } from "@/lib/validators/property";

export async function getPropertyByCode(code: string): Promise<Property | null> {
  const property = await prisma.property.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!property) {
    return null;
  }

  return propertySchema.parse(property);
}
