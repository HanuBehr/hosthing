import { describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  auditEvent: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMock,
}));

import { recordAuditEvent } from "@/server/audit";

describe("recordAuditEvent", () => {
  it("creates guide access and assistant question audit records", async () => {
    prismaMock.auditEvent.create.mockResolvedValue({});

    await recordAuditEvent({
      propertyId: "property-1",
      reservationId: "reservation-1",
      eventType: "assistant_question",
      metadata: { messageLength: 24 },
    });

    expect(prismaMock.auditEvent.create).toHaveBeenCalledWith({
      data: {
        propertyId: "property-1",
        reservationId: "reservation-1",
        eventType: "assistant_question",
        metadata: { messageLength: 24 },
      },
    });
  });
});
