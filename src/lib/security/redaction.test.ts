import { describe, expect, it } from "vitest";

import { redactPrivatePropertyData } from "@/lib/security/redaction";
import { propertyFixture } from "@/test/fixtures";

describe("redactPrivatePropertyData", () => {
  it("removes private arrival and host contact data from public guide views", () => {
    const property = redactPrivatePropertyData(propertyFixture);

    expect(property.operational.wifi_password).not.toBe(propertyFixture.operational.wifi_password);
    expect(property.operational.property_password).toBeUndefined();
    expect(property.operational.property_access_instructions).not.toContain("4826");
    expect(property.host.phone).not.toBe(propertyFixture.host.phone);
  });
});
