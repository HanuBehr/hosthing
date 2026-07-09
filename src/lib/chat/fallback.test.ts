import { describe, expect, it } from "vitest";

import { buildFallbackAnswer } from "@/lib/chat/fallback";
import {
  experienceGuideFixture,
  propertyFixture,
  reservationFixture,
} from "@/test/fixtures";

describe("buildFallbackAnswer", () => {
  it("answers WiFi questions from property data", () => {
    const answer = buildFallbackAnswer(
      propertyFixture,
      experienceGuideFixture,
      reservationFixture,
      "What is the WiFi password?",
    );

    expect(answer).toContain("HarbourLoft_SYD");
    expect(answer).toContain("harbour2026");
  });

  it("answers reservation number questions from reservation data", () => {
    const answer = buildFallbackAnswer(
      propertyFixture,
      experienceGuideFixture,
      reservationFixture,
      "What is my reservation number?",
    );

    expect(answer).toContain("RSV-SYD-24091");
    expect(answer).toContain("Amelia Hart");
  });

  it("answers cleaning fee questions from reservation data", () => {
    const answer = buildFallbackAnswer(
      propertyFixture,
      experienceGuideFixture,
      reservationFixture,
      "How much is the cleaning fee?",
    );

    expect(answer).toContain("A$145.00");
  });

  it("does not invent booking details when reservation data is missing", () => {
    const answer = buildFallbackAnswer(
      propertyFixture,
      experienceGuideFixture,
      null,
      "What is my reservation number and cleaning fee?",
    );

    expect(answer).toContain("do not have reservation details");
    expect(answer).not.toContain("RSV-SYD-24091");
    expect(answer).not.toContain("A$145.00");
  });

  it("answers restaurant questions from the generated guide", () => {
    const answer = buildFallbackAnswer(
      propertyFixture,
      experienceGuideFixture,
      reservationFixture,
      "What restaurants are nearby?",
    );

    expect(answer).toContain("Quay Restaurant");
    expect(answer).toContain("The Glenmore Hotel");
    expect(answer).toContain("google.com/maps/search");
  });
});
