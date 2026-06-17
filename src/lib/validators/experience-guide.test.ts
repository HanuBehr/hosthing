import { describe, expect, it } from "vitest";

import { experienceGuideFixture } from "@/test/fixtures";
import { experienceGuideSchema } from "@/lib/validators/experience-guide";

describe("experienceGuideSchema", () => {
  it("accepts a complete guide with the required sections", () => {
    expect(() => experienceGuideSchema.parse(experienceGuideFixture)).not.toThrow();
  });

  it("rejects guides with too few restaurants", () => {
    const invalidGuide = {
      ...experienceGuideFixture,
      restaurants: experienceGuideFixture.restaurants.slice(0, 2),
    };

    expect(() => experienceGuideSchema.parse(invalidGuide)).toThrow();
  });
});
