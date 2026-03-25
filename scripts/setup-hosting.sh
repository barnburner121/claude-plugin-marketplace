#!/bin/bash
# Set up hosted MCP server infrastructure for monetized plugins
set -euo pipefail

echo "=== Setting Up Hosted MCP Server Infrastructure ==="
echo ""
echo "This script prepares your MCP servers for hosted deployment."
echo ""

GENERATED_DIR="$(dirname "$0")/../generated-plugins"
INFRA_DIR="$(dirname "$0")/../infrastructure"

mkdir -p "$INFRA_DIR"

# Generate Docker Compose for all MCP servers
cat > "$INFRA_DIR/docker-compose.yml" << 'HEADER'
version: '3.8'

services:
  # Reverse proxy for all MCP servers
  caddy:
    image: caddy:2-alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on: []

HEADER

CADDY_ROUTES=""
PORT=3001

for plugin_dir in "$GENERATED_DIR"/*/; do
  if [ -d "$plugin_dir/mcp-server" ]; then
    plugin_name=$(basename "$plugin_dir")
    service_name=$(echo "$plugin_name" | tr '-' '_')

    cat >> "$INFRA_DIR/docker-compose.yml" << EOF
  ${service_name}:
    build: ../generated-plugins/${plugin_name}/mcp-server
    ports:
      - "${PORT}:3000"
    environment:
      - STRIPE_API_KEY=\${STRIPE_API_KEY}
      - API_KEY_SECRET=\${API_KEY_SECRET}
      - NODE_ENV=production
    restart: unless-stopped

EOF

    CADDY_ROUTES="${CADDY_ROUTES}
  handle_path /${plugin_name}/* {
    reverse_proxy ${service_name}:3000
  }"

    PORT=$((PORT + 1))
  fi
done

cat >> "$INFRA_DIR/docker-compose.yml" << 'FOOTER'
volumes:
  caddy_data:
FOOTER

# Generate Caddyfile
cat > "$INFRA_DIR/Caddyfile" << EOF
{
  email your-email@example.com
}

mcp.yourdomain.com {
  ${CADDY_ROUTES}
}
EOF

# Generate Dockerfile template for MCP servers
cat > "$INFRA_DIR/Dockerfile.mcp-template" << 'EOF'
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/index.js"]
EOF

# Generate .env template
cat > "$INFRA_DIR/.env.example" << 'EOF'
# Stripe for payment processing
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# API key signing secret
API_KEY_SECRET=your-random-secret-here

# Domain
DOMAIN=mcp.yourdomain.com
EOF

echo "Infrastructure files created in: $INFRA_DIR/"
echo ""
echo "Files created:"
echo "  - docker-compose.yml (all MCP servers)"
echo "  - Caddyfile (reverse proxy with HTTPS)"
echo "  - Dockerfile.mcp-template (base Dockerfile for servers)"
echo "  - .env.example (required environment variables)"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and fill in your keys"
echo "  2. Update DOMAIN in Caddyfile"
echo "  3. Run: docker-compose up -d"
echo "  4. Set up Stripe webhook to https://\$DOMAIN/webhooks/stripe"
echo ""
echo "=== Infrastructure setup complete ==="
