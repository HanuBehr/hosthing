import { beforeEach, describe, expect, it, vi } from "vitest";

import { reservationFixture } from "@/test/fixtures";

const prismaMock = vi.hoisted(() => ({
  guestAccessToken: {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMock,
}));

import {
  hashGuestAccessToken,
  signGuestAccessToken,
  verifyGuestAccessToken,
} from "@/lib/security/guest-access";

describe("guest access tokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates a stored signed token scoped to a reservation", async () => {
    const expiresAt = new Date(Date.now() + 60_000);
    const token = signGuestAccessToken({
      reservationId: reservationFixture.id,
      expiresAt,
      nonce: "test-nonce",
    });

    prismaMock.guestAccessToken.findUnique.mockResolvedValueOnce({
      reservationId: reservationFixture.id,
      tokenHash: hashGuestAccessToken(token),
      expiresAt,
      revokedAt: null,
      reservation: reservationFixture,
    });
    prismaMock.guestAccessToken.update.mockResolvedValueOnce({});

    const access = await verifyGuestAccessToken(token, reservationFixture.propertyId);

    expect(access?.reservation.reservationCode).toBe(reservationFixture.reservationCode);
    expect(access?.tokenHash).toBe(hashGuestAccessToken(token));
  });

  it("rejects expired tokens before loading private data", async () => {
    const token = signGuestAccessToken({
      reservationId: reservationFixture.id,
      expiresAt: new Date(Date.now() - 60_000),
      nonce: "expired-test-nonce",
    });

    const access = await verifyGuestAccessToken(token, reservationFixture.propertyId);

    expect(access).toBeNull();
    expect(prismaMock.guestAccessToken.findUnique).not.toHaveBeenCalled();
  });
});
