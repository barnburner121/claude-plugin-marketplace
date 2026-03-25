# api-test

## Description

api-forge provides a complete API testing toolkit. It generates test suites from OpenAPI specs or existing endpoints, spins up mock servers for development, runs contract tests to ensure API compatibility, and benchmarks endpoint performance.

## When to Use

Activate this skill when the user asks to:

- Generate test cases or test suites for REST or GraphQL APIs
- Create a mock server from an API specification or existing endpoints
- Run contract tests to verify API compatibility between services
- Benchmark API endpoint response times and throughput

## Tools

### api_generate_tests
Generates a comprehensive test suite for API endpoints. Analyzes OpenAPI/Swagger specs, route definitions, or endpoint URLs to produce tests covering happy paths, error cases, edge cases, and authentication flows.

**Use when:** The user wants to create API tests, improve test coverage for endpoints, or bootstrap a testing setup for a new API.

### api_create_mock
Creates a mock server that simulates API behavior based on OpenAPI specs, recorded responses, or manually defined routes. Supports configurable latency, error rates, and stateful responses.

**Use when:** The user needs a mock API for frontend development, integration testing, or offline development without hitting production services.

### api_contract_test (Pro)
Runs contract tests between API provider and consumer to verify that both sides adhere to the agreed-upon API contract. Detects breaking changes in request/response schemas.

**Use when:** The user wants to ensure API compatibility across microservices, catch breaking changes before deployment, or set up consumer-driven contract testing.

### api_benchmark
Benchmarks API endpoints by sending configurable loads and measuring response time percentiles, throughput, error rates, and resource consumption. Produces detailed performance reports.

**Use when:** The user wants to measure endpoint performance, compare before/after optimization results, or establish performance baselines.

## Allowed Tools

- Read
- Write
- Edit
- Bash
- Grep
- Glob
