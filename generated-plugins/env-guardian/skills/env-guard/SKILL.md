# env-guard

## Description

env-guardian helps developers secure their environment configurations. It scans codebases for exposed secrets, generates .env templates from existing configs, validates environment variable setups against schemas, and rotates compromised secrets.

## When to Use

Activate this skill when the user asks to:

- Scan a project for leaked or hardcoded secrets (API keys, passwords, tokens, connection strings)
- Generate a `.env.example` or `.env.template` file from an existing `.env` or codebase
- Validate environment variables against expected schemas or required values
- Rotate or replace compromised secrets across config files

## Tools

### env_scan_secrets
Scans the current project directory for exposed secrets, API keys, tokens, passwords, and other sensitive values hardcoded in source files. Returns a report of findings with file locations and severity levels.

**Use when:** The user wants to check for leaked secrets, audit security posture, or run a pre-commit secrets check.

### env_generate_template
Generates a `.env.example` or `.env.template` file by analyzing the current `.env` file or scanning source code for referenced environment variables. Strips actual values and adds descriptive comments.

**Use when:** The user wants to create a safe-to-commit env template, onboard new developers, or document required environment variables.

### env_validate
Validates the current environment configuration against a schema or expected set of variables. Checks for missing required variables, invalid formats, and type mismatches.

**Use when:** The user wants to verify their environment setup is correct, debug missing config issues, or enforce env var standards in CI.

### env_rotate_secrets (Pro)
Rotates compromised or expired secrets by generating new values and updating all references across the project. Supports common secret formats and integrates with secret managers.

**Use when:** The user needs to rotate API keys, database passwords, or other secrets after a security incident or as part of routine key rotation.

## Allowed Tools

- Read
- Write
- Edit
- Bash
- Grep
- Glob
