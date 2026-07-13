import { prisma } from "@/lib/db/prisma";

export async function recordAuditEvent({
  propertyId,
  reservationId,
  eventType,
  metadata,
}: {
  propertyId: string;
  reservationId?: string;
  eventType: "guide_access" | "assistant_question";
  metadata?: Record<string, string | number | boolean | null>;
}) {
  await prisma.auditEvent.create({
    data: {
      propertyId,
      reservationId,
      eventType,
      metadata,
    },
  }).catch(() => null);
}
