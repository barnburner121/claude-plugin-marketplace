#!/bin/bash
# Push to barnburner121 repo (bypasses global SSH rewrite for bhamlefty)
GIT_CONFIG_GLOBAL=/dev/null GIT_SSH_COMMAND="false" \
  git -c "credential.https://github.com.helper=!/opt/homebrew/bin/gh auth git-credential" \
  push https://github.com/barnburner121/claude-plugin-marketplace.git "${1:-main}"
