#!/bin/bash
# Publish all MCP server packages to npm
set -euo pipefail

GENERATED_DIR="$(dirname "$0")/../generated-plugins"

echo "=== Publishing MCP Servers to npm ==="

for plugin_dir in "$GENERATED_DIR"/*/; do
  plugin_name=$(basename "$plugin_dir")
  mcp_dir="$plugin_dir/mcp-server"

  if [ -d "$mcp_dir" ] && [ -f "$mcp_dir/package.json" ]; then
    echo ""
    echo "--- Publishing: $plugin_name ---"
    cd "$mcp_dir"

    # Build TypeScript
    npm install
    npm run build

    # Publish to npm
    npm publish --access public

    echo "Published $plugin_name to npm"
    cd - > /dev/null
  fi
done

echo ""
echo "=== All MCP servers published ==="
