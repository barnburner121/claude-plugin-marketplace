export type Tier = "free" | "pro" | "enterprise";
export declare function getTier(apiKey?: string): Tier;
export declare function checkRateLimit(apiKey?: string): {
    allowed: boolean;
    tier: Tier;
    remaining: number;
};
export declare function rateLimitError(tier: Tier): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
