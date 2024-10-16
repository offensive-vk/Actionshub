#!/bin/bash

# Get the inputs from the action.yml file
SET_NAME="${INPUT_NAME:-github-actions[bot]}"
SET_EMAIL="${INPUT_EMAIL:-github-actions[bot]@users.noreply.github.com}"
MESSAGE="${INPUT_MESSAGE:-Updated Repo Stats}"
BRANCH="${INPUT_BRANCH:-master}"
GITHUB_TOKEN="${INPUT_GITHUB_TOKEN}"
OPTIONS="${INPUT_OPTIONS}"

# Set Git identity both globally and locally
git config --global user.name "$SET_NAME"
git config --global user.email "$SET_EMAIL"
git config --global --add safe.directory /github/workspace

# Initialize Variables
total_characters=0
total_files=0
biggest_file=""
smallest_file=""
biggest_count=0
smallest_count=1000000
timestamp=$(date '+%b %d, %A %I:%M:%S %p')

# Create Required Files
echo "✨✨✨ " > STATS.md
echo "# Daily Repository Statistics " >> STATS.md
echo "Generated on $timestamp  " >> STATS.md
echo "" >> STATS.md

# Iterate through all files (excluding hidden files and directories)
for file in $(find . -type f -not -path '*/\.*'); do
    char_count=$(wc -c < "$file")
    file_name=$(basename "$file")

    total_characters=$((total_characters + char_count))
    total_files=$((total_files + 1))

    if [ $char_count -gt $biggest_count ]; then
        biggest_count=$char_count
        biggest_file=$file_name
    fi

    if [ $char_count -lt $smallest_count ]; then
        smallest_count=$char_count
        smallest_file=$file_name
    fi

    echo "$file_name: $char_count characters  " >> STATS.md
done

# Calculate average characters per file
if [ $total_files -ne 0 ]; then
    average_characters=$((total_characters / total_files))
else
    average_characters=0
fi

# Calculate total words
total_words=$(wc -w $(find . -type f -not -path '*/\.*') | tail -n 1 | awk '{print $1}')

# Write final results to the markdown file
echo "" >> STATS.md
echo "## Summary ⛽  " >> STATS.md
echo "- Total files: $total_files  " >> STATS.md
echo "- Total character count: $total_characters  " >> STATS.md
echo "- Average characters per file: $average_characters  " >> STATS.md
echo "- Largest file: $biggest_file ($biggest_count characters)  " >> STATS.md
echo "- Smallest file: $smallest_file ($smallest_count characters)  " >> STATS.md
echo "- Total word count: $total_words  " >> STATS.md
echo "--- " >> STATS.md
echo "# ✨✨✨" >> STATS.md

# Git configuration and commit the changes
# git config --local user.name "$SET_NAME"
# git config --local user.email "$SET_EMAIL"

# Ensure all changes are added
git add STATS.md

# Stash any uncommitted changes before pulling
git stash --include-untracked

# Pull the latest changes
git fetch --all
git pull --rebase --autostash origin "$BRANCH"

# Apply the stash if necessary
git stash pop || echo "No stash to apply."

# Commit and push the changes
git commit $OPTIONS -m "$MESSAGE"
git push origin "$BRANCH"

# Check the status
git status


# ** END OF SCRIPT **