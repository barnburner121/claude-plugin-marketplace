# log-sleuth

**Analyze log files for patterns, search with structured queries, get logging recommendations, and correlate across services.**

Category: Observability

## Features

### Free Tier
- **Log Analysis** -- Detect patterns, recurring errors, and anomalies in your log files with `log_analyze`.
- **Structured Search** -- Query logs by level, timestamp, service, request ID, and custom fields with `log_search`.
- **Logging Recommendations** -- Get actionable advice to improve your codebase's logging practices with `log_recommend`.

### Pro Tier
- **Cross-Service Correlation** -- Trace requests across microservices and build event timelines for distributed debugging with `log_correlate`.
- Unlimited daily requests.
- Priority support.

## Installation

```
/plugin install log-sleuth@barnburner121
```

## Usage Examples

**Analyze log patterns:**
```
> Analyze the logs in /var/log/app/ and tell me what the most frequent errors are.
```

**Search logs with filters:**
```
> Search the production logs for all ERROR entries between 2pm and 3pm today related to the payment service.
```

**Get logging recommendations:**
```
> Review my logging practices and suggest improvements for better observability.
```

**Correlate across services (Pro):**
```
> Trace request abc-123 across all services and show me the full event timeline.
```

## Pricing

| Plan       | Price        | Requests       | Features                                |
|------------|-------------|----------------|-----------------------------------------|
| Free       | $0          | 50 req/day     | Analyze, Search, Recommend              |
| Pro        | $9/mo       | Unlimited      | All tools including Cross-Service Correlation |
| Enterprise | $49/mo      | Unlimited + SLA| All tools + dedicated support           |

## License

MIT
