import { prisma } from "@/lib/db/prisma";
import { getCatalogReservationForProperty } from "@/lib/property-catalog";
import {
  reservationSchema,
  type Reservation,
} from "@/lib/validators/reservation";

export async function getReservationForProperty(
  propertyId: string,
): Promise<Reservation | null> {
  const reservation = await prisma.reservation.findFirst({
    where: {
      propertyId,
      status: "confirmed",
    },
    orderBy: {
      checkInDate: "asc",
    },
  }).catch(() => null);

  if (!reservation) {
    return getCatalogReservationForProperty(propertyId);
  }

  return reservationSchema.parse(reservation);
}
