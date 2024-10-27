# auto-issue

This GitHub Action allows you to automate the creation of issues in a repository. This supports more options like assigning users, adding labels, and integrating with workflows that may fail. Check the Actions tab for behind the scenes.

## Example Usage

```yml
steps:
  - uses: actions/checkout@v4
  - name: Create an Issue
    uses: offensive-vk/auto-issue@v7
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      title: "Automated Issue by Actions."
      body: "This is a test issue created by auto-issue action."
```

## Inputs Configuration

Configure the inputs through the `with:` section of the Action. Below is a list of configurable options:

| Option    | Default Value                 | Description |
|-----------|-------------------------------|-------------|
| github-token | `${{ github.token }}` | The GitHub token used to authenticate requests. Use `${{ github.token }}` or create a PAT and store it in secrets. |
| owner     | `github.context.repo.owner`  | The owner of the repository where the issue will be created. Inferred from the context. |
| repo      | `github.context.repo.repo`   | The repository name where the issue will be created. Inferred from the context. |
| title     | `Automated Issue` | The title of the issue. |
| body      | `This Issue was automated by github-actions.` | The body content of the issue. |
| labels    | `automated` | A comma-separated list of labels to apply to the issue. |
| milestone | `null` | The milestone ID to associate the issue with. |
| assignees | `github.actor` | A comma-separated list of GitHub usernames to assign the issue to. |

## Outputs

| Output   | Description                                                  |
|----------|--------------------------------------------------------------|
| JSON     | The full JSON response from the GitHub API. [See Response](https://docs.github.com/en/rest/issues/issues#create-an-issue) |
| URL      | The URL of the created issue.                                 |
| NUMBER   | The issue number.                                             |

## Usage

> [!NOTE]  
> This Action only supports `ubuntu-latest` runners.

### Advanced Workflow

```yml
name: Dangerous Workflow
...

jobs:
  job-that-might-fail:
    ...

  create-issue-if-job-fails:
    needs: job-that-might-fail
    runs-on: ubuntu-latest
    if: always() && needs.job-that-might-fail.result == 'failure'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
    
      - name: Create Issue
        uses: offensive-vk/auto-issue@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          title: |
            ${{ github.workflow }} failed during ${{ github.event_name }}
          assignees: ${{ github.actor }},${{ github.triggering_actor }}
          labels: ci/cd
          body: |
            ## Failure Report:
            
            > [!IMPORTANT]
            > Details on failed run: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}
    
            - Author: @${{ github.triggering_actor }}
            - Branch: `${{ github.ref }}`
            - Commit: ${{ github.sha }}
            - Workflow Path: `${{ github.workflow_ref }}`
    
            - [ ] **Task**: Review failed run, fix the issue(s), and re-run until successful.
    
            > This issue was created automatically by GitHub Actions, 
            > through `offensive-vk/create-issue-action@v5` action
            > **DO NOT** close this issue until resolved.
```

### Using Outputs

```yml
...
steps:
  - uses: actions/checkout@v4
  - uses: offensive-vk/auto-issue@v7
    id: new-issue
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      title: Simple Issue
      body: This Issue was created by auto-issue GitHub Action.
  - run: |
      echo "${{ steps.new-issue.outputs.json }}" | jq
      echo "${{ steps.new-issue.outputs.json }}" | jq .state
      echo "${{ steps.new-issue.outputs.json }}" | jq .labels[].name
```

***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-issue?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
