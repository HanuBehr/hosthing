CREATE TABLE "GuestAccessToken" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "GuestAccessToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reservationId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GuestAccessToken_tokenHash_key" ON "GuestAccessToken"("tokenHash");
CREATE INDEX "GuestAccessToken_reservationId_idx" ON "GuestAccessToken"("reservationId");
CREATE INDEX "GuestAccessToken_expiresAt_idx" ON "GuestAccessToken"("expiresAt");
CREATE INDEX "AuditEvent_propertyId_idx" ON "AuditEvent"("propertyId");
CREATE INDEX "AuditEvent_reservationId_idx" ON "AuditEvent"("reservationId");
CREATE INDEX "AuditEvent_eventType_idx" ON "AuditEvent"("eventType");

ALTER TABLE "GuestAccessToken" ADD CONSTRAINT "GuestAccessToken_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
