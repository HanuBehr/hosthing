import { describe, expect, it } from "vitest";

import {
  formatHour,
  formatRule,
  getEnabledAmenities,
  getFullAddress,
} from "@/lib/format";
import { propertyFixture } from "@/test/fixtures";

describe("format helpers", () => {
  it("formats check-in and check-out hours for guests", () => {
    expect(formatHour("15:00")).toBe("15:00");
  });

  it("maps boolean rules to guest-friendly labels", () => {
    expect(formatRule(false, "Pets allowed", "Pets not allowed")).toBe(
      "Pets not allowed",
    );
  });

  it("formats the full address with complement", () => {
    expect(getFullAddress(propertyFixture)).toBe(
      "Hickson Road, 23, Apt 1204 - The Rocks, Sydney/NSW, 2000",
    );
  });

  it("returns only enabled amenities with readable labels", () => {
    expect(getEnabledAmenities(propertyFixture)).toEqual([
      "WiFi",
      "TV",
      "Air conditioning",
    ]);
  });
});
