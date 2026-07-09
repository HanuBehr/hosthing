import { prisma } from "@/lib/db/prisma";
import {
  reservationSchema,
  type Reservation,
} from "@/lib/validators/reservation";

export async function getDemoReservationForProperty(
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
  });

  if (!reservation) {
    return null;
  }

  return reservationSchema.parse(reservation);
}
