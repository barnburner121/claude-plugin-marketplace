# perf-pilot

**Generate load tests, analyze performance bottlenecks, and create performance budgets with CI enforcement.**

Category: Performance

## Features

### Free Tier
- **Load Test Generation** -- Generate load test scripts for k6, Artillery, JMeter, and Locust from your API definitions or user flows with `perf_generate_load_test`.
- **Bottleneck Analysis** -- Identify performance bottlenecks in code, queries, and system metrics with ranked optimization recommendations with `perf_analyze_bottlenecks`.

### Pro Tier
- **Performance Budgets** -- Define and enforce performance budgets for response times, bundle sizes, and Core Web Vitals in CI with `perf_create_budget`.
- Unlimited daily requests.
- Priority support.

## Installation

```
/plugin install perf-pilot@barnburner121
```

## Usage Examples

**Generate a k6 load test:**
```
> Generate a k6 load test for my REST API that simulates 500 concurrent users with a 2-minute ramp-up.
```

**Analyze bottlenecks:**
```
> Analyze this application for performance bottlenecks. The /api/dashboard endpoint takes 4 seconds to respond.
```

**Create a performance budget (Pro):**
```
> Create a performance budget that enforces p95 response time under 200ms and fails the CI build if exceeded.
```

## Pricing

| Plan       | Price        | Requests       | Features                              |
|------------|-------------|----------------|---------------------------------------|
| Free       | $0          | 50 req/day     | Load Test Gen, Bottleneck Analysis    |
| Pro        | $9/mo       | Unlimited      | All tools including Performance Budgets|
| Enterprise | $49/mo      | Unlimited + SLA| All tools + dedicated support         |

## License

MIT
