import { describe, expect, it } from "vitest";

import { enforceAiLimits, resetAiLimitBuckets } from "@/lib/ai/limits";

describe("enforceAiLimits", () => {
  it("blocks requests that exceed message limits", () => {
    resetAiLimitBuckets();

    const result = enforceAiLimits({
      key: "limit-test",
      messages: [{ content: "one" }, { content: "two" }],
      config: {
        maxMessages: 1,
        maxInputChars: 100,
        maxOutputTokens: 50,
        rateLimitWindowMs: 60_000,
        rateLimitMax: 10,
        tokenBudgetPerWindow: 1000,
      },
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Too many messages");
  });

  it("enforces rate and token budgets per key", () => {
    resetAiLimitBuckets();

    const config = {
      maxMessages: 10,
      maxInputChars: 100,
      maxOutputTokens: 50,
      rateLimitWindowMs: 60_000,
      rateLimitMax: 1,
      tokenBudgetPerWindow: 1000,
    };

    expect(enforceAiLimits({ key: "guest-a", messages: [{ content: "hello" }], config }).allowed).toBe(true);
    const blocked = enforceAiLimits({ key: "guest-a", messages: [{ content: "again" }], config });

    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toContain("rate limit");
  });
});
