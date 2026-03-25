# dep-shield

**Audit dependencies for vulnerabilities, check for outdated packages, scan licenses for compliance, and plan safe updates.**

Category: Security / Compliance

---

## Features

### Free Tier
- **Vulnerability Auditing** -- Scan your dependency tree against CVE, GitHub Advisory, and OSV databases to find known security issues with severity ratings and fix recommendations.
- **Outdated Package Detection** -- Identify which dependencies have newer versions available, categorized by patch, minor, and major updates.
- **Update Planning** -- Generate a safe, ordered update plan that respects dependency graphs, flags breaking changes, and suggests phased rollout strategies.

### Pro Tier
- **License Compliance Scanning** -- Audit all dependency licenses against your compliance policy. Detect copyleft, unknown, or restricted licenses that could create legal risk.
- Everything in Free, with unlimited requests.

---

## Installation

```
/plugin install dep-shield@barnburner121
```

---

## Usage Examples

**Audit for vulnerabilities:**
> "Scan this project's dependencies for security vulnerabilities."

**Check for outdated packages:**
> "Which of my dependencies are outdated? Show me what needs updating."

**License compliance (Pro):**
> "Check all dependency licenses and flag anything that conflicts with our MIT license."

**Plan a safe upgrade:**
> "Create an update plan for all outdated dependencies, prioritizing security fixes."

---

## Pricing

| Plan       | Price       | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | dep_audit, dep_outdated, dep_update_plan |
| Pro        | $9/mo       | Unlimited      | All tools including dep_license_check |
| Enterprise | $49/mo      | Unlimited + SLA| Priority support, custom policies |

---

## License

MIT
