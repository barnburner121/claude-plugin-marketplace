import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDevcontainerTools(server) {
    server.tool("devcontainer_generate", "Generate a devcontainer.json configuration for a consistent development environment", {
        name: z.string().describe("Devcontainer name"),
        base_image: z.enum(["node", "python", "go", "rust", "java", "dotnet", "universal"]).describe("Base development image"),
        node_version: z.string().optional().describe("Node.js version if applicable"),
        features: z.array(z.string()).optional().describe("Dev container features to include (e.g. docker-in-docker, git)"),
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
                        action: "generate_devcontainer",
                        instructions: `Generate a devcontainer.json named '${params.name}' using the ${params.base_image} base image. ${params.node_version ? `Node.js version: ${params.node_version}.` : ""} ${params.features ? `Include features: ${params.features.join(", ")}.` : ""} Include forwarded ports, mount configurations, post-create commands, and remote user settings.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("devcontainer_add_extensions", "Add VS Code extensions and editor settings to a devcontainer configuration", {
        extensions: z.array(z.string()).describe("VS Code extension IDs to add"),
        settings: z.record(z.unknown()).optional().describe("VS Code settings to configure"),
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
                        action: "add_devcontainer_extensions",
                        instructions: `Add VS Code extensions to devcontainer: ${params.extensions.join(", ")}. ${params.settings ? "Apply custom editor settings." : ""} Include extension recommendations, workspace settings, and keybinding configurations.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("devcontainer_configure", "Configure advanced devcontainer features like Docker Compose, networking, and secrets (Pro)", {
        compose_services: z.array(z.string()).optional().describe("Docker Compose services to include (e.g. postgres, redis)"),
        env_files: z.array(z.string()).optional().describe("Environment files to load"),
        volumes: z.array(z.string()).optional().describe("Named volumes to mount"),
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
                        action: "configure_devcontainer_advanced",
                        instructions: `Configure advanced devcontainer settings. ${params.compose_services ? `Add Docker Compose services: ${params.compose_services.join(", ")}.` : ""} ${params.env_files ? `Load environment files: ${params.env_files.join(", ")}.` : ""} ${params.volumes ? `Mount volumes: ${params.volumes.join(", ")}.` : ""} Include networking, health checks, init scripts, and secret management.`,
                    }, null, 2),
                },
            ],
        };
    });
}
