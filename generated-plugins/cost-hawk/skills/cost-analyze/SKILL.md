# cost-analyze

## Description

The cost-analyze skill helps users optimize cloud infrastructure spending, reduce Docker image sizes, tune database performance for cost efficiency, and generate comprehensive cost reports. Use this skill whenever the user asks about cloud costs, resource optimization, Docker optimization, or database performance tuning.

## Allowed Tools

Read, Write, Edit, Bash, Grep, Glob

## Tools

### cost_analyze_infra
Use this tool to analyze cloud infrastructure configurations (Terraform, CloudFormation, Kubernetes manifests, docker-compose files) and identify cost optimization opportunities. It detects over-provisioned resources, unused allocations, and suggests right-sizing recommendations with estimated savings. Invoke this when the user asks to "analyze cloud costs," "find savings," or "optimize infrastructure spending."

### cost_optimize_docker
Use this tool to analyze Dockerfiles and container configurations for size and efficiency optimizations. It identifies bloated base images, unnecessary layers, missing multi-stage builds, and unoptimized caching strategies. Invoke this when the user asks to "optimize Docker images," "reduce image size," or "speed up container builds."

### cost_optimize_database (Pro)
Use this tool to analyze database configurations, query patterns, and indexing strategies to reduce costs and improve performance. It reviews connection pooling, identifies missing or redundant indexes, and recommends instance right-sizing. Invoke this when the user asks to "optimize database costs," "tune database performance," or "reduce database spending." This is a Pro-tier tool.

### cost_generate_report
Use this tool to generate a comprehensive cost optimization report combining infrastructure analysis, Docker optimization, and database tuning results into an actionable document with prioritized recommendations and projected savings. Invoke this when the user asks to "generate a cost report," "summarize optimization opportunities," or "create a savings plan."

## Workflow

1. Start with `cost_analyze_infra` to identify the biggest cost drivers in cloud infrastructure.
2. Use `cost_optimize_docker` to find container-level savings.
3. Run `cost_optimize_database` for database-specific optimizations (Pro users).
4. Generate a `cost_generate_report` to produce a prioritized action plan with projected savings.
