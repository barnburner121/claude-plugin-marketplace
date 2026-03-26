import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerChangelogGenTools(server) {
    server.tool("changelog_from_commits", "Generate a changelog from git commit messages following conventional commits format", {
        commits: z.string().describe("Git commit log output or list of commit messages"),
        version: z.string().optional().describe("Version number for this changelog entry"),
        group_by: z.string().optional().describe("Grouping strategy: 'type', 'scope', or 'date'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_changelog_from_commits",
                        instructions: "Parse the provided git commit messages and categorize them by type (feat, fix, chore, docs, refactor, etc.). Generate a changelog in Keep a Changelog format, grouping entries under Added, Changed, Fixed, Removed, etc. Include the version number and date. Filter out irrelevant commits like merge commits.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("changelog_from_prs", "Generate a changelog from pull request titles and descriptions", {
        pull_requests: z.string().describe("JSON array of pull request data with titles, descriptions, and labels"),
        version: z.string().optional().describe("Version number for this changelog entry"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_changelog_from_prs",
                        instructions: "Parse the provided pull request data and generate a structured changelog. Group PRs by their labels (feature, bugfix, enhancement, breaking change, etc.). Extract meaningful descriptions from PR titles and bodies. Format the output in Keep a Changelog style with proper categorization and attribution.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("changelog_format", "Reformat and standardize an existing changelog to follow best practices (Pro)", {
        changelog_content: z.string().describe("Existing changelog content to reformat"),
        format: z.string().optional().describe("Target format: 'keepachangelog', 'conventional', or 'github-releases'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            action: "upgrade_required",
                            instructions: "This tool requires a Pro subscription. Upgrade to Pro to reformat and standardize changelogs across different formats and conventions.",
                        }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "format_changelog",
                        instructions: "Parse the existing changelog content regardless of its current format. Normalize all entries, fix inconsistent formatting, ensure proper date formats, and restructure the content to follow the target format specification. Preserve all existing information while improving readability and consistency.",
                    }, null, 2),
                },
            ],
        };
    });
}
