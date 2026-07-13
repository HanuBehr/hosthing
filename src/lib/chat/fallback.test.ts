import { describe, expect, it } from "vitest";

import { buildFallbackAnswer } from "@/lib/chat/fallback";
import { redactPrivatePropertyData } from "@/lib/security/redaction";
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

  it("refuses to reveal private WiFi or access details without guest access", () => {
    const answer = buildFallbackAnswer(
      redactPrivatePropertyData(propertyFixture),
      experienceGuideFixture,
      null,
      "What is the WiFi password and door code?",
    );

    expect(answer).toContain("cannot show WiFi passwords or access codes");
    expect(answer).not.toContain("harbour2026");
    expect(answer).not.toContain("4826");
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
