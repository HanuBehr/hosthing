import { describe, expect, it } from "vitest";

import { buildChatSystemPrompt, buildExperienceGuidePrompt } from "@/lib/ai/prompts";
import { experienceGuideFixture, propertyFixture } from "@/test/fixtures";

describe("buildChatSystemPrompt", () => {
  it("includes the critical property facts required by the chat", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("HarbourLoft_SYD");
    expect(prompt).toContain("harbour2026");
    expect(prompt).toContain("Check-in: 15:00");
    expect(prompt).toContain("Pets: Not allowed");
    expect(prompt).toContain("Quay Restaurant");
  });

  it("instructs the assistant not to invent missing information", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, null);

    expect(prompt).toContain("If operational data is missing");
    expect(prompt).toContain("Never invent");
    expect(prompt).toContain("There is no generated experience guide");
  });

  it("allows public local knowledge without redirecting to the host", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("public questions about the current property's area");
    expect(prompt).toContain("history, culture, cuisine");
    expect(prompt).toContain("Do not redirect public local questions");
    expect(prompt).toContain("answer like a normal local assistant");
    expect(prompt).toContain("even if the topic is not listed in the EXPERIENCE GUIDE");
  });

  it("locks recommendations to the current property location", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("MANDATORY CURRENT PAGE SCOPE");
    expect(prompt).toContain("This conversation belongs exclusively to property SYD001");
    expect(prompt).toContain("The Rocks, Sydney/NSW");
    expect(prompt).toContain("Never answer as if the guest were in another code");
    expect(prompt).toContain("ignore that conflicting information");
  });

  it("asks for complete local answers with maps context", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("recommend at least 3 options");
    expect(prompt).toContain("do not claim an absolute ranking");
    expect(prompt).toContain("include a practical way to find it on Google Maps");
    expect(prompt).toContain("Google Maps");
    expect(prompt).toContain("airport, distance, transport, or travel-time questions");
    expect(prompt).toContain("from the current property address");
    expect(prompt).toContain("practical guest questions about this property");
    expect(prompt).toContain("ride-share/taxi");
  });
});

describe("buildExperienceGuidePrompt", () => {
  it("requires recommendations near the exact property address", () => {
    const prompt = buildExperienceGuidePrompt(propertyFixture);

    expect(prompt).toContain("The current property is only this one: SYD001");
    expect(prompt).toContain("Hickson Road, 23");
    expect(prompt).toContain("Do not recommend places from another city");
    expect(prompt).toContain("from the current property address");
  });
});
