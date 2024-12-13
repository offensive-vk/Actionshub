# Auto Repo Sync

This Action *Auto Repo Sync* enables you to synchronize code to other code management platforms, such as GitLab, Github, Bitbucket etc.

## Example

You can use the following example as a template to create a new file with any name under `.github/workflows/`.

```yaml
name: Sync

on: 
  push:
    branches:
      - main
  delete

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: offensive-vk/auto-repo-sync@v7
        with:
          target-url: https://gitlab.com/<user>/<repo>.git
          target-username: ${{ secrets.TARGET_USERNAME }}
          target-token: ${{ secrets.TARGET_TOKEN }}
```

Note: Store sensitive values like TARGET_USERNAME and TARGET_TOKEN as secrets under Settings > Secrets and variables > Actions in your repository.

***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2023 - Present</i><br>
  <i>Licensed under <a href="https://mit-license.org">MIT License</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <kbd>Thanks for visiting :)</kbd>
</p>
