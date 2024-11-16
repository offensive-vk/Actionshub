# auto-label

This GitHub Action allows you to add or apply labels on issues and pull requests in a github repository. Please click [here](.github/workflows/test.yml) to see a complete working workflow that uses this action.

## Example Usage

```yml
steps:
  - name: Apply Labels on PRs and Issues
    if: github.event_name == 'issues'
    uses: offensive-vk/auto-label@v7
    with:
      create-labels: true # Not Required, defaults to true
      github-token: ${{ secrets.GITHUB_TOKEN }} # Not Required uses ${{ secrets.GITHUB_TOKEN }}
      issue-config: .github/issues.yml # Required config file.
```

## Inputs Configuration

Configure the inputs through the `with:` section of the Action. Below is a list of configurable options:

| Option    | Default Value                 | Description |
|-----------|-------------------------------|-------------|
| github-token     | `${{ github.token }}` / `required` | The GitHub token used to authenticate requests. Use `${{ github.token }}` or create a PAT and store it in secrets. |
| issue-config | `.github/issues.yml` / `required` | The Issues Config File that will label issues. |
| pr-config | `.github/pr.yml` / `required` | The Pull Request Labeler Config. (Similiar to `labeler.yml`) | 
| create-labels | `true` | Whether to create labels in base repo or not. |

## Issue Config 

This is a sample description of how can you write your rules to apply labels on Issues by matching specific keywords.

```yaml
actual_label:
  - label: actual_label
    description: 'Short description'
    match:
      - 'Match1'
      - 'Match2'
      - '...so on.'
```

For Example:

```yaml
hamster:
  - label: hamster
    description: sorry its my hamster
    match:
      - automated
      - hamster
      - hamsters
      - Hamster

bug:
  - label: bug
    description: its a issue
    match:
      - issue
      - issues
      - bug
      - bugs
      - fix
```

## PR Config

This is a sample description of how can you write your rules to apply labels on Pull Requests by matching specific keywords.

```yaml
actual_label:
  - 'file_pattern1'
  - 'file_pattern2'
  - '...'
```

Example:

```yml
area/release:
  - 'release/'
  - 'release_assets/'
  - '**/*.assets'

area/build:
  - 'build/**/*'
  - 'resources'
  - 'xyz'

```

Thank you for using this action.

***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-issue?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
