# uptime-sentinel

**Create health check endpoints, set up uptime monitoring, generate status pages, and create incident runbooks.**

Category: Monitoring

---

## Features

### Free Tier
- **Health Check Endpoints** -- Generate health check endpoints that verify database connectivity, external service availability, memory/disk usage, and application readiness. Supports Express, FastAPI, Spring Boot, and more.
- **Uptime Monitoring** -- Create monitoring configurations for UptimeRobot, Pingdom, Datadog, or custom cron-based monitors with appropriate intervals, thresholds, and alerting.
- **Incident Runbooks** -- Generate step-by-step incident response runbooks with troubleshooting guides, escalation procedures, and recovery playbooks tailored to your architecture.

### Pro Tier
- **Status Page Generation** -- Build public-facing status pages showing real-time service health, incident history, and scheduled maintenance. Supports self-hosted static sites and integrations with Statuspage.io, Cachet, and Instatus.
- Everything in Free, with unlimited requests.

---

## Installation

```
/plugin install uptime-sentinel@barnburner121
```

---

## Usage Examples

**Create health checks:**
> "Add a health check endpoint to my Express API that verifies the database and Redis connections."

**Set up monitoring:**
> "Configure UptimeRobot monitors for all my production endpoints with Slack alerting."

**Generate a status page (Pro):**
> "Create a public status page for our three microservices with incident history."

**Create a runbook:**
> "Write an incident runbook for database connection failures including escalation steps."

---

## Pricing

| Plan       | Price       | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | uptime_create_healthcheck, uptime_create_monitors, uptime_create_runbook |
| Pro        | $9/mo       | Unlimited      | All tools including uptime_create_status_page |
| Enterprise | $49/mo      | Unlimited + SLA| Priority support, custom integrations |

---

## License

MIT
