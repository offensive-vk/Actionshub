# auto-label

This GitHub Action allows you to automate labels on issues and pull requests in a repository.

## Example Usage

```yml
steps:
  - uses: actions/checkout@v4
  - name: Apply Labels on PRs and Issues
    uses: offensive-vk/auto-label-stuff@v7
    with:
      create-labels: true
      github-token: ${{ secrets.GITHUB_TOKEN }}
      issue-config: .github/issues.yml
      pr-config: .github/pr.yml
```

## Inputs Configuration

Configure the inputs through the `with:` section of the Action. Below is a list of configurable options:

| Option    | Default Value                 | Description |
|-----------|-------------------------------|-------------|
| token     | `${{ github.token }}` / `required` | The GitHub token used to authenticate requests. Use `${{ github.token }}` or create a PAT and store it in secrets. |
| issue-config | `.github/issues.yml` / `required` | The Issues Config File that will label issues. |
| pr-config | `.github/pr.yml` / `required` | The Pull Request Labeler Config. (Similiar to `labeler.yml`) | 
| create-labels | `true` | Whether to create labels in base repo or not. |


***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-issue?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
