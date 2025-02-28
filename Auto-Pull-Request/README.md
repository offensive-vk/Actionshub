# Auto Pull Request Action

This Action was created before GitHub CLI was an option. We believe there are now better options for creating pull requests using GitHub Actions.

We recommend using GitHub CLI directly in your workflow file. See: [`gh pr create`](https://cli.github.com/manual/gh_pr_create)

## Switches or Options

Configure the inputs through the `with:` section of the Action. Below is a list of configurable options:

| Option               | Default Value                 | Description                                                                                      |
|----------------------|-------------------------------|--------------------------------------------------------------------------------------------------|
| destination_repository | `null`                       | Repository (user/repo) to create the pull request in. Falls back to checkout or triggered repository. |
| source_branch        | `${{ github.ref }}`            | Branch name to pull from. Default is the triggered branch.                                        |
| destination_branch   | `master`                      | Branch name to sync to in this repo. Default is `master`.                                         |
| pr_title             | `null`                        | Pull request title.                                                                               |
| pr_body              | `null`                        | Pull request body.                                                                                |
| pr_template          | `null`                        | Pull request template.                                                                            |
| pr_reviewer          | `null`                        | Comma-separated list of reviewers (no spaces).                                                    |
| pr_assignee          | `null`                        | Comma-separated list of assignees (no spaces).                                                    |
| pr_label             | `null`                        | Comma-separated list of labels (no spaces).                                                       |
| pr_milestone         | `null`                        | Pull request milestone.                                                                           |
| pr_draft             | `false`                       | Create a draft pull request.                                                                      |
| pr_allow_empty       | `false`                       | Create PR even if there are no changes.                                                           |
| working_directory    | `.`                           | Change working directory.                                                                         |
| github_token         | `${{ github.token }}` / `required` | GitHub token secret used for authentication.                                                      |
| debug                | `false`                       | Bash `set -x` debugging mode.                                                                     |

## Outputs

| Output         | Description                                                  |
|----------------|--------------------------------------------------------------|
| pr_url         | The URL of the created pull request.                          |
| pr_number      | The number of the created pull request.                       |
| pr_created     | Boolean string indicating if a pull request was created.      |
| has_changed_files | Boolean string indicating whether any files were changed.

For example:

```yaml
name: Auto Pull Request

on:
  push:
    branches:
      - features

permissions:
  pull-requests: write

jobs:
  auto-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Create PR
        uses: offensive-vk/auto-pr-action@v5
        with:
          github_token: ${{ secrets.BOT_TOKEN }}
          destination_branch: "master"
          pr_title: "${{ github.workflow }} - (${{ github.event.head_commit.message }})"
          pr_body: "Hamster is working really hard here."
          pr_reviewer: "offensive-vk"
          pr_label: "bot,automated,hamster,pull-request"
          pr_assignee: "TheHamsterBot"
          pr_draft: false

  gh-pull-request:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: pull-request
        run: |
          gh_pr_up() { gh pr create $* || gh pr edit $* }
          gh_pr_up --title "Auto Pull Request" --body "Long Description"
```

Refer to the [`gh pr create`](https://cli.github.com/manual/gh_pr_create) docs for further options. Read ["Defining outputs for jobs"](https://docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs) to define outputs. As a result of ["GitHub Actions – Updating the default GITHUB_TOKEN permissions to read-only"](https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/), you will need both the `permissions:` entry and to update your repository settings.
