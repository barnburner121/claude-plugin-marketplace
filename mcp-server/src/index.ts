#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerEnvGuardianTools } from "./tools/env-guardian.js";
import { registerApiForgeTools } from "./tools/api-forge.js";
import { registerLogSleuthTools } from "./tools/log-sleuth.js";
import { registerPerfPilotTools } from "./tools/perf-pilot.js";
import { registerPipelineOpsTools } from "./tools/pipeline-ops.js";
import { registerDepShieldTools } from "./tools/dep-shield.js";
import { registerCostHawkTools } from "./tools/cost-hawk.js";
import { registerSchemaDriftTools } from "./tools/schema-drift.js";
import { registerNotifyHubTools } from "./tools/notify-hub.js";
import { registerUptimeSentinelTools } from "./tools/uptime-sentinel.js";

const server = new McpServer({
  name: "plugin-hub",
  version: "1.0.0",
});

// Register all tool namespaces
registerEnvGuardianTools(server);
registerApiForgeTools(server);
registerLogSleuthTools(server);
registerPerfPilotTools(server);
registerPipelineOpsTools(server);
registerDepShieldTools(server);
registerCostHawkTools(server);
registerSchemaDriftTools(server);
registerNotifyHubTools(server);
registerUptimeSentinelTools(server);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
