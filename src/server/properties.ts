import { prisma } from "@/lib/db/prisma";
import { propertySchema, type Property } from "@/lib/validators/property";

const propertyOverrides: Record<string, Partial<Pick<Property, "images" | "name">>> = {
  BNU001: {
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Parque_Vila_Germanica_Blumenau_SC_%2840841592442%29.jpg",
    ],
  },
  FLN001: {
    name: "Apartamento Trindade UFSC",
  },
};

export async function getPropertyByCode(code: string): Promise<Property | null> {
  const property = await prisma.property.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!property) {
    return null;
  }

  const parsedProperty = propertySchema.parse(property);
  const override = propertyOverrides[parsedProperty.code];

  return override ? { ...parsedProperty, ...override } : parsedProperty;
}
