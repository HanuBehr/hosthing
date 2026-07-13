import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  experienceGuideFixture,
  propertyFixture,
  reservationFixture,
} from "@/test/fixtures";
import { resetAiLimitBuckets } from "@/lib/ai/limits";

const mocks = vi.hoisted(() => ({
  getPropertyByCode: vi.fn(),
  getExperienceGuideForProperty: vi.fn(),
  verifyGuestAccessToken: vi.fn(),
  recordAuditEvent: vi.fn(),
}));

vi.mock("@/server/properties", () => ({
  getPropertyByCode: mocks.getPropertyByCode,
}));

vi.mock("@/server/experience-guides", () => ({
  getExperienceGuideForProperty: mocks.getExperienceGuideForProperty,
}));

vi.mock("@/lib/security/guest-access", () => ({
  verifyGuestAccessToken: mocks.verifyGuestAccessToken,
}));

vi.mock("@/server/audit", () => ({
  recordAuditEvent: mocks.recordAuditEvent,
}));

import { POST } from "@/app/api/chat/route";

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAiLimitBuckets();
    process.env.OPENAI_API_KEY = "";
    mocks.getPropertyByCode.mockResolvedValue(propertyFixture);
    mocks.getExperienceGuideForProperty.mockResolvedValue(experienceGuideFixture);
    mocks.verifyGuestAccessToken.mockResolvedValue({
      reservation: reservationFixture,
      tokenHash: "token-hash",
      expiresAt: new Date(Date.now() + 60_000),
    });
  });

  it("streams deterministic fallback text when OpenAI is unavailable", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          propertyCode: propertyFixture.code,
          accessToken: "signed-token",
          messages: [{ role: "user", content: "What is my reservation number?" }],
        }),
      }),
    );

    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toContain(reservationFixture.reservationCode);
    expect(mocks.recordAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: "assistant_question" }),
    );
  });

  it("does not load private reservation context without a valid token", async () => {
    mocks.verifyGuestAccessToken.mockResolvedValueOnce(null);

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          propertyCode: propertyFixture.code,
          messages: [{ role: "user", content: "What is my cleaning fee?" }],
        }),
      }),
    );

    const text = await response.text();

    expect(text).toContain("do not have fee details");
    expect(text).not.toContain("A$145.00");
  });
});
