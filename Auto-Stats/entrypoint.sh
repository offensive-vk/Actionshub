#!/bin/bash

# Get the inputs from the action.yml file
SET_NAME="${INPUT_NAME:-"github-actions[bot]"}"
SET_EMAIL="${INPUT_EMAIL:-"github-actions[bot]@users.noreply.github.com"}"
MESSAGE="${INPUT_MESSAGE:-"Updated Repo Stats"}"
BRANCH="${INPUT_BRANCH:-"master"}"
GITHUB_TOKEN="${INPUT_GITHUB_TOKEN:-${GITHUB_TOKEN}}"

# Initialize Variables
total_characters=0
total_files=0
biggest_file=""
smallest_file=""
biggest_count=0
smallest_count=1000000
timestamp=$(date '+%b %d, %A %I:%M:%S %p')

# Create Required Files
echo "# Daily Repository Statistics " > STATS.md
echo "Generated on $timestamp  " >> STATS.md
echo "" >> STATS.md

# Iterate through all files (excluding hidden files and directories)
for file in $(find . -type f -not -path '*/\.*'); do
    # Count characters in the file
    char_count=$(wc -c < "$file")
    file_name=$(basename "$file")

    # Add to total character count
    total_characters=$((total_characters + char_count))
    total_files=$((total_files + 1))

    # Check for the biggest and smallest files by character count
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

# count words too
total_words=$(wc -w $(find . -type f -not -path '*/\.*') | tail -n 1 | awk '{print $1}')

# Ensure GITHUB_TOKEN is available
export GITHUB_TOKEN=$GITHUB_TOKEN

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

# Git configuration and commit
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "$SET_NAME"
git config --local user.email "$SET_EMAIL"
git add STATS.md
git fetch --all; git pull --verbose
git commit -m "$MESSAGE"
git push
