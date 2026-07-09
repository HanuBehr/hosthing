import { prisma } from "@/lib/db/prisma";
import { getCatalogPropertyByCode } from "@/lib/property-catalog";
import { propertySchema, type Property } from "@/lib/validators/property";

export async function getPropertyByCode(code: string): Promise<Property | null> {
  const normalizedCode = code.toUpperCase();
  const property = await prisma.property.findUnique({
    where: { code: normalizedCode },
  }).catch(() => null);

  if (!property) {
    return getCatalogPropertyByCode(normalizedCode);
  }

  return propertySchema.parse(property);
}
