# 200 Plugin Ideas — Master List
## Generated: 2026-03-25

Existing 10 plugins (1-10): env-guardian, api-forge, log-sleuth, perf-pilot, pipeline-ops, dep-shield, cost-hawk, schema-drift, notify-hub, uptime-sentinel

---

## Security & Hardening (11-25)
11. **iac-scanner** — Scan Terraform/CloudFormation/K8s manifests for misconfigurations and security issues
12. **container-guard** — Audit Dockerfiles and docker-compose for security best practices, image vulnerabilities
13. **cors-config** — Analyze and fix CORS configurations across API endpoints
14. **csp-builder** — Generate and validate Content Security Policy headers for web apps
15. **auth-architect** — Generate authentication flows (JWT, OAuth2, session-based) with best practices
16. **rbac-forge** — Generate role-based access control systems with permission matrices
17. **input-sanitizer** — Scan code for missing input validation and generate sanitization middleware
18. **sql-armor** — Detect SQL injection vulnerabilities and generate parameterized query fixes
19. **xss-shield** — Scan templates and frontend code for XSS vulnerabilities
20. **secrets-vault** — Generate HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault integrations
21. **ssl-manager** — Check SSL certificate configs, generate renewal scripts, fix TLS settings
22. **owasp-checker** — Scan codebase against OWASP Top 10 and generate remediation plans
23. **gdpr-toolkit** — Generate GDPR compliance code: consent forms, data export, deletion endpoints
24. **hipaa-guard** — Audit code for HIPAA compliance issues: PHI handling, encryption, audit trails
25. **soc2-prep** — Generate SOC2 compliance artifacts: access logs, change management docs, policies

## Code Quality & Refactoring (26-45)
26. **dead-code** — Find and remove unused code, functions, imports, and variables
27. **code-smells** — Detect code smells (long methods, god classes, feature envy) with refactoring suggestions
28. **duplication-hunter** — Find duplicate/similar code blocks and suggest DRY refactoring
29. **complexity-reducer** — Analyze cyclomatic complexity and suggest simplifications
30. **naming-conventions** — Enforce and fix naming conventions across a codebase
31. **import-optimizer** — Clean up and organize imports, remove unused, add missing
32. **error-handler** — Audit error handling patterns and add proper try/catch, error boundaries
33. **null-safety** — Find null/undefined issues and add proper null checks or optional chaining
34. **async-fixer** — Detect async/await anti-patterns: missing awaits, unhandled promises, race conditions
35. **type-strengthener** — Strengthen TypeScript types: replace `any`, add generics, improve interfaces
36. **magic-numbers** — Find magic numbers/strings and extract to named constants
37. **comment-quality** — Audit comments: remove outdated, add missing JSDoc/docstrings for public APIs
38. **function-splitter** — Identify functions that are too long and suggest how to split them
39. **dependency-injector** — Refactor hard-coded dependencies to use dependency injection patterns
40. **solid-checker** — Analyze code against SOLID principles and suggest improvements
41. **pattern-matcher** — Identify where design patterns should be applied (factory, strategy, observer)
42. **tech-debt-tracker** — Scan codebase for TODO/FIXME/HACK comments and generate a tech debt report
43. **code-metrics** — Generate comprehensive code metrics: lines, complexity, coverage, maintainability
44. **refactor-planner** — Create prioritized refactoring plans based on code quality analysis
45. **legacy-modernizer** — Identify legacy patterns and suggest modern replacements (callbacks to async/await, var to const/let)

## Documentation (46-60)
46. **api-docs** — Generate OpenAPI/Swagger specs from route handlers and controllers
47. **readme-gen** — Generate comprehensive README.md files from project analysis
48. **changelog-gen** — Generate changelogs from git commits using conventional commit format
49. **jsdoc-writer** — Generate JSDoc/TSDoc comments for all exported functions and classes
50. **architecture-docs** — Generate architecture documentation with diagrams from codebase analysis
51. **onboarding-guide** — Generate developer onboarding guides for a project
52. **runbook-writer** — Generate operational runbooks for services and infrastructure
53. **adr-creator** — Create Architecture Decision Records from codebase context
54. **api-changelog** — Detect API changes between versions and generate API changelogs
55. **storybook-gen** — Generate Storybook stories for React/Vue/Angular components
56. **diagram-gen** — Generate Mermaid/PlantUML diagrams from code structure
57. **glossary-builder** — Extract domain terms from codebase and generate a project glossary
58. **contrib-guide** — Generate CONTRIBUTING.md with project-specific guidelines
59. **license-gen** — Generate LICENSE files and license headers for source files
60. **release-notes** — Generate user-facing release notes from PRs and commits

## Testing (61-80)
61. **unit-test-gen** — Generate unit tests for functions and classes with edge cases
62. **integration-test-gen** — Generate integration tests for service interactions
63. **e2e-scenario** — Generate end-to-end test scenarios from user stories or requirements
64. **snapshot-test** — Generate snapshot tests for UI components
65. **fixture-factory** — Generate test fixtures and factories for complex data models
66. **mock-builder** — Generate mocks, stubs, and fakes for external dependencies
67. **coverage-analyzer** — Analyze test coverage gaps and suggest which tests to write next
68. **property-tester** — Generate property-based tests for functions with complex inputs
69. **mutation-test** — Set up mutation testing to verify test quality
70. **regression-guard** — Generate regression tests from bug reports or recent fixes
71. **accessibility-test** — Generate accessibility tests (WCAG compliance) for web UIs
72. **visual-regression** — Set up visual regression testing with screenshot comparison
73. **chaos-engineer** — Generate chaos engineering experiments for resilience testing
74. **data-gen** — Generate realistic test data for any schema or data model
75. **test-organizer** — Reorganize and structure test suites following best practices
76. **smoke-test** — Generate quick smoke tests for deployment verification
77. **test-parallelizer** — Analyze and configure test parallelization for faster CI
78. **flaky-test-finder** — Identify and fix flaky tests with root cause analysis
79. **test-reporter** — Generate custom test report formats (JUnit XML, HTML, Markdown)
80. **contract-test-gen** — Generate consumer-driven contract tests for microservices

## Frontend Development (81-100)
81. **responsive-audit** — Audit CSS for responsive design issues and generate fixes
82. **a11y-fixer** — Scan HTML/JSX for accessibility issues and generate ARIA fixes
83. **css-optimizer** — Find unused CSS, duplicate rules, and optimization opportunities
84. **component-gen** — Generate React/Vue/Svelte components from descriptions
85. **form-builder** — Generate form components with validation from data schemas
86. **i18n-extractor** — Extract hardcoded strings and set up internationalization
87. **theme-builder** — Generate theme systems (dark mode, custom themes) for CSS/Tailwind
88. **animation-helper** — Generate CSS/Framer Motion animations from descriptions
89. **seo-auditor** — Audit web apps for SEO issues: meta tags, structured data, performance
90. **bundle-analyzer** — Analyze and optimize JavaScript bundle size
91. **image-optimizer** — Generate image optimization pipelines: lazy loading, srcset, WebP conversion
92. **font-optimizer** — Optimize web font loading: subsetting, preloading, fallbacks
93. **pwa-builder** — Generate Progressive Web App setup: service worker, manifest, offline support
94. **meta-tag-gen** — Generate meta tags, Open Graph, Twitter Card tags for pages
95. **sitemap-gen** — Generate XML sitemaps from route definitions
96. **web-vitals** — Set up Core Web Vitals monitoring and optimization
97. **tailwind-helper** — Convert CSS to Tailwind classes, optimize Tailwind config
98. **state-manager** — Generate state management setup (Redux, Zustand, Pinia, etc.)
99. **router-gen** — Generate route configurations from file structure or specs
100. **error-boundary** — Generate error boundary components with fallback UIs

## Backend & API Design (101-120)
101. **rest-designer** — Design RESTful APIs following best practices from requirements
102. **graphql-builder** — Generate GraphQL schemas, resolvers, and type definitions
103. **grpc-gen** — Generate gRPC protobuf definitions and service implementations
104. **websocket-setup** — Set up WebSocket servers with rooms, auth, and reconnection
105. **rate-limiter** — Generate rate limiting middleware for APIs with configurable strategies
106. **cache-architect** — Design caching strategies: Redis setup, cache invalidation, cache-aside patterns
107. **queue-builder** — Set up message queues (BullMQ, SQS, RabbitMQ) with workers and retry logic
108. **pagination-gen** — Generate pagination implementations (cursor, offset, keyset)
109. **file-upload** — Generate file upload systems: multipart, presigned URLs, S3 integration
110. **search-builder** — Set up full-text search with Elasticsearch, Meilisearch, or Typesense
111. **event-system** — Generate event-driven architectures: event bus, pub/sub, event sourcing
112. **middleware-gen** — Generate Express/Fastify/Koa middleware chains from requirements
113. **validator-gen** — Generate request validation schemas (Zod, Joi, Yup) from API specs
114. **serializer-gen** — Generate data serialization/transformation layers between API and DB
115. **webhook-builder** — Generate webhook systems: sending, receiving, retry, signature verification
116. **batch-processor** — Generate batch processing systems for large data operations
117. **cron-scheduler** — Generate cron job configurations and scheduled task systems
118. **feature-flag** — Generate feature flag systems with A/B testing support
119. **health-dashboard** — Generate admin dashboards for service health and metrics
120. **api-versioning** — Set up API versioning strategies (URL, header, content negotiation)

## Database & Data (121-145)
121. **query-optimizer** — Analyze SQL queries and suggest index and query optimizations
122. **seed-gen** — Generate database seeder scripts with realistic data
123. **backup-planner** — Generate database backup strategies and restoration scripts
124. **redis-patterns** — Generate Redis usage patterns: caching, sessions, pub/sub, rate limiting
125. **mongo-optimizer** — Analyze MongoDB queries, indexes, and schema design
126. **postgres-tuner** — Generate PostgreSQL configuration tuning for workload profiles
127. **data-anonymizer** — Generate data anonymization scripts for dev/staging environments
128. **etl-builder** — Generate ETL pipeline code for data transformation workflows
129. **csv-processor** — Generate CSV/Excel import/export functionality with validation
130. **data-validator** — Generate data validation rules and cleaning pipelines
131. **timeseries-setup** — Set up time series data storage and querying (InfluxDB, TimescaleDB)
132. **graph-db** — Generate graph database schemas and queries (Neo4j, Dgraph)
133. **multi-tenant** — Generate multi-tenancy database patterns (schema-per-tenant, row-level)
134. **soft-delete** — Generate soft delete implementations with cascading and restoration
135. **audit-trail** — Generate database audit trail systems for compliance
136. **data-archiver** — Generate data archival strategies and implementation
137. **connection-pool** — Analyze and optimize database connection pooling configurations
138. **read-replica** — Generate read replica routing configurations
139. **sharding-setup** — Generate database sharding strategies and routing
140. **materialized-views** — Generate materialized view definitions for complex queries
141. **json-schema-gen** — Generate JSON schemas from example data or TypeScript types
142. **orm-query-builder** — Generate optimized ORM queries from natural language
143. **data-catalog** — Generate data dictionaries and catalogs from database schemas
144. **migration-linter** — Lint database migrations for safety issues before running
145. **fixture-snapshot** — Generate database fixture snapshots for consistent testing

## DevOps & Infrastructure (146-170)
146. **k8s-manifest** — Generate Kubernetes manifests (deployments, services, ingress) from requirements
147. **helm-chart** — Generate Helm charts for Kubernetes applications
148. **docker-compose** — Generate docker-compose files for local development environments
149. **nginx-config** — Generate Nginx configurations: reverse proxy, SSL, load balancing
150. **terraform-module** — Generate Terraform modules for common infrastructure patterns
151. **ansible-playbook** — Generate Ansible playbooks for server configuration
152. **github-actions** — Generate GitHub Actions workflows for any project type
153. **gitlab-ci** — Generate GitLab CI pipelines optimized for project needs
154. **makefile-gen** — Generate Makefiles for project automation
155. **systemd-service** — Generate systemd service files for Linux deployments
156. **log-rotation** — Set up log rotation configurations for applications and servers
157. **monitoring-stack** — Generate monitoring stack setup (Prometheus, Grafana, alerts)
158. **dns-config** — Generate DNS configurations and migration plans
159. **cdn-setup** — Generate CDN configurations for static assets and API caching
160. **load-balancer** — Generate load balancer configurations with health checks
161. **auto-scaling** — Generate auto-scaling policies for cloud deployments
162. **disaster-recovery** — Generate disaster recovery plans and runbooks
163. **blue-green** — Generate blue-green deployment configurations
164. **canary-deploy** — Generate canary deployment strategies with rollback
165. **git-hooks** — Generate Git hooks for pre-commit, pre-push validation
166. **release-manager** — Generate release workflows: tagging, branching, changelog, notifications
167. **infra-diagram** — Generate infrastructure diagrams from IaC files
168. **cost-alert** — Generate cloud cost alerting and budget configurations
169. **resource-tagger** — Generate cloud resource tagging strategies and enforcement
170. **compliance-scanner** — Scan infrastructure configs against CIS benchmarks

## Microservices & Architecture (171-185)
171. **service-scaffold** — Generate microservice boilerplate with standard patterns
172. **api-gateway** — Generate API gateway configurations (Kong, AWS API Gateway)
173. **circuit-breaker** — Generate circuit breaker patterns for service communication
174. **service-mesh** — Generate service mesh configurations (Istio, Linkerd)
175. **saga-pattern** — Generate saga pattern implementations for distributed transactions
176. **cqrs-setup** — Generate CQRS (Command Query Responsibility Segregation) patterns
177. **event-sourcing** — Generate event sourcing implementations with event stores
178. **service-discovery** — Generate service discovery configurations (Consul, etcd)
179. **distributed-tracing** — Generate distributed tracing setup (OpenTelemetry, Jaeger)
180. **idempotency** — Generate idempotency implementations for API endpoints
181. **retry-policy** — Generate retry policies with exponential backoff for service calls
182. **bulkhead-pattern** — Generate bulkhead isolation patterns for service resilience
183. **config-server** — Generate centralized configuration management for microservices
184. **service-template** — Generate microservice templates with standard observability and patterns
185. **dependency-graph** — Visualize service dependencies and detect circular dependencies

## Developer Productivity (186-210)
186. **project-init** — Generate project scaffolding for any framework with best practices
187. **env-sync** — Generate environment synchronization scripts across team members
188. **git-workflow** — Generate Git branching strategies and workflow documentation
189. **pr-template** — Generate PR templates with checklists tailored to the project
190. **issue-template** — Generate GitHub/GitLab issue templates for bugs, features, tasks
191. **commit-linter** — Set up conventional commit linting with commitlint and husky
192. **editor-config** — Generate unified editor configurations (EditorConfig, Prettier, ESLint)
193. **devcontainer** — Generate VS Code devcontainer configs for consistent dev environments
194. **script-runner** — Generate npm/package scripts for common project tasks
195. **alias-gen** — Generate shell aliases and functions for project-specific commands
196. **workspace-setup** — Generate monorepo workspace configurations (Turborepo, Nx, pnpm)
197. **debug-config** — Generate VS Code/JetBrains debug configurations for any stack
198. **snippet-gen** — Generate code snippets for IDE based on project patterns
199. **regex-builder** — Build and test regex patterns with explanations
200. **codemod-gen** — Generate codemods for automated code transformations
201. **boilerplate-killer** — Detect and generate abstractions for repetitive boilerplate code
202. **cli-builder** — Generate CLI tools from function signatures (Commander, yargs, clap)
203. **config-validator** — Validate and generate configuration file schemas
204. **dotfile-gen** — Generate project dotfiles (.editorconfig, .prettierrc, .eslintrc, etc.)
205. **task-runner** — Generate task runner configurations (Taskfile, Just, Make)
206. **version-bumper** — Generate semantic version bumping with changelog updates
207. **dependency-graph-viz** — Visualize project dependency trees and find optimization opportunities
208. **code-tour** — Generate interactive code tours for onboarding new developers
209. **benchmark-suite** — Generate micro-benchmark suites for critical code paths
210. **migration-assistant** — Generate migration guides between framework versions

## Cloud & Serverless (211-225)
211. **lambda-builder** — Generate AWS Lambda functions with proper IAM, layers, and triggers
212. **cloudflare-worker** — Generate Cloudflare Worker scripts for edge computing
213. **vercel-config** — Generate Vercel project configurations with edge functions
214. **s3-manager** — Generate S3 bucket policies, lifecycle rules, and access patterns
215. **dynamodb-designer** — Design DynamoDB tables with proper key schema and GSIs
216. **sqs-setup** — Generate SQS queue configurations with DLQ and retry policies
217. **sns-topics** — Generate SNS topic configurations with fan-out patterns
218. **step-functions** — Generate AWS Step Functions state machines from workflow descriptions
219. **cloud-run** — Generate Google Cloud Run service configurations
220. **azure-functions** — Generate Azure Functions with bindings and triggers
221. **serverless-framework** — Generate Serverless Framework configurations
222. **edge-config** — Generate edge computing configurations for low-latency use cases
223. **cdn-invalidation** — Generate CDN cache invalidation strategies and scripts
224. **multi-region** — Generate multi-region deployment strategies
225. **cloud-migration** — Generate cloud migration plans from on-premise architectures
