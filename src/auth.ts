// Tier-based access control and rate limiting for the freemium model

export type Tier = "free" | "pro" | "enterprise";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const FREE_DAILY_LIMIT = 50;
const PRO_DAILY_LIMIT = 10_000;

const rateLimits = new Map<string, RateLimitRecord>();

export function getTier(apiKey?: string): Tier {
  if (!apiKey) return "free";
  if (apiKey.startsWith("ent_")) return "enterprise";
  if (apiKey.startsWith("pro_")) return "pro";
  return "free";
}

export function checkRateLimit(apiKey?: string): {
  allowed: boolean;
  tier: Tier;
  remaining: number;
} {
  const tier = getTier(apiKey);
  const limit =
    tier === "enterprise"
      ? Infinity
      : tier === "pro"
        ? PRO_DAILY_LIMIT
        : FREE_DAILY_LIMIT;

  const key = apiKey ?? "anonymous";
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + 86_400_000 });
    return { allowed: true, tier, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, tier, remaining: 0 };
  }

  record.count++;
  return { allowed: true, tier, remaining: limit - record.count };
}

export function rateLimitError(tier: Tier): {
  content: Array<{ type: "text"; text: string }>;
} {
  const upgradeMsg =
    tier === "free"
      ? "Upgrade to Pro for 10,000 requests/day. Visit https://mcpize.com/barnburner121/plugin-hub"
      : "Contact us for enterprise limits.";
  return {
    content: [
      {
        type: "text" as const,
        text: `Rate limit exceeded (${tier} tier). ${upgradeMsg}`,
      },
    ],
  };
}
