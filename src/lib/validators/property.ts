import { z } from "zod";

export const addressSchema = z.object({
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
});

export const operationalSchema = z.object({
  wifi_network: z.string(),
  wifi_password: z.string(),
  is_self_checkin: z.boolean(),
  property_access_type: z.string(),
  property_access_instructions: z.string(),
  property_password: z.string().optional(),
  has_parking_spot: z.boolean(),
  parking_spot_identifier: z.string().optional(),
  parking_spot_instructions: z.string().optional(),
});

export const rulesSchema = z.object({
  check_in_time: z.string(),
  check_out_time: z.string(),
  allow_pet: z.boolean(),
  smoking_permitted: z.boolean(),
  suitable_for_children: z.boolean(),
  suitable_for_babies: z.boolean(),
  events_permitted: z.boolean(),
});

export const hostSchema = z.object({
  name: z.string(),
  phone: z.string(),
});

export const propertySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  propertyType: z.string(),
  bedroomQuantity: z.number(),
  bathroomQuantity: z.number(),
  guestCapacity: z.number(),
  address: addressSchema,
  operational: operationalSchema,
  rules: rulesSchema,
  amenities: z.record(z.string(), z.boolean()),
  images: z.array(z.string().url()),
  host: hostSchema,
});

export type Address = z.infer<typeof addressSchema>;
export type Operational = z.infer<typeof operationalSchema>;
export type StayRules = z.infer<typeof rulesSchema>;
export type Host = z.infer<typeof hostSchema>;
export type Property = z.infer<typeof propertySchema>;
