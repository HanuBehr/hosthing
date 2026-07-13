import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/db/prisma";
import { reservationSchema, type Reservation } from "@/lib/validators/reservation";

const tokenVersion = "v1";
const defaultTtlDays = 14;

export type GuestAccess = {
  reservation: Reservation;
  tokenHash: string;
  expiresAt: Date;
};

export function getGuestLinkSecret() {
  return process.env.GUEST_LINK_SECRET?.trim() || "hosthing-local-demo-secret";
}

export function hashGuestAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function signGuestAccessToken({
  reservationId,
  expiresAt,
  nonce = randomBytes(16).toString("base64url"),
}: {
  reservationId: string;
  expiresAt: Date;
  nonce?: string;
}) {
  const payload = [tokenVersion, reservationId, expiresAt.getTime(), nonce].join(".");
  const signature = createHmac("sha256", getGuestLinkSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function createGuestAccessToken(
  reservationId: string,
  ttlDays = defaultTtlDays,
) {
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  const token = signGuestAccessToken({ reservationId, expiresAt });

  await prisma.guestAccessToken.create({
    data: {
      reservationId,
      tokenHash: hashGuestAccessToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function verifyGuestAccessToken(
  token: string | null | undefined,
  propertyId?: string,
): Promise<GuestAccess | null> {
  const parsed = parseSignedToken(token);
  if (!parsed) return null;

  const tokenHash = hashGuestAccessToken(parsed.token);
  const record = await prisma.guestAccessToken.findUnique({
    where: { tokenHash },
    include: { reservation: true },
  }).catch(() => null);

  if (!record || record.revokedAt || record.expiresAt <= new Date()) return null;
  if (record.reservationId !== parsed.reservationId) return null;
  if (propertyId && record.reservation.propertyId !== propertyId) return null;

  await prisma.guestAccessToken.update({
    where: { tokenHash },
    data: { lastUsedAt: new Date() },
  }).catch(() => null);

  return {
    reservation: reservationSchema.parse(record.reservation),
    tokenHash,
    expiresAt: record.expiresAt,
  };
}

function parseSignedToken(token: string | null | undefined) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 5) return null;

  const [version, reservationId, expiresAtText, nonce, signature] = parts;
  if (version !== tokenVersion || !reservationId || !nonce) return null;

  const expiresAtMs = Number(expiresAtText);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return null;

  const payload = [version, reservationId, expiresAtText, nonce].join(".");
  const expected = createHmac("sha256", getGuestLinkSecret())
    .update(payload)
    .digest("base64url");

  if (!safeEqual(signature, expected)) return null;

  return { token, reservationId };
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}
