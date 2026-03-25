# schema-drift

**Generate database migrations, detect schema drift, validate migration safety, and auto-document schemas.**

Category: Database

---

## Features

### Free Tier
- **Migration Generation** -- Generate up/down migration files for SQL, Prisma, TypeORM, Sequelize, Alembic, and ActiveRecord with proper ordering and dependency resolution.
- **Schema Drift Detection** -- Compare your expected schema (from migration files or ORM definitions) against the actual database to find discrepancies in columns, indexes, constraints, and tables.
- **Schema Documentation** -- Auto-generate comprehensive schema docs with entity-relationship descriptions, column details, index coverage, and Mermaid ER diagrams.

### Pro Tier
- **Migration Safety Validation** -- Validate migrations before production deployment. Detect destructive operations, long-running locks, data loss risks, and backward compatibility issues with safer alternatives suggested.
- Everything in Free, with unlimited requests.

---

## Installation

```
/plugin install schema-drift@barnburner121
```

---

## Usage Examples

**Generate a migration:**
> "Create a migration to add a 'status' column to the orders table with a default value of 'pending'."

**Detect schema drift:**
> "Compare my Prisma schema against the actual database and show me any drift."

**Validate migration safety (Pro):**
> "Check if this migration is safe to run in production -- it drops a column and adds an index."

**Generate schema docs:**
> "Generate an ER diagram and documentation for the entire database schema."

---

## Pricing

| Plan       | Price       | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | schema_generate_migration, schema_detect_drift, schema_generate_docs |
| Pro        | $9/mo       | Unlimited      | All tools including schema_validate_migration |
| Enterprise | $49/mo      | Unlimited + SLA| Priority support, custom validation rules |

---

## License

MIT
