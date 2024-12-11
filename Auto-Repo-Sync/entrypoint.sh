#!/bin/bash
########################################
## Licensed Under MIT. 2024 - Present ##
########################################
set -e
set -o pipefail

echo ":: Executing Script ::"

if [ -z "$INPUT_TARGET_USERNAME" ] || [ -z "$INPUT_TARGET_TOKEN" ] || [ -z "$INPUT_TARGET_URL" ]; then
    echo "Error: Missing one or more required inputs (username, token, or URL)."
    exit 1
fi

TARGET_URL="https://${INPUT_TARGET_USERNAME}:${INPUT_TARGET_TOKEN}@${INPUT_TARGET_URL#*://}"

if git remote | grep -q "^target$"; then
    echo "Remote 'target' already exists. Skipping add."
else
    git remote add target "$TARGET_URL"
fi

# Fetch latest changes from the base repository
git fetch origin --prune

# Push all references to the target repository, skipping deletion actions
case "${GITHUB_EVENT_NAME}" in
    push)
        echo "Handling push event..."
        git push target --all
        git push target --tags
        ;;
    *)
        echo "Handling other event: ${GITHUB_EVENT_NAME}."
        git push target --all
        git push target --tags
        ;;
esac

echo ":: Repository sync completed successfully. ::"