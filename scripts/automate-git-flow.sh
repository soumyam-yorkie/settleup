#!/bin/bash

# scripts/automate-git-flow.sh
# Automates: stash -> switch to main -> pull -> new branch -> pop stash

# Usage: ./scripts/automate-git-flow.sh <branch-name>

BRANCH_NAME=$1

if [ -z "$BRANCH_NAME" ]; then
    echo "❌ Error: Please provide a branch name."
    echo "Usage: ./scripts/automate-git-flow.sh <branch-name>"
    exit 1
fi

echo "📦 Stashing current changes..."
git stash

echo "🔄 Switching to main branch..."
git checkout main

echo "⬇️ Fetching latest changes from main..."
git pull origin main

echo "🌿 Creating new branch: $BRANCH_NAME..."
git checkout -b "$BRANCH_NAME"

echo "🔓 Re-applying stashed changes..."
git stash pop

echo "✅ Ready! Now you can review changes, commit, and push."
echo "💡 Tip: Ask your AI agent to 'Analyze changes and commit' now."
