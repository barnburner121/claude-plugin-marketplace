#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { registerA11yFixerTools } from "./tools/a11y-fixer.js";
import { registerApiDocsTools } from "./tools/api-docs.js";
import { registerApiForgeTools } from "./tools/api-forge.js";
import { registerArchitectureDocsTools } from "./tools/architecture-docs.js";
import { registerAuditTrailTools } from "./tools/audit-trail.js";
import { registerAuthArchitectTools } from "./tools/auth-architect.js";
import { registerBundleAnalyzerTools } from "./tools/bundle-analyzer.js";
import { registerCacheArchitectTools } from "./tools/cache-architect.js";
import { registerChangelogGenTools } from "./tools/changelog-gen.js";
import { registerCircuitBreakerTools } from "./tools/circuit-breaker.js";
import { registerCliBuilderTools } from "./tools/cli-builder.js";
import { registerCloudflareWorkerTools } from "./tools/cloudflare-worker.js";
import { registerCodeSmellsTools } from "./tools/code-smells.js";
import { registerCommitLinterTools } from "./tools/commit-linter.js";
import { registerComplexityReducerTools } from "./tools/complexity-reducer.js";
import { registerContainerGuardTools } from "./tools/container-guard.js";
import { registerCostHawkTools } from "./tools/cost-hawk.js";
import { registerCoverageAnalyzerTools } from "./tools/coverage-analyzer.js";
import { registerCssOptimizerTools } from "./tools/css-optimizer.js";
import { registerDataAnonymizerTools } from "./tools/data-anonymizer.js";
import { registerDataGenTools } from "./tools/data-gen.js";
import { registerDeadCodeTools } from "./tools/dead-code.js";
import { registerDepShieldTools } from "./tools/dep-shield.js";
import { registerDevcontainerTools } from "./tools/devcontainer.js";
import { registerDisasterRecoveryTools } from "./tools/disaster-recovery.js";
import { registerDistributedTracingTools } from "./tools/distributed-tracing.js";
import { registerDockerComposeGenTools } from "./tools/docker-compose-gen.js";
import { registerDuplicationHunterTools } from "./tools/duplication-hunter.js";
import { registerDynamodbDesignerTools } from "./tools/dynamodb-designer.js";
import { registerE2eScenarioTools } from "./tools/e2e-scenario.js";
import { registerEnvGuardianTools } from "./tools/env-guardian.js";
import { registerErrorBoundaryTools } from "./tools/error-boundary.js";
import { registerEtlBuilderTools } from "./tools/etl-builder.js";
import { registerFeatureFlagTools } from "./tools/feature-flag.js";
import { registerFlakyTestFinderTools } from "./tools/flaky-test-finder.js";
import { registerFormBuilderTools } from "./tools/form-builder.js";
import { registerGdprToolkitTools } from "./tools/gdpr-toolkit.js";
import { registerGitWorkflowTools } from "./tools/git-workflow.js";
import { registerGithubActionsGenTools } from "./tools/github-actions-gen.js";
import { registerGraphqlBuilderTools } from "./tools/graphql-builder.js";
import { registerHelmChartTools } from "./tools/helm-chart.js";
import { registerI18nExtractorTools } from "./tools/i18n-extractor.js";
import { registerIacScannerTools } from "./tools/iac-scanner.js";
import { registerK8sManifestTools } from "./tools/k8s-manifest.js";
import { registerLambdaBuilderTools } from "./tools/lambda-builder.js";
import { registerLogSleuthTools } from "./tools/log-sleuth.js";
import { registerMakefileGenTools } from "./tools/makefile-gen.js";
import { registerMonitoringStackTools } from "./tools/monitoring-stack.js";
import { registerMultiTenantTools } from "./tools/multi-tenant.js";
import { registerNginxConfigTools } from "./tools/nginx-config.js";
import { registerNotifyHubTools } from "./tools/notify-hub.js";
import { registerOwaspCheckerTools } from "./tools/owasp-checker.js";
import { registerPaginationGenTools } from "./tools/pagination-gen.js";
import { registerPerfPilotTools } from "./tools/perf-pilot.js";
import { registerPipelineOpsTools } from "./tools/pipeline-ops.js";
import { registerProjectInitTools } from "./tools/project-init.js";
import { registerPwaBuilderTools } from "./tools/pwa-builder.js";
import { registerQueryOptimizerTools } from "./tools/query-optimizer.js";
import { registerQueueBuilderTools } from "./tools/queue-builder.js";
import { registerRateLimiterTools } from "./tools/rate-limiter.js";
import { registerRbacForgeTools } from "./tools/rbac-forge.js";
import { registerReadmeGenTools } from "./tools/readme-gen.js";
import { registerRedisPatternsTools } from "./tools/redis-patterns.js";
import { registerRegexBuilderTools } from "./tools/regex-builder.js";
import { registerRestDesignerTools } from "./tools/rest-designer.js";
import { registerRetryPolicyTools } from "./tools/retry-policy.js";
import { registerS3ManagerTools } from "./tools/s3-manager.js";
import { registerSchemaDriftTools } from "./tools/schema-drift.js";
import { registerSearchBuilderTools } from "./tools/search-builder.js";
import { registerSeedGenTools } from "./tools/seed-gen.js";
import { registerSeoAuditorTools } from "./tools/seo-auditor.js";
import { registerServerlessFrameworkTools } from "./tools/serverless-framework.js";
import { registerServiceScaffoldTools } from "./tools/service-scaffold.js";
import { registerSqlArmorTools } from "./tools/sql-armor.js";
import { registerStateManagerTools } from "./tools/state-manager.js";
import { registerTechDebtTrackerTools } from "./tools/tech-debt-tracker.js";
import { registerTerraformModuleTools } from "./tools/terraform-module.js";
import { registerTypeStrengthenerTools } from "./tools/type-strengthener.js";
import { registerUnitTestGenTools } from "./tools/unit-test-gen.js";
import { registerUptimeSentinelTools } from "./tools/uptime-sentinel.js";
import { registerWebhookBuilderTools } from "./tools/webhook-builder.js";
import { registerWebsocketSetupTools } from "./tools/websocket-setup.js";
import { registerWorkspaceSetupTools } from "./tools/workspace-setup.js";

const server = new McpServer({
  name: "plugin-hub",
  version: "2.0.0",
});

// Register all tool namespaces
registerA11yFixerTools(server);
registerApiDocsTools(server);
registerApiForgeTools(server);
registerArchitectureDocsTools(server);
registerAuditTrailTools(server);
registerAuthArchitectTools(server);
registerBundleAnalyzerTools(server);
registerCacheArchitectTools(server);
registerChangelogGenTools(server);
registerCircuitBreakerTools(server);
registerCliBuilderTools(server);
registerCloudflareWorkerTools(server);
registerCodeSmellsTools(server);
registerCommitLinterTools(server);
registerComplexityReducerTools(server);
registerContainerGuardTools(server);
registerCostHawkTools(server);
registerCoverageAnalyzerTools(server);
registerCssOptimizerTools(server);
registerDataAnonymizerTools(server);
registerDataGenTools(server);
registerDeadCodeTools(server);
registerDepShieldTools(server);
registerDevcontainerTools(server);
registerDisasterRecoveryTools(server);
registerDistributedTracingTools(server);
registerDockerComposeGenTools(server);
registerDuplicationHunterTools(server);
registerDynamodbDesignerTools(server);
registerE2eScenarioTools(server);
registerEnvGuardianTools(server);
registerErrorBoundaryTools(server);
registerEtlBuilderTools(server);
registerFeatureFlagTools(server);
registerFlakyTestFinderTools(server);
registerFormBuilderTools(server);
registerGdprToolkitTools(server);
registerGitWorkflowTools(server);
registerGithubActionsGenTools(server);
registerGraphqlBuilderTools(server);
registerHelmChartTools(server);
registerI18nExtractorTools(server);
registerIacScannerTools(server);
registerK8sManifestTools(server);
registerLambdaBuilderTools(server);
registerLogSleuthTools(server);
registerMakefileGenTools(server);
registerMonitoringStackTools(server);
registerMultiTenantTools(server);
registerNginxConfigTools(server);
registerNotifyHubTools(server);
registerOwaspCheckerTools(server);
registerPaginationGenTools(server);
registerPerfPilotTools(server);
registerPipelineOpsTools(server);
registerProjectInitTools(server);
registerPwaBuilderTools(server);
registerQueryOptimizerTools(server);
registerQueueBuilderTools(server);
registerRateLimiterTools(server);
registerRbacForgeTools(server);
registerReadmeGenTools(server);
registerRedisPatternsTools(server);
registerRegexBuilderTools(server);
registerRestDesignerTools(server);
registerRetryPolicyTools(server);
registerS3ManagerTools(server);
registerSchemaDriftTools(server);
registerSearchBuilderTools(server);
registerSeedGenTools(server);
registerSeoAuditorTools(server);
registerServerlessFrameworkTools(server);
registerServiceScaffoldTools(server);
registerSqlArmorTools(server);
registerStateManagerTools(server);
registerTechDebtTrackerTools(server);
registerTerraformModuleTools(server);
registerTypeStrengthenerTools(server);
registerUnitTestGenTools(server);
registerUptimeSentinelTools(server);
registerWebhookBuilderTools(server);
registerWebsocketSetupTools(server);
registerWorkspaceSetupTools(server);

// Start server — use HTTP when hosted (MCPize), stdio when local
async function main() {
  const isHosted = process.env.PORT || process.env.MCPIZE;

  if (isHosted) {
    const port = parseInt(process.env.PORT || "8080", 10);
    const httpServer = createServer(async (req, res) => {
      if (req.method === "POST" && req.url === "/mcp") {
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.setHeader("Content-Type", "application/json");
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } else if (req.method === "GET" && (req.url === "/health" || req.url === "/ping")) {
        res.writeHead(200);
        res.end("ok");
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    httpServer.listen(port, () => {
      console.log(`Plugin Hub MCP server listening on port ${port}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

main().catch(console.error);
