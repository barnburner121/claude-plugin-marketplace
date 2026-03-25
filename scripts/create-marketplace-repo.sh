#!/bin/bash
# Initialize a GitHub marketplace repository with all generated plugins
set -euo pipefail

REPO_NAME="${1:-claude-plugin-marketplace}"
GENERATED_DIR="$(dirname "$0")/../generated-plugins"
PROJECT_DIR="$(dirname "$0")/.."

echo "=== Creating Marketplace Repository ==="

# Initialize git repo if not already
cd "$PROJECT_DIR"
if [ ! -d ".git" ]; then
  git init
  echo "node_modules/" > .gitignore
  echo "dist/" >> .gitignore
  echo ".env" >> .gitignore
  echo "*.local" >> .gitignore
fi

# Generate marketplace.json from all plugins
echo "Generating marketplace.json..."
PLUGINS_JSON="["
FIRST=true

for plugin_dir in "$GENERATED_DIR"/*/; do
  if [ -f "$plugin_dir/.claude-plugin/plugin.json" ]; then
    plugin_name=$(basename "$plugin_dir")
    description=$(python3 -c "import json; print(json.load(open('$plugin_dir/.claude-plugin/plugin.json'))['description'])" 2>/dev/null || echo "A Claude Code plugin")

    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      PLUGINS_JSON="$PLUGINS_JSON,"
    fi

    PLUGINS_JSON="$PLUGINS_JSON
    {
      \"name\": \"$plugin_name\",
      \"source\": \"./generated-plugins/$plugin_name\",
      \"description\": \"$description\"
    }"
  fi
done

PLUGINS_JSON="$PLUGINS_JSON
  ]"

cat > .claude-plugin/marketplace.json << EOF
{
  "name": "$REPO_NAME",
  "owner": {
    "name": "Casey Baker"
  },
  "plugins": $PLUGINS_JSON
}
EOF

echo "marketplace.json created with all plugins"

# Create GitHub repo
if command -v gh &> /dev/null; then
  echo ""
  echo "Creating GitHub repository..."
  git add -A
  git commit -m "Initial marketplace with generated plugins"
  gh repo create "$REPO_NAME" --public --source=. --push
  echo ""
  echo "Marketplace published to GitHub!"
  echo "Users can install with: /plugin marketplace add $(gh api user --jq .login)/$REPO_NAME"
else
  echo ""
  echo "GitHub CLI (gh) not found. To publish:"
  echo "  1. Create a repo on GitHub named: $REPO_NAME"
  echo "  2. git remote add origin <repo-url>"
  echo "  3. git push -u origin main"
fi

echo ""
echo "=== Marketplace setup complete ==="
