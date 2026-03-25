# log-analyze

## Description

log-sleuth is an observability toolkit for analyzing log files. It detects patterns and anomalies in logs, provides structured search across log data, recommends logging best practices, and correlates events across multiple services for distributed debugging.

## When to Use

Activate this skill when the user asks to:

- Analyze log files for error patterns, anomalies, or trends
- Search through logs with structured queries (by level, timestamp, service, etc.)
- Get recommendations for improving logging practices in their codebase
- Correlate log events across multiple services or microservices

## Tools

### log_analyze
Analyzes log files to detect patterns, recurring errors, anomalies, and trends. Produces a summary report with error frequency, timeline analysis, and root cause suggestions.

**Use when:** The user wants to understand what is happening in their logs, find the most common errors, identify anomalies, or get a high-level overview of system behavior from log data.

### log_search
Searches log files using structured queries with filters for log level, timestamp ranges, service names, request IDs, and custom field values. Supports regex patterns and full-text search.

**Use when:** The user wants to find specific log entries, filter logs by severity or time window, trace a request by ID, or search for specific error messages.

### log_recommend
Analyzes the codebase's logging practices and provides actionable recommendations for improvement. Checks for missing error context, inconsistent log levels, unstructured log formats, and missing correlation IDs.

**Use when:** The user wants to improve their logging strategy, adopt structured logging, ensure adequate observability coverage, or follow logging best practices.

### log_correlate (Pro)
Correlates log events across multiple services using request IDs, timestamps, and causal relationships. Builds a timeline of events across service boundaries for distributed system debugging.

**Use when:** The user needs to trace a request across microservices, debug a distributed system issue, or understand the sequence of events across multiple services during an incident.

## Allowed Tools

- Read
- Write
- Edit
- Bash
- Grep
- Glob
