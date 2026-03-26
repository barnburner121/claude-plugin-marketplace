import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerE2eScenarioTools(server: McpServer) {
  server.tool(
    "e2e_generate_scenarios",
    "Generate end-to-end test scenarios from user stories or feature descriptions",
    {
      feature_description: z.string().describe("User story or feature description to generate E2E scenarios from"),
      app_type: z.string().optional().describe("Application type: 'web', 'mobile', 'api'"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_e2e_scenarios",
                instructions:
                  "Analyze the provided feature description and generate comprehensive end-to-end test scenarios. Cover the happy path, error paths, edge cases, and cross-feature interactions. Write scenarios in Given/When/Then format with clear preconditions, actions, and expected outcomes. Include data setup requirements for each scenario.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "e2e_generate_playwright",
    "Generate Playwright test code from E2E test scenarios",
    {
      scenarios: z.string().describe("E2E test scenarios in Given/When/Then or plain text format"),
      base_url: z.string().optional().describe("Base URL of the application under test"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_playwright_tests",
                instructions:
                  "Convert the provided E2E scenarios into Playwright test code. Use the Page Object Model pattern for maintainability. Include proper test setup with beforeEach/afterEach hooks, use locators with accessible selectors (getByRole, getByLabel, getByText), add assertions with expect(), and handle async operations with proper awaits. Include test configuration for multiple browsers.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "e2e_generate_cypress",
    "Generate Cypress test code from E2E test scenarios (Pro)",
    {
      scenarios: z.string().describe("E2E test scenarios in Given/When/Then or plain text format"),
      base_url: z.string().optional().describe("Base URL of the application under test"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  action: "upgrade_required",
                  instructions:
                    "This tool requires a Pro subscription. Upgrade to Pro to generate Cypress test code from your E2E scenarios with custom commands and interceptors.",
                },
                null,
                2
              ),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_cypress_tests",
                instructions:
                  "Convert the provided E2E scenarios into Cypress test code. Use cy.intercept() for API mocking, create custom commands for reusable actions, use data-cy attributes for selectors, and include proper test isolation with beforeEach hooks. Add retry logic for flaky assertions and configure viewport settings for responsive testing.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
