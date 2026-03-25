# uptime

## Description

The uptime skill helps create health check endpoints, set up uptime monitoring configurations, generate public status pages, and create incident response runbooks. Use this skill whenever the user asks about health checks, uptime monitoring, status pages, or incident management.

## Allowed Tools

Read, Write, Edit, Bash, Grep, Glob

## Tools

### uptime_create_healthcheck
Use this tool to create health check endpoints for applications and services. It generates endpoints that verify database connectivity, external service availability, memory/disk usage, and application readiness. Supports Express, FastAPI, Spring Boot, and other frameworks. Invoke this when the user asks to "add a health check," "create a readiness probe," "set up liveness checks," or "build a health endpoint."

### uptime_create_monitors
Use this tool to generate uptime monitoring configurations for services like UptimeRobot, Pingdom, Datadog, or custom cron-based monitors. It creates monitor definitions with appropriate intervals, alerting thresholds, and notification channels. Invoke this when the user asks to "set up monitoring," "create uptime checks," "configure alerting," or "monitor my endpoints."

### uptime_create_status_page (Pro)
Use this tool to generate a public-facing status page that displays real-time service health, incident history, and scheduled maintenance windows. It produces a self-hosted static site or integrates with Statuspage.io, Cachet, or Instatus. Invoke this when the user asks to "create a status page," "build a service status dashboard," or "set up a public health dashboard." This is a Pro-tier tool.

### uptime_create_runbook
Use this tool to generate incident response runbooks for common failure scenarios. It analyzes the application architecture and creates step-by-step troubleshooting guides, escalation procedures, and recovery playbooks. Invoke this when the user asks to "create a runbook," "write incident procedures," "build troubleshooting guides," or "document recovery steps."

## Workflow

1. Use `uptime_create_healthcheck` to add health check endpoints to your services.
2. Use `uptime_create_monitors` to set up external monitoring against those endpoints.
3. Use `uptime_create_status_page` to give users visibility into service health (Pro users).
4. Use `uptime_create_runbook` to prepare your team for incident response.
