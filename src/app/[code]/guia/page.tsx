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
      title: "Guide not found | StayPilot AI",
    };
  }

  return {
    title: `${property.name} | Guest Guide`,
    description: `Guest guide for ${property.address.city}/${property.address.state}.`,
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
