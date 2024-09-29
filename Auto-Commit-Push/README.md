# auto-commit-push

Automatically Commit and Push Changes to Your Repository

Simplify your workflow by automating the commit and push process. This action is designed to:

- Create commits: Generates commits with customizable messages.
- Push to remote: Pushes your commits to a specified remote branch.

For example:

```yaml
name: Auto Commit & Push

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  auto-commit-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Commit and Push
        uses: offensive-vk/auto-commit-push@v5
        with:
          name: 'Your Name'
          email: 'your@email.com'
          message: 'Commit Message'
          branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          co-authors: co-author1, co-author2
```

## Usage

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| name | Your name | true | github-actions[bot] |
| email | Your email | true | github-actions[bot]@users.noreply.github.com|
| message | Commit message | true | Automated Commit by Actions. |
| branch | Target branch | true | main |
| github-token | Github repository token | true | github.token |
| co-authors | Co-authors (comma-separated) | false | null |
| push_options | Push options (eg. --force) | false | '' |
| commit_options | Commit options (eg. -S -a, --no-verify) | false | '' |
| add_options | Add options (eg. -u) | false | '' |

### Outputs

None

***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-issue?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
