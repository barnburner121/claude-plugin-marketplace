# env-guardian

**Scan for exposed secrets, generate .env templates, validate environment configs, and rotate secrets.**

Category: Security / DevOps

## Features

### Free Tier
- **Secret Scanning** -- Detect hardcoded API keys, passwords, tokens, and connection strings across your entire codebase with `env_scan_secrets`.
- **Template Generation** -- Automatically generate `.env.example` files from your existing environment config with `env_generate_template`.
- **Config Validation** -- Validate your environment variables against schemas, check for missing required values, and catch format errors with `env_validate`.

### Pro Tier
- **Secret Rotation** -- Rotate compromised or expired secrets and update all references across your project with `env_rotate_secrets`.
- Unlimited daily requests.
- Priority support.

## Installation

```
/plugin install env-guardian@barnburner121
```

## Usage Examples

**Scan for leaked secrets:**
```
> Scan this project for any exposed secrets or hardcoded credentials.
```

**Generate an env template:**
```
> Create a .env.example file from my current .env so I can safely commit it.
```

**Validate environment config:**
```
> Check if my environment variables match the required schema for production.
```

**Rotate a compromised key (Pro):**
```
> My AWS access key was exposed. Rotate it and update all references in the project.
```

## Pricing

| Plan       | Price        | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | Scan, Template, Validate        |
| Pro        | $9/mo       | Unlimited      | All tools including Rotate      |
| Enterprise | $49/mo      | Unlimited + SLA| All tools + dedicated support   |

## License

MIT
