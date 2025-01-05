# Auto User Activity

This GitHub Action automatically fetches and updates the recent activity of a GitHub user in the specified markdown file (e.g., `README.md`).

## Features

- Fetches up to a specified number of recent activities from the user's GitHub profile.
- Updates the designated markdown file between the specified comment tags.
- Supports empty commits to keep the workflow active after prolonged inactivity.
- Provides detailed debugging options for verbose logging.

---

## Recent Activity

<!--START_SECTION:activity-->
1. 💪 Opened pull request [#7](https://github.com/offensive-vk/auto-user-activity/pull/7) in [offensive-vk/auto-user-activity](https://github.com/offensive-vk/auto-user-activity)
2. 🎉  Merged pull request [#28106](https://github.com/offensive-vk/offensive-vk/pull/28106) in [offensive-vk/offensive-vk](https://github.com/offensive-vk/offensive-vk)
3. ✅ Approved on pull request [#28106](https://github.com/offensive-vk/offensive-vk/pull/28106) in [offensive-vk/offensive-vk](https://github.com/offensive-vk/offensive-vk)
4. 🎉  Merged pull request [#27974](https://github.com/offensive-vk/offensive-vk/pull/27974) in [offensive-vk/offensive-vk](https://github.com/offensive-vk/offensive-vk)
5. ✅ Approved on pull request [#27974](https://github.com/offensive-vk/offensive-vk/pull/27974) in [offensive-vk/offensive-vk](https://github.com/offensive-vk/offensive-vk)
6. 🎉  Merged pull request [#1](https://github.com/offensive-vk/Roadmap.sh/pull/1) in [offensive-vk/Roadmap.sh](https://github.com/offensive-vk/Roadmap.sh)
7. 💪 Opened pull request [#1](https://github.com/offensive-vk/Roadmap.sh/pull/1) in [offensive-vk/Roadmap.sh](https://github.com/offensive-vk/Roadmap.sh)
<!--END_SECTION:activity-->

---

## Inputs

The action supports the following input parameters:

| Name            | Description                                            | Default                           |
|-----------------|-------------------------------------------------------|-----------------------------------|
| `token`         | Your GitHub PAT or Auth Token                         | `${{ secrets.GITHUB_TOKEN }}`    |
| `username`      | The GitHub username to fetch activity for             | `${{ github.repository_owner }}` |
| `committer`     | The name of the committer                             | `github-actions[bot]`            |
| `committer-email` | The email of the committer                          | `github-actions[bot]@users.noreply.github.com` |
| `commit-msg`    | Commit message for changes                           | `:zap: Update README with recent activity` |
| `max-lines`     | The maximum number of activity entries to show       | `5`                               |
| `target-file`   | The markdown file to update                          | `README.md`                       |
| `empty-commit-msg` | Message for empty commits (no activity)            | `:memo: empty commit to keep workflow active` |
| `debug`         | Enable verbose logging (set `true` or `false`)        | `false`                           |

## Example Workflow

Here is an example of how to configure the action in your repository:

```yaml
name: Update GitHub Activity

on:
  schedule:
    - cron: "0 * * * *" # Runs hourly
  workflow_dispatch: # Allows manual trigger

jobs:
  update-activity:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Run Auto User Activity
        uses: offensive-vk/auto-user-activity@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          username: ${{ github.repository_owner }}
          commit-msg: ":zap: Updated activity in README"
          debug: true
```
