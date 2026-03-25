# cost-hawk

**Analyze cloud infrastructure costs, optimize Docker images, tune database performance, and generate cost reports.**

Category: FinOps / Cloud

---

## Features

### Free Tier
- **Infrastructure Cost Analysis** -- Analyze Terraform, CloudFormation, Kubernetes, and docker-compose configurations to find over-provisioned resources, unused allocations, and right-sizing opportunities with estimated savings.
- **Docker Image Optimization** -- Identify bloated base images, unnecessary layers, missing multi-stage builds, and caching inefficiencies in your Dockerfiles.
- **Cost Report Generation** -- Produce comprehensive, prioritized cost optimization reports with projected savings and actionable recommendations.

### Pro Tier
- **Database Cost Optimization** -- Analyze database configurations, query patterns, indexing strategies, and connection pooling to reduce costs and improve performance.
- Everything in Free, with unlimited requests.

---

## Installation

```
/plugin install cost-hawk@barnburner121
```

---

## Usage Examples

**Analyze infrastructure costs:**
> "Analyze my Terraform configs and tell me where I'm overspending on AWS."

**Optimize Docker images:**
> "Review my Dockerfile and suggest ways to reduce the image size."

**Database optimization (Pro):**
> "Analyze my PostgreSQL configuration and queries for cost and performance improvements."

**Generate a cost report:**
> "Create a full cost optimization report for this project with projected monthly savings."

---

## Pricing

| Plan       | Price       | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | cost_analyze_infra, cost_optimize_docker, cost_generate_report |
| Pro        | $9/mo       | Unlimited      | All tools including cost_optimize_database |
| Enterprise | $49/mo      | Unlimited + SLA| Priority support, custom integrations |

---

## License

MIT
