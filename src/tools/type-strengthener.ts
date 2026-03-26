import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerTypeStrengthenerTools(server: McpServer) {
  server.tool(
    "type_find_any",
    "Find all usages of 'any' type in TypeScript code and suggest proper types",
    {
      directory: z.string().describe("Project directory to scan"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "find_any_types",
            directory,
            instructions: "Search for all occurrences of the 'any' type in TypeScript files using patterns: (1) ': any' in type annotations, (2) 'as any' type assertions, (3) '<any>' generic parameters, (4) 'any[]' array types. For each occurrence, analyze the context to suggest a proper type: look at how the variable is used (what properties are accessed, what methods are called, what it's assigned to) and infer the correct type. Categorize by risk: high (any in function parameters/returns), medium (any in local variables), low (any in test files). Report file, line, current code, and suggested typed replacement.",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "type_suggest_generics",
    "Find functions that could benefit from generic types for better type safety",
    {
      directory: z.string().describe("Project directory to scan"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "suggest_generics",
            directory,
            instructions: "Find functions in TypeScript files that could benefit from generics: (1) Functions that accept 'any' or union types and return the same type (candidates for <T>), (2) Utility functions that operate on different data shapes (wrapper functions, transform functions), (3) Functions with type assertions that could be eliminated with generics, (4) Collection/container classes that hardcode a specific type. For each candidate, show the current signature and the improved generic version. Explain how generics improve type safety at call sites.",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "type_improve_interfaces",
    "Audit and improve TypeScript interfaces and type definitions (Pro feature)",
    {
      directory: z.string().describe("Project directory to scan"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [{
            type: "text" as const,
            text: "Interface improvement is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
          }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "improve_interfaces",
            directory,
            instructions: "Audit all TypeScript interfaces and types: (1) Find interfaces with optional properties that are always provided (should be required), (2) Find large interfaces that should be split (Interface Segregation Principle), (3) Find duplicate interfaces that define the same shape, (4) Find interfaces missing readonly on properties that are never mutated, (5) Suggest discriminated unions for interfaces that use type fields, (6) Find places using 'object' or '{}' type that should use specific interfaces, (7) Suggest utility types (Partial, Pick, Omit, Record) where appropriate. Provide the improved type definitions.",
          }, null, 2),
        }],
      };
    }
  );
}
