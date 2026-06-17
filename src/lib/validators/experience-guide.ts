import { z } from "zod";

export const placeSchema = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  description: z.string().min(1),
});

export const essentialServiceSchema = placeSchema.extend({
  type: z.enum(["pharmacy", "supermarket", "hospital", "other"]),
});

export const experienceGuideSchema = z.object({
  welcome_message: z.string().min(1),
  restaurants: z.array(placeSchema).min(4).max(5),
  attractions: z.array(placeSchema).min(3).max(4),
  essentials: z.array(essentialServiceSchema).min(3),
  seasonal_tips: z.string().min(1),
});

export type ExperienceGuide = z.infer<typeof experienceGuideSchema>;
