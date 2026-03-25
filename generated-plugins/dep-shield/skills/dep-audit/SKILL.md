# dep-audit

## Description

The dep-audit skill provides dependency auditing, vulnerability scanning, license compliance checks, and update planning for software projects. Use this skill whenever the user asks about dependency security, outdated packages, license issues, or planning dependency upgrades.

## Allowed Tools

Read, Write, Edit, Bash, Grep, Glob

## Tools

### dep_audit
Use this tool to scan a project's dependencies for known security vulnerabilities. It checks against public vulnerability databases (CVE, GitHub Advisory, OSV) and returns a list of affected packages with severity ratings, descriptions, and recommended fix versions. Invoke this when the user asks to "audit dependencies," "check for vulnerabilities," or "scan for CVEs."

### dep_outdated
Use this tool to check which dependencies in a project are outdated. It compares installed versions against the latest available versions and categorizes updates as patch, minor, or major. Invoke this when the user asks to "find outdated packages," "check for updates," or "see what needs upgrading."

### dep_license_check (Pro)
Use this tool to scan all dependency licenses and check them against a compliance policy. It identifies packages with copyleft, unknown, or restricted licenses that may conflict with the project's licensing requirements. Invoke this when the user asks about "license compliance," "license audit," or "check dependency licenses." This is a Pro-tier tool.

### dep_update_plan
Use this tool to generate a safe, ordered update plan for dependencies. It analyzes dependency graphs, identifies breaking changes, groups related updates, and suggests a phased rollout strategy. Invoke this when the user asks to "plan updates," "create an upgrade strategy," or "figure out the safest update order."

## Workflow

1. Start with `dep_audit` to identify any critical vulnerabilities that need immediate attention.
2. Use `dep_outdated` to see the full picture of available updates.
3. Run `dep_license_check` to ensure no license conflicts exist (Pro users).
4. Generate a `dep_update_plan` to create a safe, prioritized update roadmap.
