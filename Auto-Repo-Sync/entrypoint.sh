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

# Handle events
case "${GITHUB_EVENT_NAME}" in
    push)
        echo "Handling push event..."
        git push --prune --mirror target
        ;;
    delete)
        echo "Handling delete event..."
        if [ -z "$GITHUB_EVENT_REF" ]; then
            echo "Error: GITHUB_EVENT_REF is not set for delete event."
            exit 1
        fi
        git push -d target "$GITHUB_EVENT_REF"
        ;;
    *)
        echo "Unhandled event: ${GITHUB_EVENT_NAME}. Showing git status."
        git status
        ;;
esac

echo ":: Repository sync completed successfully. ::"