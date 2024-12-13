#!/bin/bash
set -euo pipefail
echo ":: Starting Repository Sync Script ::"

# Check required inputs
if [[ -z "$INPUT_TARGET_USERNAME" || -z "$INPUT_TARGET_TOKEN" || -z "$INPUT_TARGET_URL" ]]; then
    echo "Error: Missing one or more required inputs: 'target-username', 'target-token', 'target-url'."
    exit 1
fi

TARGET_URL="https://${INPUT_TARGET_USERNAME}:${INPUT_TARGET_TOKEN}@${INPUT_TARGET_URL#*://}"

# Ensure 'target' remote exists
if git remote | grep -q "^target$"; then
    echo "Remote 'target' already exists. Verifying URL..."
    git remote set-url target "$TARGET_URL"
else
    git remote add target "$TARGET_URL"
fi

git fetch origin --prune

case "${GITHUB_EVENT_NAME}" in
    push)
        echo ":: Detected push event. Syncing all branches and tags..."
        git push target --all
        git push target --tags
        ;;
    delete)
        echo ":: Detected delete event. Skipping push operation."
        ;;
    *)
        echo ":: Detected event: ${GITHUB_EVENT_NAME}. Syncing changes..."
        git push target --all
        git push target --tags
        ;;
esac

echo ":: Repository sync completed successfully. ::"
########################################
## Licensed Under MIT. 2024 - Present ##
########################################