#!/bin/bash

# Get the inputs from the action.yml file
NAME=${INPUT_NAME}
EMAIL=${INPUT_EMAIL}
MESSAGE=${INPUT_MESSAGE}
BRANCH=${INPUT_BRANCH}
REPO=${GITHUB_REPOSITORY}
GITHUB_TOKEN=${INPUT_GITHUB_TOKEN:-${GITHUB_TOKEN}}
CO_AUTHORS=${INPUT_CO_AUTHORS:-""}
COMMIT_OPTIONS=${INPUT_COMMIT_OPTIONS:-""}
PUSH_OPTIONS=${INPUT_PUSH_OPTIONS:-""}
ADD_OPTIONS=${INPUT_ADD_OPTIONS:-""}

# Check if required inputs are provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN is required"
  exit 1
fi

if [ -z "$NAME" ]; then
  git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"
else
  git config --global user.name "$NAME"
  git config --global user.email "$EMAIL"
fi

# Add safe directory config
git config --global --add safe.directory /github/workspace

# Stage all changes with add options (if any)
git fetch --all
git pull --all --verbose
git add . $ADD_OPTIONS

# If commit message is empty, use default message
if [ -z "$MESSAGE" ]; then
  MESSAGE="Automated Commit by GitHub Actions"
fi

# Commit the changes with commit options (if any)
git commit $COMMIT_OPTIONS -m "$MESSAGE"

# Push the changes to the specified branch with push options (if any)
git push origin "$BRANCH" $PUSH_OPTIONS

# If the push is successful, print a success message
if [ $? -eq 0 ]; then
  echo "Changes pushed successfully to $REPO"
else
  echo "Failed to push changes to $REPO"
  exit 1
fi

####################################