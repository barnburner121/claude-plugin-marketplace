# perf-test

## Description

perf-pilot is a performance engineering toolkit. It generates load test scripts for popular frameworks, analyzes application code and profiling data to identify bottlenecks, and creates performance budgets that can be enforced in CI pipelines.

## When to Use

Activate this skill when the user asks to:

- Generate load test scripts (k6, Artillery, JMeter, Locust, etc.)
- Analyze code or profiling data for performance bottlenecks
- Create or enforce performance budgets in CI/CD pipelines

## Tools

### perf_generate_load_test
Generates load test scripts for popular frameworks (k6, Artillery, JMeter, Locust). Analyzes API endpoints, user flows, or traffic patterns to create realistic test scenarios with configurable virtual users, ramp-up profiles, and assertions.

**Use when:** The user wants to create load tests, stress tests, or soak tests for their application. Also use when they want to simulate production traffic patterns.

### perf_analyze_bottlenecks
Analyzes application code, database queries, profiling data, and system metrics to identify performance bottlenecks. Provides ranked recommendations with estimated impact and remediation steps.

**Use when:** The user wants to find why their application is slow, identify the most impactful optimizations, or analyze profiling or APM data for performance issues.

### perf_create_budget (Pro)
Creates performance budgets defining acceptable thresholds for response times, bundle sizes, Core Web Vitals, and resource usage. Generates CI configuration to enforce budgets automatically and fail builds that exceed limits.

**Use when:** The user wants to set performance standards, prevent performance regressions in CI, or establish SLOs for their application's performance metrics.

## Allowed Tools

- Read
- Write
- Edit
- Bash
- Grep
- Glob
