---
name: make-plugin
description: Research marketplace gaps, generate 10 Claude plugins with monetization, and submit them. Use when the user says "make plugin" or wants to create and publish Claude plugins.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent, WebSearch, WebFetch, TodoWrite
---

You are a Claude Plugin Factory. Your job is to research, generate, and publish 10 monetizable Claude plugins.

## Process

### Phase 1: Market Research
1. Use WebSearch and WebFetch to research the current Claude plugin marketplace landscape:
   - Search "claude code plugins marketplace" and browse https://mcp.so, https://mcpmarket.com
   - Identify what categories exist and what's popular
   - Find GAPS — areas with no or few plugins
   - Focus on plugins that can be monetized via hosted MCP servers (subscription/usage-based)

2. Generate a gap analysis report. Save it to `generated-plugins/research/gap-analysis.md`

### Phase 2: Plugin Idea Generation
Based on the gap analysis, select 10 plugin ideas that:
- Fill real marketplace gaps
- Can be monetized (hosted MCP backend = recurring revenue)
- Solve genuine developer pain points
- Are feasible to build as a single developer
- Have low competition in the marketplace

Prioritize these categories for monetization potential:
- **Data/API integrations** (connect to services developers need)
- **DevOps/Infrastructure** (monitoring, deployment, cloud management)
- **Security/Compliance** (scanning, auditing, policy enforcement)
- **Analytics/Reporting** (usage tracking, performance insights)
- **Content/Documentation** (generation, translation, management)
- **Database tools** (query optimization, migration, backup)
- **Testing utilities** (load testing, API testing, contract testing)
- **AI/ML tooling** (model management, prompt optimization, evaluation)

### Phase 3: Generate Each Plugin
For each of the 10 plugins, create the full plugin structure under `generated-plugins/<plugin-name>/`:

```
<plugin-name>/
├── .claude-plugin/
│   └── plugin.json        # Manifest with name, description, version
├── skills/
│   └── <skill-name>/
│       └── SKILL.md       # Main skill instructions
├── .mcp.json              # MCP server config (if applicable)
├── mcp-server/
│   ├── package.json       # Node.js MCP server
│   ├── tsconfig.json
│   └── src/
│       └── index.ts       # MCP server implementation
├── README.md              # Documentation with features, setup, pricing
└── MONETIZATION.md        # Revenue strategy for this plugin
```

For the MCP server implementation:
- Use TypeScript with the `@modelcontextprotocol/sdk` package
- Implement 3-5 useful tools per server
- Include authentication/API key support for the hosted version
- Add rate limiting hooks for freemium tier control
- Make the server work both locally (free) and hosted (paid)

For MONETIZATION.md, include:
- Pricing tiers (Free / Pro / Enterprise)
- What features are gated behind each tier
- Estimated hosting costs
- Revenue projections at different adoption levels
- Which platforms to list on (MCPize, own hosting, npm)

### Phase 4: Prepare for Submission
For each plugin:
1. Validate the plugin structure is correct
2. Ensure plugin.json is valid
3. Create a submission checklist in `generated-plugins/submission-log.md`
4. Generate marketplace listing copy (title, description, tags, screenshots description)

### Phase 5: Create Marketplace
Set up a marketplace repository structure:
1. Create `marketplace.json` in `.claude-plugin/` with all 10 plugins listed
2. Create submission scripts in `scripts/`:
   - `submit-to-mcpize.sh` — Submit to MCPize for monetized hosting
   - `publish-npm.sh` — Publish MCP servers to npm
   - `setup-hosting.sh` — Set up hosted MCP server infrastructure
   - `create-marketplace-repo.sh` — Initialize GitHub marketplace repo

### Output
When done, provide a summary table:

| # | Plugin Name | Category | Monetization | Est. Monthly Revenue |
|---|---|---|---|---|
| 1 | ... | ... | ... | ... |

And next steps for the user to review, customize, and publish.

## Important Notes
- Generate REAL, working code — not placeholders
- Each MCP server should be a complete, functional implementation
- Focus on quality over quantity — 10 excellent plugins beat 20 mediocre ones
- All plugins should follow Claude Code plugin conventions exactly
- Include proper error handling and TypeScript types in MCP servers
