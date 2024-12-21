#!/bin/bash
set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log ":: Starting Repository Sync Script ::"

# Check required inputs
if [[ -z "$INPUT_TARGET_USERNAME" || -z "$INPUT_TARGET_TOKEN" || -z "$INPUT_TARGET_URL" ]]; then
    log "Error: Missing one or more required inputs: 'target-username', 'target-token', 'target-url'."
    exit 1
fi

TARGET_URL="https://${INPUT_TARGET_USERNAME}:${INPUT_TARGET_TOKEN}@${INPUT_TARGET_URL#*://}"

# Ensure 'target' remote exists
if git remote | grep -q "^target$"; then
    log "Remote 'target' already exists. Verifying URL..."
    git remote set-url target "$TARGET_URL"
else
    log "Adding remote 'target' with URL: $TARGET_URL"
    git remote add target "$TARGET_URL"
fi

log "Fetching changes from origin..."
git fetch origin --prune || { log "Error: Failed to fetch from origin."; exit 1; }

log "Fetching changes from target to avoid conflicts..."
git fetch target --prune || { log "Error: Failed to fetch from target."; exit 1; }

case "${GITHUB_EVENT_NAME}" in
    push)
        log ":: Detected push event. Syncing all branches and tags..."
        log "Attempting to push all branches..."
        if git push target --all; then
            log "Successfully pushed all branches to 'target'."
        else
            log "Push failed. Attempting to resolve conflicts by forcing the push..."
            git push target --all --force || { log "Error: Force push failed."; exit 1; }
        fi

        log "Attempting to push all tags..."
        if git push target --tags; then
            log "Successfully pushed all tags to 'target'."
        else
            log "Push failed. Attempting to resolve conflicts by forcing the push..."
            git push target --tags --force || { log "Error: Force push of tags failed."; exit 1; }
        fi
        ;;
    delete)
        log ":: Detected delete event. Skipping push operation."
        ;;
    *)
        log ":: Detected event: ${GITHUB_EVENT_NAME}. Syncing changes..."
        log "Attempting to push all branches..."
        if git push target --all; then
            log "Successfully pushed all branches to 'target'."
        else
            log "Push failed. Attempting to resolve conflicts by forcing the push..."
            git push target --all --force || { log "Error: Force push failed."; exit 1; }
        fi

        log "Attempting to push all tags..."
        if git push target --tags; then
            log "Successfully pushed all tags to 'target'."
        else
            log "Push failed. Attempting to resolve conflicts by forcing the push..."
            git push target --tags --force || { log "Error: Force push of tags failed."; exit 1; }
        fi
        ;;
esac

log ":: Repository sync completed successfully. ::"
########################################
## Licensed Under MIT. 2024 - Present ##
########################################
