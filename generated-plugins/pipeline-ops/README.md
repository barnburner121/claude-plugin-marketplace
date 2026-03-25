# pipeline-ops

**Generate CI/CD pipelines, debug build failures, optimize pipeline speed, and create multi-environment matrices.**

Category: DevOps / CI/CD

## Features

### Free Tier
- **Pipeline Generation** -- Generate production-ready CI/CD configs for GitHub Actions, GitLab CI, CircleCI, Jenkins, and more with `pipeline_generate`.
- **Build Debugging** -- Diagnose and fix failing builds by analyzing logs, configs, and error messages with `pipeline_debug`.
- **Pipeline Optimization** -- Speed up your pipelines with caching, parallelism, and conditional execution recommendations with `pipeline_optimize`.

### Pro Tier
- **Multi-Environment Matrices** -- Create build matrices across OS versions, language versions, and deployment targets with `pipeline_matrix`.
- Unlimited daily requests.
- Priority support.

## Installation

```
/plugin install pipeline-ops@barnburner121
```

## Usage Examples

**Generate a GitHub Actions pipeline:**
```
> Generate a GitHub Actions CI pipeline for this Node.js project with build, test, lint, and deploy stages.
```

**Debug a failing build:**
```
> My CI build is failing with "Module not found" errors. Here are the logs -- help me fix it.
```

**Optimize pipeline speed:**
```
> My pipeline takes 25 minutes. Analyze it and suggest ways to make it faster.
```

**Create a build matrix (Pro):**
```
> Create a test matrix that runs against Node 18, 20, and 22 on both Ubuntu and macOS.
```

## Pricing

| Plan       | Price        | Requests       | Features                                 |
|------------|-------------|----------------|------------------------------------------|
| Free       | $0          | 50 req/day     | Generate, Debug, Optimize                |
| Pro        | $9/mo       | Unlimited      | All tools including Multi-Env Matrices   |
| Enterprise | $49/mo      | Unlimited + SLA| All tools + dedicated support            |

## License

MIT
