import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCliBuilderTools(server) {
    server.tool("cli_generate_scaffold", "Generate a CLI application scaffold with argument parsing, configuration, and project structure", {
        name: z.string().describe("CLI tool name"),
        language: z.enum(["typescript", "python", "go", "rust"]).describe("Implementation language"),
        framework: z.string().optional().describe("CLI framework (e.g. commander, click, cobra, clap)"),
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
                        action: "generate_cli_scaffold",
                        instructions: `Generate a CLI application scaffold named '${params.name}' in ${params.language}${params.framework ? ` using ${params.framework}` : ""}. Include project structure, entry point, argument parser setup, configuration file loading, and package/build configuration.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("cli_add_commands", "Add subcommands with options, arguments, and validation to an existing CLI", {
        cli_name: z.string().describe("CLI tool name"),
        commands: z.array(z.object({
            name: z.string().describe("Command name"),
            description: z.string().describe("Command description"),
            options: z.array(z.string()).optional().describe("Command options"),
        })).describe("Commands to add"),
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
                        action: "add_cli_commands",
                        instructions: `Add ${params.commands.length} command(s) to CLI '${params.cli_name}': ${params.commands.map((c) => `'${c.name}' (${c.description})`).join(", ")}. Include option parsing, input validation, error handling, and output formatting for each command.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("cli_add_help", "Generate comprehensive help text, man pages, and shell completions for a CLI (Pro)", {
        cli_name: z.string().describe("CLI tool name"),
        shells: z.array(z.enum(["bash", "zsh", "fish", "powershell"])).optional().describe("Shells to generate completions for"),
        include_manpage: z.boolean().optional().describe("Generate a man page"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier !== "pro") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: "This tool requires a Pro subscription." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_cli_help",
                        instructions: `Generate help system for CLI '${params.cli_name}'. ${params.shells ? `Create shell completions for: ${params.shells.join(", ")}.` : ""} ${params.include_manpage ? "Generate a man page." : ""} Include usage examples, option descriptions, environment variable documentation, and exit code reference.`,
                    }, null, 2),
                },
            ],
        };
    });
}
