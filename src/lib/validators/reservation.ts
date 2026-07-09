import { z } from "zod";

export const reservationSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  reservationCode: z.string(),
  guestName: z.string(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  guestCount: z.number(),
  cleaningFee: z.coerce.number(),
  currency: z.string(),
  status: z.string(),
});

export type Reservation = z.infer<typeof reservationSchema>;
