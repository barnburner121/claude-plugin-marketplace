# api-forge

**Generate API test suites, create mock servers, run contract tests, and benchmark endpoints.**

Category: Testing

## Features

### Free Tier
- **Test Generation** -- Automatically generate comprehensive API test suites from OpenAPI specs or endpoint definitions with `api_generate_tests`.
- **Mock Servers** -- Spin up mock API servers for frontend development and integration testing with `api_create_mock`.
- **Benchmarking** -- Measure endpoint response times, throughput, and error rates with `api_benchmark`.

### Pro Tier
- **Contract Testing** -- Run consumer-driven contract tests to catch breaking API changes across microservices with `api_contract_test`.
- Unlimited daily requests.
- Priority support.

## Installation

```
/plugin install api-forge@barnburner121
```

## Usage Examples

**Generate tests from an OpenAPI spec:**
```
> Generate a test suite for all endpoints defined in openapi.yaml.
```

**Create a mock server:**
```
> Create a mock server for the user service API so the frontend team can develop against it.
```

**Run contract tests (Pro):**
```
> Run contract tests between the order service and payment service to check for breaking changes.
```

**Benchmark an endpoint:**
```
> Benchmark the /api/v1/search endpoint with 100 concurrent users for 30 seconds.
```

## Pricing

| Plan       | Price        | Requests       | Features                             |
|------------|-------------|----------------|--------------------------------------|
| Free       | $0          | 50 req/day     | Test Gen, Mock Servers, Benchmarking |
| Pro        | $9/mo       | Unlimited      | All tools including Contract Tests   |
| Enterprise | $49/mo      | Unlimited + SLA| All tools + dedicated support        |

## License

MIT
