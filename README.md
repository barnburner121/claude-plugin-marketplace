# Plugin Hub — The Largest Claude Code Plugin Marketplace

**500+ developer tools in one MCP server.** Install once, get everything.

```
/plugin marketplace add barnburner121/claude-plugin-marketplace
```

Plugin Hub is the most comprehensive collection of developer tools available for Claude Code and Claude Cowork. Every tool runs through a single MCP server — no separate installations, no configuration sprawl, no dependency conflicts.

## Quick Start

**Install the marketplace:**
```
/plugin marketplace add barnburner121/claude-plugin-marketplace
```

**Install any plugin:**
```
/plugin install <plugin-name>@barnburner121-plugins
```

**Or use the MCP server directly:**
```json
{
  "mcpServers": {
    "plugin-hub": {
      "command": "npx",
      "args": ["-y", "@barnburner121/plugin-hub-mcp"]
    }
  }
}
```

## What's Included

### Security & Compliance (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `env-guardian` | Scan for exposed secrets, generate .env templates, validate configs, rotate secrets |
| `iac-scanner` | Scan Terraform/CloudFormation/K8s manifests for misconfigurations |
| `container-guard` | Audit Dockerfiles and docker-compose for security best practices |
| `cors-config` | Analyze and fix CORS configurations across API endpoints |
| `csp-builder` | Generate and validate Content Security Policy headers |
| `auth-architect` | Generate authentication flows (JWT, OAuth2, session-based) |
| `rbac-forge` | Generate role-based access control systems with permission matrices |
| `input-sanitizer` | Scan code for missing input validation, generate sanitizers |
| `sql-armor` | Detect SQL injection vulnerabilities and generate parameterized queries |
| `xss-shield` | Scan templates and frontend code for XSS vulnerabilities |
| `secrets-vault` | Generate HashiCorp Vault, AWS Secrets Manager integrations |
| `ssl-manager` | Check SSL configs, generate renewal scripts, fix TLS settings |
| `owasp-checker` | Scan codebase against OWASP Top 10 with remediation plans |
| `gdpr-toolkit` | Generate GDPR compliance: consent forms, data export, deletion endpoints |
| `hipaa-guard` | Audit code for HIPAA compliance issues |

### Code Quality & Refactoring (20 plugins)
| Plugin | What It Does |
|--------|-------------|
| `dead-code` | Find and remove unused code, functions, imports, variables |
| `code-smells` | Detect code smells with refactoring suggestions |
| `duplication-hunter` | Find duplicate code blocks and suggest DRY refactoring |
| `complexity-reducer` | Analyze cyclomatic complexity and suggest simplifications |
| `naming-conventions` | Enforce and fix naming conventions across a codebase |
| `import-optimizer` | Clean up and organize imports |
| `error-handler` | Audit error handling and add proper patterns |
| `null-safety` | Find null/undefined issues and add safety checks |
| `async-fixer` | Detect async/await anti-patterns and race conditions |
| `type-strengthener` | Strengthen TypeScript types, replace `any`, add generics |
| `magic-numbers` | Find magic numbers/strings and extract to constants |
| `comment-quality` | Audit comments, remove outdated, add missing docs |
| `function-splitter` | Identify overly long functions and suggest splits |
| `dependency-injector` | Refactor to dependency injection patterns |
| `solid-checker` | Analyze code against SOLID principles |
| `pattern-matcher` | Identify where design patterns should be applied |
| `tech-debt-tracker` | Scan TODO/FIXME/HACK and generate tech debt reports |
| `code-metrics` | Generate code metrics: complexity, coverage, maintainability |
| `refactor-planner` | Create prioritized refactoring plans |
| `legacy-modernizer` | Identify legacy patterns and suggest modern replacements |

### Documentation (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `api-docs` | Generate OpenAPI/Swagger specs from route handlers |
| `readme-gen` | Generate comprehensive README.md from project analysis |
| `changelog-gen` | Generate changelogs from git commits |
| `jsdoc-writer` | Generate JSDoc/TSDoc comments for exported functions |
| `architecture-docs` | Generate architecture documentation with diagrams |
| `onboarding-guide` | Generate developer onboarding guides |
| `runbook-writer` | Generate operational runbooks |
| `adr-creator` | Create Architecture Decision Records |
| `api-changelog` | Detect API changes between versions |
| `storybook-gen` | Generate Storybook stories for components |
| `diagram-gen` | Generate Mermaid/PlantUML diagrams from code |
| `glossary-builder` | Extract domain terms and generate glossary |
| `contrib-guide` | Generate CONTRIBUTING.md with guidelines |
| `license-gen` | Generate LICENSE files and source headers |
| `release-notes` | Generate user-facing release notes |

### Testing (20 plugins)
| Plugin | What It Does |
|--------|-------------|
| `unit-test-gen` | Generate unit tests with edge cases |
| `integration-test-gen` | Generate integration tests for services |
| `e2e-scenario` | Generate end-to-end test scenarios (Playwright, Cypress) |
| `snapshot-test` | Generate snapshot tests for UI components |
| `fixture-factory` | Generate test fixtures for data models |
| `mock-builder` | Generate mocks, stubs, and fakes |
| `coverage-analyzer` | Analyze test coverage gaps and suggest tests |
| `property-tester` | Generate property-based tests |
| `mutation-test` | Set up mutation testing |
| `regression-guard` | Generate regression tests from bug reports |
| `accessibility-test` | Generate WCAG accessibility tests |
| `visual-regression` | Set up visual regression testing |
| `chaos-engineer` | Generate chaos engineering experiments |
| `data-gen` | Generate realistic test data for any schema |
| `test-organizer` | Reorganize test suites following best practices |
| `smoke-test` | Generate deployment smoke tests |
| `test-parallelizer` | Configure test parallelization |
| `flaky-test-finder` | Identify and fix flaky tests |
| `test-reporter` | Generate custom test report formats |
| `contract-test-gen` | Generate consumer-driven contract tests |

### Frontend Development (20 plugins)
| Plugin | What It Does |
|--------|-------------|
| `responsive-audit` | Audit CSS for responsive design issues |
| `a11y-fixer` | Scan HTML/JSX for accessibility issues, generate ARIA fixes |
| `css-optimizer` | Find unused CSS, duplicate rules, optimization opportunities |
| `component-gen` | Generate React/Vue/Svelte components |
| `form-builder` | Generate form components with validation from schemas |
| `i18n-extractor` | Extract strings and set up internationalization |
| `theme-builder` | Generate theme systems and dark mode |
| `animation-helper` | Generate CSS/Framer Motion animations |
| `seo-auditor` | Audit web apps for SEO issues |
| `bundle-analyzer` | Analyze and optimize JavaScript bundle size |
| `image-optimizer` | Generate image optimization pipelines |
| `font-optimizer` | Optimize web font loading |
| `pwa-builder` | Generate PWA: service worker, manifest, offline |
| `meta-tag-gen` | Generate meta tags, Open Graph, Twitter Cards |
| `sitemap-gen` | Generate XML sitemaps from routes |
| `web-vitals` | Set up Core Web Vitals monitoring |
| `tailwind-helper` | Convert CSS to Tailwind, optimize config |
| `state-manager` | Generate state management (Redux, Zustand, Pinia) |
| `router-gen` | Generate route configurations |
| `error-boundary` | Generate error boundary components with fallbacks |

### Backend & API Design (20 plugins)
| Plugin | What It Does |
|--------|-------------|
| `rest-designer` | Design RESTful APIs following best practices |
| `graphql-builder` | Generate GraphQL schemas, resolvers, types |
| `grpc-gen` | Generate gRPC protobuf definitions |
| `websocket-setup` | Set up WebSocket servers with rooms and auth |
| `rate-limiter` | Generate rate limiting middleware |
| `cache-architect` | Design caching strategies with Redis |
| `queue-builder` | Set up message queues (BullMQ, SQS, RabbitMQ) |
| `pagination-gen` | Generate pagination (cursor, offset, keyset) |
| `file-upload` | Generate file upload systems |
| `search-builder` | Set up full-text search (Elasticsearch, Meilisearch) |
| `event-system` | Generate event-driven architectures |
| `middleware-gen` | Generate middleware chains |
| `validator-gen` | Generate request validation schemas (Zod, Joi) |
| `serializer-gen` | Generate data serialization layers |
| `webhook-builder` | Generate webhook systems with signatures |
| `batch-processor` | Generate batch processing systems |
| `cron-scheduler` | Generate cron job configurations |
| `feature-flag` | Generate feature flag systems with A/B testing |
| `health-dashboard` | Generate admin health dashboards |
| `api-versioning` | Set up API versioning strategies |

### Database & Data (25 plugins)
| Plugin | What It Does |
|--------|-------------|
| `schema-drift` | Generate migrations, detect drift, validate safety |
| `query-optimizer` | Analyze and optimize SQL queries |
| `seed-gen` | Generate database seeder scripts |
| `backup-planner` | Generate backup strategies and restoration scripts |
| `redis-patterns` | Generate Redis patterns: caching, sessions, pub/sub |
| `mongo-optimizer` | Analyze MongoDB queries, indexes, schema |
| `postgres-tuner` | Generate PostgreSQL configuration tuning |
| `data-anonymizer` | Generate data anonymization for dev/staging |
| `etl-builder` | Generate ETL pipeline code |
| `csv-processor` | Generate CSV import/export with validation |
| `data-validator` | Generate data validation pipelines |
| `timeseries-setup` | Set up time series storage (InfluxDB, TimescaleDB) |
| `graph-db` | Generate graph database schemas (Neo4j) |
| `multi-tenant` | Generate multi-tenancy patterns |
| `soft-delete` | Generate soft delete with cascading |
| `audit-trail` | Generate database audit trail systems |
| `data-archiver` | Generate data archival strategies |
| `connection-pool` | Optimize database connection pooling |
| `read-replica` | Generate read replica routing |
| `sharding-setup` | Generate database sharding strategies |
| `materialized-views` | Generate materialized view definitions |
| `json-schema-gen` | Generate JSON schemas from data/types |
| `orm-query-builder` | Generate optimized ORM queries |
| `data-catalog` | Generate data dictionaries and catalogs |
| `migration-linter` | Lint migrations for safety |

### DevOps & Infrastructure (25 plugins)
| Plugin | What It Does |
|--------|-------------|
| `pipeline-ops` | Generate CI/CD pipelines, debug failures, optimize speed |
| `k8s-manifest` | Generate Kubernetes manifests |
| `helm-chart` | Generate Helm charts |
| `docker-compose-gen` | Generate docker-compose for local dev |
| `nginx-config` | Generate Nginx: reverse proxy, SSL, load balancing |
| `terraform-module` | Generate Terraform modules |
| `ansible-playbook` | Generate Ansible playbooks |
| `github-actions-gen` | Generate GitHub Actions workflows |
| `gitlab-ci-gen` | Generate GitLab CI pipelines |
| `makefile-gen` | Generate Makefiles for automation |
| `systemd-service` | Generate systemd service files |
| `log-rotation` | Set up log rotation configurations |
| `monitoring-stack` | Generate Prometheus + Grafana + alerts |
| `dns-config` | Generate DNS configurations |
| `cdn-setup` | Generate CDN configurations |
| `load-balancer` | Generate load balancer configs |
| `auto-scaling` | Generate auto-scaling policies |
| `disaster-recovery` | Generate DR plans and runbooks |
| `blue-green` | Generate blue-green deployment configs |
| `canary-deploy` | Generate canary deployment strategies |
| `git-hooks` | Generate Git hooks for validation |
| `release-manager` | Generate release workflows |
| `infra-diagram` | Generate infrastructure diagrams from IaC |
| `cost-alert` | Generate cloud cost alerting |
| `compliance-scanner` | Scan infra against CIS benchmarks |

### Microservices & Architecture (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `service-scaffold` | Generate microservice boilerplate |
| `api-gateway` | Generate API gateway configurations |
| `circuit-breaker` | Generate circuit breaker patterns |
| `service-mesh` | Generate service mesh configurations |
| `saga-pattern` | Generate saga pattern for distributed transactions |
| `cqrs-setup` | Generate CQRS patterns |
| `event-sourcing` | Generate event sourcing implementations |
| `service-discovery` | Generate service discovery configs |
| `distributed-tracing` | Generate OpenTelemetry + Jaeger setup |
| `idempotency` | Generate idempotency for API endpoints |
| `retry-policy` | Generate retry with exponential backoff |
| `bulkhead-pattern` | Generate bulkhead isolation patterns |
| `config-server` | Generate centralized config management |
| `service-template` | Generate microservice templates |
| `dependency-graph` | Visualize service dependencies |

### Developer Productivity (25 plugins)
| Plugin | What It Does |
|--------|-------------|
| `project-init` | Generate project scaffolding for any framework |
| `env-sync` | Generate environment sync scripts |
| `git-workflow` | Generate Git branching strategies |
| `pr-template` | Generate PR templates with checklists |
| `issue-template` | Generate issue templates |
| `commit-linter` | Set up conventional commit linting |
| `editor-config` | Generate unified editor configurations |
| `devcontainer` | Generate VS Code devcontainer configs |
| `script-runner` | Generate npm/package scripts |
| `alias-gen` | Generate shell aliases for project commands |
| `workspace-setup` | Generate monorepo configs (Turborepo, Nx) |
| `debug-config` | Generate IDE debug configurations |
| `snippet-gen` | Generate IDE code snippets |
| `regex-builder` | Build and test regex patterns |
| `codemod-gen` | Generate codemods for code transformations |
| `boilerplate-killer` | Detect and abstract repetitive code |
| `cli-builder` | Generate CLI tools |
| `config-validator` | Validate configuration file schemas |
| `dotfile-gen` | Generate project dotfiles |
| `task-runner` | Generate task runner configs |
| `version-bumper` | Generate semantic version bumping |
| `dependency-graph-viz` | Visualize dependency trees |
| `code-tour` | Generate interactive code tours |
| `benchmark-suite` | Generate micro-benchmark suites |
| `migration-assistant` | Generate migration guides between versions |

### Cloud & Serverless (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `lambda-builder` | Generate AWS Lambda functions with IAM |
| `cloudflare-worker` | Generate Cloudflare Worker scripts |
| `vercel-config` | Generate Vercel project configurations |
| `s3-manager` | Generate S3 bucket policies and lifecycle |
| `dynamodb-designer` | Design DynamoDB tables with GSIs |
| `sqs-setup` | Generate SQS queue configs with DLQ |
| `sns-topics` | Generate SNS topic configurations |
| `step-functions` | Generate AWS Step Functions |
| `cloud-run` | Generate Google Cloud Run configs |
| `azure-functions` | Generate Azure Functions |
| `serverless-framework` | Generate Serverless Framework configs |
| `edge-config` | Generate edge computing configurations |
| `cdn-invalidation` | Generate CDN cache invalidation |
| `multi-region` | Generate multi-region deployment |
| `cloud-migration` | Generate cloud migration plans |

### Language-Specific Tools (20 plugins)
| Plugin | What It Does |
|--------|-------------|
| `python-setup` | Generate Python project: pyproject.toml, venvs, linting |
| `go-scaffold` | Generate Go project: modules, handlers, middleware |
| `rust-cargo` | Generate Rust project: Cargo.toml, workspace, CI |
| `java-spring` | Generate Spring Boot scaffolding |
| `dotnet-setup` | Generate .NET project setup |
| `swift-package` | Generate Swift package setup |
| `kotlin-gradle` | Generate Kotlin/Gradle project |
| `ruby-rails` | Generate Ruby on Rails setup |
| `php-laravel` | Generate Laravel scaffolding |
| `elixir-phoenix` | Generate Elixir/Phoenix setup |
| `python-fastapi` | Generate FastAPI project with routers |
| `python-django` | Generate Django project with apps |
| `node-express` | Generate Express.js with middleware |
| `node-fastify` | Generate Fastify with plugins |
| `node-nestjs` | Generate NestJS modules and services |
| `deno-setup` | Generate Deno project structure |
| `bun-setup` | Generate Bun project setup |
| `zig-build` | Generate Zig build configurations |
| `cpp-cmake` | Generate CMake for C++ projects |
| `flutter-setup` | Generate Flutter with state management |

### Build & Bundler Tools (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `vite-config` | Generate Vite configurations |
| `webpack-config` | Generate Webpack with optimizations |
| `esbuild-config` | Generate esbuild configurations |
| `rollup-config` | Generate Rollup for library bundling |
| `turbopack-config` | Generate Turbopack configurations |
| `babel-config` | Generate Babel with presets/plugins |
| `swc-config` | Generate SWC as Babel replacement |
| `tsconfig-gen` | Generate TypeScript configurations |
| `eslint-config` | Generate ESLint with rule explanations |
| `prettier-config` | Generate Prettier configurations |
| `stylelint-config` | Generate Stylelint for CSS/SCSS |
| `biome-config` | Generate Biome formatter+linter |
| `husky-setup` | Generate Husky + lint-staged |
| `changeset-setup` | Generate Changesets for version management |
| `nx-config` | Generate Nx workspace configurations |

### Auth & Identity (15 plugins)
| Plugin | What It Does |
|--------|-------------|
| `oauth-setup` | Generate OAuth 2.0/OIDC integration |
| `auth0-integration` | Generate Auth0 integration |
| `clerk-integration` | Generate Clerk authentication |
| `supabase-auth` | Generate Supabase Auth with RLS |
| `firebase-auth` | Generate Firebase Authentication |
| `passkey-setup` | Generate WebAuthn/Passkey auth |
| `magic-link` | Generate passwordless auth |
| `two-factor` | Generate 2FA/MFA (TOTP, SMS) |
| `api-key-manager` | Generate API key management |
| `session-manager` | Generate session management |
| `jwt-toolkit` | Generate JWT auth with refresh tokens |
| `sso-setup` | Generate SSO (SAML/OIDC) |
| `social-login` | Generate social login (Google, GitHub) |
| `permission-matrix` | Generate fine-grained permissions |
| `token-rotation` | Generate token rotation and revocation |

### Payment & Commerce (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `stripe-setup` | Generate Stripe: checkout, subscriptions, webhooks |
| `paypal-setup` | Generate PayPal integration |
| `billing-system` | Generate subscription billing with metering |
| `invoice-gen` | Generate invoice creation and management |
| `pricing-page` | Generate pricing page components |
| `checkout-flow` | Generate checkout with cart management |
| `tax-calculator` | Generate tax calculation integration |
| `refund-handler` | Generate refund processing |
| `usage-metering` | Generate usage-based billing |
| `entitlement` | Generate feature gating for SaaS |

### Logging & Observability (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `log-sleuth` | Analyze logs, search patterns, correlate across services |
| `winston-setup` | Generate Winston logger configurations |
| `pino-setup` | Generate Pino logger setup |
| `structured-log` | Generate structured logging for any language |
| `log-aggregator` | Generate log aggregation (ELK, Loki) |
| `error-tracking` | Generate Sentry/Bugsnag integration |
| `apm-setup` | Generate Application Performance Monitoring |
| `custom-metrics` | Generate custom metric collection |
| `log-sampling` | Generate log sampling strategies |
| `alert-rules` | Generate alerting rules for monitoring |

### API Clients & SDKs (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `sdk-generator` | Generate API client SDKs in multiple languages |
| `http-client` | Generate HTTP client wrappers with retry |
| `api-mock-server` | Generate standalone mock API servers |
| `postman-gen` | Generate Postman collections from code |
| `insomnia-gen` | Generate Insomnia workspace configs |
| `curl-gen` | Generate curl commands from specs |
| `api-rate-handler` | Generate client-side rate limit handling |
| `api-cache-client` | Generate API response caching |
| `graphql-client` | Generate typed GraphQL clients (Apollo, urql) |
| `trpc-setup` | Generate tRPC end-to-end type-safe APIs |

### Communication (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `notify-hub` | Set up email/SMS/push with templates and pipelines |
| `email-template` | Generate responsive HTML email templates |
| `sendgrid-setup` | Generate SendGrid integration |
| `ses-setup` | Generate AWS SES integration |
| `resend-setup` | Generate Resend email integration |
| `mailgun-setup` | Generate Mailgun integration |
| `twilio-setup` | Generate Twilio SMS/Voice integration |
| `slack-bot` | Generate Slack bot with slash commands |
| `discord-bot` | Generate Discord bot with commands |
| `push-notification` | Generate push notification (FCM, APNs, Web Push) |

### Storage & Files (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `file-storage` | Generate file storage abstraction (S3, GCS, local) |
| `image-pipeline` | Generate image processing pipeline |
| `video-transcoder` | Generate video transcoding configs |
| `asset-manager` | Generate digital asset management |
| `backup-strategy` | Generate automated backup strategies |
| `cdn-optimizer` | Generate CDN with cache optimization |
| `presigned-urls` | Generate presigned URL systems |
| `multipart-upload` | Generate chunked upload with resume |
| `file-validator` | Generate file validation |
| `media-library` | Generate media library management |

### Scheduling & Jobs (10 plugins)
| Plugin | What It Does |
|--------|-------------|
| `job-queue` | Generate background job queues (BullMQ, Celery) |
| `task-scheduler` | Generate task scheduling with cron |
| `workflow-engine` | Generate workflow execution engines |
| `retry-queue` | Generate dead letter queues and retry |
| `rate-queue` | Generate rate-limited job processing |
| `priority-queue` | Generate priority-based scheduling |
| `batch-job` | Generate batch processing with progress |
| `event-scheduler` | Generate event scheduling with timezones |
| `recurring-job` | Generate recurring job management |
| `job-dashboard` | Generate job monitoring dashboards |

## Architecture

Plugin Hub uses a single central MCP server that powers all plugins:

```
Your Project
    |
    v
Claude Code / Cowork
    |
    v
Plugin Hub MCP Server (@barnburner121/plugin-hub-mcp)
    |
    +-- env-guardian tools
    +-- api-forge tools
    +-- log-sleuth tools
    +-- ... (500+ tools)
```

Each plugin is a thin wrapper that connects to the central server. This means:
- Install once, get everything
- One update brings improvements across all tools
- No dependency conflicts between plugins
- Consistent API key and rate limiting across all tools

## Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| Free | $0 | 50 requests/day, all basic tools |
| Pro | $9/month | 10,000 requests/day, unlocks advanced tools (secret rotation, contract testing, log correlation, performance budgets, license compliance, and more) |
| Enterprise | $49/month | Unlimited requests, SLA guarantee, priority support |

## For AI Agents and Developers

This marketplace is designed to be discoverable by AI assistants. Each plugin includes:
- Clear, descriptive names following kebab-case convention
- Detailed SKILL.md files with tool names and usage instructions
- Structured plugin.json manifests
- MCP server tools that return actionable JSON instructions

If you're building with Claude Code, you can reference any of these plugins by name and Claude will know how to use them.

## Contributing

We welcome contributions! To add a new plugin:

1. Create a directory under `generated-plugins/<your-plugin-name>/`
2. Add `.claude-plugin/plugin.json`, `.mcp.json`, `skills/<name>/SKILL.md`, and `README.md`
3. Add your tool implementation in `src/tools/<your-plugin-name>.ts`
4. Submit a PR

## Links

- **npm**: [@barnburner121/plugin-hub-mcp](https://www.npmjs.com/package/@barnburner121/plugin-hub-mcp)
- **MCPize**: [plugin-hub-mcp on MCPize](https://mcpize.com/barnburner121/plugin-hub-mcp)
- **Submit to Official Marketplace**: [clau.de/plugin-directory-submission](https://clau.de/plugin-directory-submission)

## License

MIT
