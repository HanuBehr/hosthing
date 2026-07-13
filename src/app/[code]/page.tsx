import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyGuide } from "@/components/property/property-guide";
import { redactPrivatePropertyData } from "@/lib/security/redaction";
import { verifyGuestAccessToken } from "@/lib/security/guest-access";
import { recordAuditEvent } from "@/server/audit";
import { getPropertyByCode } from "@/server/properties";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams?: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const property = await getPropertyByCode(code);

  if (!property) {
    return {
      title: "Guide not found | Hosthing",
    };
  }

  return {
    title: `${property.name} | Guest Guide`,
    description: `Guest guide for ${property.address.city}/${property.address.state}.`,
  };
}

export default async function GuestGuidePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { token } = (await searchParams) ?? {};
  const property = await getPropertyByCode(code);

  if (!property) {
    notFound();
  }

  const guestAccess = await verifyGuestAccessToken(token, property.id);
  const hasGuestAccess = Boolean(guestAccess);
  const reservation = guestAccess?.reservation ?? null;
  const visibleProperty = hasGuestAccess
    ? property
    : redactPrivatePropertyData(property);

  await recordAuditEvent({
    propertyId: property.id,
    reservationId: reservation?.id,
    eventType: "guide_access",
    metadata: { hasGuestAccess },
  });

  return (
    <PropertyGuide
      property={visibleProperty}
      reservation={reservation}
      accessToken={hasGuestAccess ? token : undefined}
    />
  );
}
