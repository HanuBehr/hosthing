import { describe, expect, it } from "vitest";

import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { experienceGuideFixture, propertyFixture } from "@/test/fixtures";

describe("buildChatSystemPrompt", () => {
  it("includes the critical property facts required by the chat", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("SeaHome_FLN001");
    expect(prompt).toContain("floripa2024");
    expect(prompt).toContain("Check-in: 15:00");
    expect(prompt).toContain("Pets: Nao permitido");
    expect(prompt).toContain("Restaurante Meu Cantinho");
  });

  it("instructs the assistant not to invent missing information", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, null);

    expect(prompt).toContain("Nunca invente");
    expect(prompt).toContain("Ainda nao ha guia de experiencias");
  });
});
