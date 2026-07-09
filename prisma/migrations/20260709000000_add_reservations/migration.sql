CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "reservationCode" TEXT NOT NULL,
  "guestName" TEXT NOT NULL,
  "checkInDate" TIMESTAMP(3) NOT NULL,
  "checkOutDate" TIMESTAMP(3) NOT NULL,
  "guestCount" INTEGER NOT NULL,
  "cleaningFee" DECIMAL(10, 2) NOT NULL,
  "currency" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Reservation_reservationCode_key" ON "Reservation"("reservationCode");

CREATE INDEX "Reservation_propertyId_idx" ON "Reservation"("propertyId");

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
