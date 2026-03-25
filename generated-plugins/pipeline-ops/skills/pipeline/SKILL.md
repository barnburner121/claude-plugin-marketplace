# pipeline

## Description

pipeline-ops is a CI/CD engineering toolkit. It generates pipeline configurations for popular CI platforms, debugs build failures by analyzing logs and configs, optimizes pipeline execution speed, and creates multi-environment deployment matrices.

## When to Use

Activate this skill when the user asks to:

- Generate CI/CD pipeline configurations (GitHub Actions, GitLab CI, CircleCI, Jenkins, etc.)
- Debug a failing CI build or pipeline error
- Optimize pipeline speed, caching, and parallelism
- Create multi-environment or multi-platform build matrices

## Tools

### pipeline_generate
Generates CI/CD pipeline configurations for popular platforms (GitHub Actions, GitLab CI, CircleCI, Jenkins, Azure DevOps). Analyzes the project structure, language, framework, and dependencies to produce a production-ready pipeline with build, test, lint, and deploy stages.

**Use when:** The user wants to set up CI/CD for a project, migrate between CI platforms, or create a new pipeline configuration from scratch.

### pipeline_debug
Debugs CI/CD build failures by analyzing pipeline logs, configuration files, and error messages. Identifies root causes such as dependency issues, environment mismatches, permission errors, and flaky tests. Provides fix suggestions.

**Use when:** The user has a failing CI build, pipeline error, or deployment failure and needs help understanding and fixing the issue.

### pipeline_optimize
Analyzes existing pipeline configurations to identify optimization opportunities. Suggests caching strategies, parallelism improvements, job splitting, conditional execution, and artifact management to reduce pipeline duration.

**Use when:** The user wants to speed up their CI/CD pipeline, reduce build times, or optimize resource usage in their pipelines.

### pipeline_matrix (Pro)
Creates multi-environment and multi-platform build matrices for comprehensive testing across OS versions, language versions, dependency versions, and deployment targets. Supports conditional inclusion and failure tolerance.

**Use when:** The user needs to test across multiple environments, set up cross-platform builds, or create a deployment matrix for multiple staging/production environments.

## Allowed Tools

- Read
- Write
- Edit
- Bash
- Grep
- Glob
