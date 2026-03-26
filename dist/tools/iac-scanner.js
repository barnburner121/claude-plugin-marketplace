import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerIacScannerTools(server) {
    server.tool("iac_scan_terraform", "Scan Terraform files for security misconfigurations and best practice violations", {
        directory: z.string().describe("Directory containing Terraform files"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const checks = [
            { name: "Public S3 Buckets", pattern: 'acl\\s*=\\s*"public' },
            { name: "Open Security Groups", pattern: 'cidr_blocks\\s*=\\s*\\["0\\.0\\.0\\.0/0"\\]' },
            { name: "Unencrypted Storage", pattern: "encrypted\\s*=\\s*false" },
            { name: "Missing Tags", pattern: "resource\\s+\"aws_" },
            { name: "Hardcoded Credentials", pattern: '(access_key|secret_key)\\s*=\\s*"[^"]+"' },
            { name: "No Logging", pattern: "logging\\s*\\{" },
            { name: "Wildcard IAM", pattern: '"\\*"' },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_terraform",
                        directory,
                        checks,
                        instructions: "Search for *.tf files in the directory. For each check, use Grep to find matches. Report findings grouped by severity (Critical: hardcoded creds, wildcard IAM, public buckets; High: open security groups, unencrypted storage; Medium: missing tags, no logging). Show file path, line number, and the offending code for each finding.",
                    }, null, 2),
                }],
        };
    });
    server.tool("iac_scan_docker", "Scan Dockerfiles for security issues and best practices", {
        directory: z.string().describe("Directory to scan for Dockerfiles"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const checks = [
            { name: "Running as root", pattern: "^USER\\s+" },
            { name: "Using latest tag", pattern: "FROM\\s+\\w+:latest" },
            { name: "ADD instead of COPY", pattern: "^ADD\\s+" },
            { name: "Hardcoded secrets", pattern: "(ENV|ARG)\\s+(PASSWORD|SECRET|API_KEY|TOKEN)" },
            { name: "No healthcheck", pattern: "^HEALTHCHECK" },
            { name: "Privileged ports", pattern: "EXPOSE\\s+(80|443|22)\\b" },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_dockerfile",
                        directory,
                        checks,
                        instructions: "Find all Dockerfiles (Dockerfile, Dockerfile.*, *.dockerfile) in the directory. Check for: (1) missing USER directive (running as root), (2) FROM with :latest tag, (3) ADD used instead of COPY, (4) hardcoded secrets in ENV/ARG, (5) missing HEALTHCHECK. Report each issue with fix suggestion.",
                    }, null, 2),
                }],
        };
    });
    server.tool("iac_scan_k8s", "Scan Kubernetes manifests for security misconfigurations", {
        directory: z.string().describe("Directory containing K8s YAML files"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const checks = [
            { name: "Privileged containers", pattern: "privileged:\\s*true" },
            { name: "No resource limits", pattern: "resources:" },
            { name: "Host network", pattern: "hostNetwork:\\s*true" },
            { name: "Run as root", pattern: "runAsNonRoot:\\s*false" },
            { name: "No readiness probe", pattern: "readinessProbe:" },
            { name: "Latest image tag", pattern: "image:\\s*[^:]+$" },
            { name: "Secrets in plain text", pattern: "kind:\\s*Secret" },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_k8s",
                        directory,
                        checks,
                        instructions: "Find all *.yaml and *.yml files in the directory. For each K8s manifest, check: (1) privileged containers, (2) missing resource limits/requests, (3) hostNetwork enabled, (4) containers running as root, (5) missing readiness/liveness probes, (6) images without specific tags, (7) plain-text secrets. Report each finding with the fix.",
                    }, null, 2),
                }],
        };
    });
    server.tool("iac_fix_issues", "Auto-fix IaC security issues found by scanning (Pro feature)", {
        directory: z.string().describe("Directory containing IaC files"),
        issue_type: z.enum(["terraform", "docker", "k8s"]).describe("Type of IaC to fix"),
        api_key: z.string().optional(),
    }, async ({ directory, issue_type, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{
                        type: "text",
                        text: "Auto-fixing IaC issues is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "fix_iac_issues",
                        directory,
                        issue_type,
                        instructions: `Run the appropriate scan first (iac_scan_${issue_type === "k8s" ? "k8s" : issue_type}), then for each finding, apply the recommended fix using the Edit tool. For Terraform: add encryption, restrict CIDRs, remove hardcoded creds. For Docker: add USER directive, pin image tags, replace ADD with COPY. For K8s: add resource limits, set runAsNonRoot, add probes. Create a summary of all changes made.`,
                    }, null, 2),
                }],
        };
    });
}
