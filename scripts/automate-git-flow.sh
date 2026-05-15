#!/bin/bash

# scripts/automate-git-flow.sh
# Automates: stash -u -> switch main -> pull -> new branch -> pop stash
# Follows rules defined in AGENTS.md

set -e # Exit immediately if a command exits with a non-zero status

# Usage: ./scripts/automate-git-flow.sh <branch-name>
BRANCH_NAME=$1

# 1. Validation: Ensure branch name is provided
if [ -z "$BRANCH_NAME" ]; then
    echo "❌ Error: Please provide a branch name."
    echo "Usage: npm run prepare-branch -- <branch-name>"
    exit 1
fi

# 2. Validation: Ensure branch name follows AGENTS.md rules
if [[ ! "$BRANCH_NAME" =~ ^(feat|fix|chore)/ ]]; then
    echo "❌ Error: Branch name '$BRANCH_NAME' is invalid."
    echo "Rule (AGENTS.md): Branch must start with 'feat/', 'fix/', or 'chore/'."
    exit 1
fi

# 3. Stash changes (including untracked files)
echo "📦 Checking for local changes..."
STASH_BEFORE=$(git stash list | wc -l)
git stash -u --message "Automated stash before branching: $BRANCH_NAME"
STASH_AFTER=$(git stash list | wc -l)

HAS_STASHED=false
if [ "$STASH_AFTER" -gt "$STASH_BEFORE" ]; then
    HAS_STASHED=true
    echo "✅ Changes stashed successfully (including untracked files)."
else
    echo "ℹ️ No local changes to stash."
fi

# 4. Sync with main
echo "🔄 Switching to main branch..."
git checkout main

echo "⬇️ Fetching latest changes from origin/main..."
git pull origin main

# 5. Create new feature branch
echo "🌿 Creating new branch: $BRANCH_NAME..."
git checkout -b "$BRANCH_NAME"

# 6. Re-apply changes if any were stashed
if [ "$HAS_STASHED" = true ]; then
    echo "🔓 Re-applying stashed changes..."
    # We use set +e briefly because stash pop can have conflicts which we want the user to see
    set +e
    git stash pop
    POP_STATUS=$?
    set -e
    
    if [ $POP_STATUS -ne 0 ]; then
        echo "⚠️ Warning: Stash pop resulted in conflicts. Please resolve them manually."
    else
        echo "✅ Changes re-applied successfully."
    fi
fi

echo "✨ Workflow complete! You are now on branch: $BRANCH_NAME"
echo "💡 Tip: Ask your AI agent to 'Analyze changes and commit' now."
