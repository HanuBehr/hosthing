const usageBuckets = new Map<string, { windowStartedAt: number; count: number; tokens: number }>();

export type AiLimitConfig = {
  maxMessages: number;
  maxInputChars: number;
  maxOutputTokens: number;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  tokenBudgetPerWindow: number;
};

export function getAiLimitConfig(): AiLimitConfig {
  return {
    maxMessages: readPositiveInteger("AI_CHAT_MAX_MESSAGES", 12),
    maxInputChars: readPositiveInteger("AI_CHAT_MAX_INPUT_CHARS", 4000),
    maxOutputTokens: readPositiveInteger("AI_CHAT_MAX_OUTPUT_TOKENS", 500),
    rateLimitWindowMs: readPositiveInteger("AI_CHAT_RATE_LIMIT_WINDOW_MS", 60_000),
    rateLimitMax: readPositiveInteger("AI_CHAT_RATE_LIMIT_MAX", 12),
    tokenBudgetPerWindow: readPositiveInteger("AI_CHAT_TOKEN_BUDGET_PER_WINDOW", 6000),
  };
}

export function enforceAiLimits({
  key,
  messages,
  now = Date.now(),
  config = getAiLimitConfig(),
}: {
  key: string;
  messages: Array<{ content: string }>;
  now?: number;
  config?: AiLimitConfig;
}) {
  if (messages.length > config.maxMessages) {
    return { allowed: false as const, reason: "Too many messages in this chat request." };
  }

  const inputChars = messages.reduce((sum, message) => sum + message.content.length, 0);
  if (inputChars > config.maxInputChars) {
    return { allowed: false as const, reason: "This question is too long for the assistant." };
  }

  const estimatedTokens = estimateTokens(inputChars) + config.maxOutputTokens;
  const current = usageBuckets.get(key);
  const bucket =
    current && now - current.windowStartedAt < config.rateLimitWindowMs
      ? current
      : { windowStartedAt: now, count: 0, tokens: 0 };

  if (bucket.count >= config.rateLimitMax) {
    usageBuckets.set(key, bucket);
    return { allowed: false as const, reason: "The assistant rate limit was reached. Please try again shortly." };
  }

  if (bucket.tokens + estimatedTokens > config.tokenBudgetPerWindow) {
    usageBuckets.set(key, bucket);
    return { allowed: false as const, reason: "The assistant token budget was reached. Please try again shortly." };
  }

  usageBuckets.set(key, {
    ...bucket,
    count: bucket.count + 1,
    tokens: bucket.tokens + estimatedTokens,
  });

  return { allowed: true as const, maxOutputTokens: config.maxOutputTokens };
}

export function resetAiLimitBuckets() {
  usageBuckets.clear();
}

function estimateTokens(chars: number) {
  return Math.ceil(chars / 4);
}

function readPositiveInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}
