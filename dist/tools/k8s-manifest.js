import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerK8sManifestTools(server) {
    server.tool("k8s_generate_deployment", "Generate a Kubernetes Deployment manifest with best-practice defaults", {
        app_name: z.string().describe("Name of the application"),
        image: z.string().describe("Container image reference"),
        replicas: z.number().optional().describe("Number of replicas (default 3)"),
        namespace: z.string().optional().describe("Target namespace"),
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
                        action: "generate_deployment",
                        instructions: `Generate a Kubernetes Deployment manifest for '${params.app_name}' using image '${params.image}' with ${params.replicas ?? 3} replicas in namespace '${params.namespace ?? "default"}'. Include resource limits, liveness/readiness probes, and pod anti-affinity rules.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("k8s_generate_service", "Generate a Kubernetes Service manifest to expose a deployment", {
        app_name: z.string().describe("Name of the application to expose"),
        port: z.number().describe("Service port"),
        target_port: z.number().optional().describe("Container target port"),
        service_type: z.enum(["ClusterIP", "NodePort", "LoadBalancer"]).optional().describe("Service type"),
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
                        action: "generate_service",
                        instructions: `Generate a Kubernetes Service manifest for '${params.app_name}' on port ${params.port} targeting port ${params.target_port ?? params.port} with type '${params.service_type ?? "ClusterIP"}'. Include appropriate selectors and labels.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("k8s_generate_ingress", "Generate a Kubernetes Ingress manifest with TLS and routing rules", {
        app_name: z.string().describe("Name of the application"),
        hostname: z.string().describe("Hostname for the ingress rule"),
        service_port: z.number().optional().describe("Backend service port"),
        tls_enabled: z.boolean().optional().describe("Enable TLS (default true)"),
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
                        action: "generate_ingress",
                        instructions: `Generate a Kubernetes Ingress manifest for '${params.app_name}' with hostname '${params.hostname}' routing to service port ${params.service_port ?? 80}. ${params.tls_enabled !== false ? "Include TLS configuration with cert-manager annotations." : "TLS is disabled."} Add rate limiting and CORS annotations.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("k8s_security_audit", "Audit a Kubernetes manifest for security best practices (Pro)", {
        manifest_yaml: z.string().describe("YAML content of the Kubernetes manifest to audit"),
        strict_mode: z.boolean().optional().describe("Enable strict security checks"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The k8s_security_audit tool requires a Pro subscription. Please upgrade to access security auditing features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "security_audit",
                        instructions: `Perform a ${params.strict_mode ? "strict " : ""}security audit on the provided Kubernetes manifest. Check for privileged containers, missing security contexts, resource limits, network policies, RBAC misconfigurations, and image tag pinning. Return findings with severity levels and remediation steps.`,
                    }, null, 2),
                },
            ],
        };
    });
}
