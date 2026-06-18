import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyGuide } from "@/components/property/property-guide";
import { getPropertyByCode } from "@/server/properties";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const property = await getPropertyByCode(code);

  if (!property) {
    return {
      title: "Guia não encontrado | Seazone",
    };
  }

  return {
    title: `${property.name} | Guia do Hóspede`,
    description: `Guia da estadia em ${property.address.city}/${property.address.state}.`,
  };
}

export default async function GuestGuidePage({ params }: PageProps) {
  const { code } = await params;
  const property = await getPropertyByCode(code);

  if (!property) {
    notFound();
  }

  return <PropertyGuide property={property} />;
}
