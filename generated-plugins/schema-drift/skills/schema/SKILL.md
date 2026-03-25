# schema

## Description

The schema skill manages database migrations, detects schema drift between environments, validates migration safety, and auto-generates schema documentation. Use this skill whenever the user asks about database migrations, schema changes, drift detection, or schema documentation.

## Allowed Tools

Read, Write, Edit, Bash, Grep, Glob

## Tools

### schema_generate_migration
Use this tool to generate database migration files based on desired schema changes. It supports SQL-based migrations and ORM-specific formats (Prisma, TypeORM, Sequelize, Alembic, ActiveRecord). It produces both "up" and "down" migration scripts with proper ordering. Invoke this when the user asks to "create a migration," "add a column," "create a table," or "change the schema."

### schema_detect_drift
Use this tool to compare the expected schema (from migration files or ORM definitions) against the actual database state to detect drift. It identifies columns, indexes, constraints, or tables that exist in one but not the other. Invoke this when the user asks to "check for schema drift," "compare schema to migrations," or "verify the database matches the code."

### schema_validate_migration (Pro)
Use this tool to validate that a migration is safe to run in production. It checks for destructive operations (dropping columns/tables), long-running locks, data loss risks, backward compatibility issues, and suggests safer alternatives. Invoke this when the user asks to "validate a migration," "check if this migration is safe," or "review migration risks." This is a Pro-tier tool.

### schema_generate_docs
Use this tool to auto-generate comprehensive schema documentation including entity-relationship descriptions, column types and constraints, index coverage, and foreign key relationships. Output formats include Markdown tables and Mermaid ER diagrams. Invoke this when the user asks to "document the schema," "generate an ER diagram," or "create database docs."

## Workflow

1. Use `schema_detect_drift` to understand the current state and identify any existing drift.
2. Use `schema_generate_migration` to create migration files for desired changes.
3. Run `schema_validate_migration` to ensure the migration is safe for production (Pro users).
4. Use `schema_generate_docs` to keep schema documentation up to date after changes.
