# Random Quote or Fact in Github Readme

![Github Socialify](https://socialify.git.ci/offensive-vk/auto-update-quote/image?font=Source%20Code%20Pro&forks=1&issues=1&pattern=Brick%20Wall&stargazers=1&theme=Dark)

Action that allows you to add and update a random quote or fact on your README or Docs.

---

## Random Quote/Fact on your (Profile) Readme

### Prepare Your Repository

1. You need to update the markdown file(.md) with 2 comments. You can refer to [here](#update-your-readme) for updating it.
2. **Optional** You'll need a GitHub API Token with `repo` scope from [here](https://github.com/settings/tokens) if you're running the action for a non-profile repository.
   - You can use [this](#other-repository-not-profile) example to work it out.
3. You can follow any one example below according to your needs to get started!
   - Use [this](#profile-repository) on Profile Repository.
   - Use [this](#other-repository-not-profile) on any other Repository.
4. It is better to run the Action on your Profile Repository since you won't be needing a GitHub Access Token!
5. Check [this](#examples) to see available options while creating a workflow for this action.

For GitHub token permissions you can refer [here](https://docs.github.com/en/actions/security-guides/automatic-token-authentication).

---

### Update Your Readme

Add a comment to your `README.md` like this:

```md
<!--STARTS_HERE_QUOTE_README-->
<i>❝“On two occasions I have been asked, ‘If you put into the machine wrong figures, will the right answers come out?’  I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question.”— Charles Babbage   ❞</i>
<!--ENDS_HERE_QUOTE_README-->
```

5. Go to Workflows menu (mentioned in step 1), click `Update Quote Readme`, click `Run workflow`.
6. Go to your profile page, you will be able to see a random quote/fact wherever you placed [this](#update-your-readme) comment on README.

---

### Examples

1. If you want to use this action for a README that is not present in current workflow repository.

```yml
- uses: offensive-vk/auto-update-quote@v5
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}     # Needed if README repository is not profile repo
    REPOSITORY: <username>/<differentrepo>
```

Using `REPOSITORY` will change README present in that repository head.

For example, if your workflow is present in `<username>/repo1` and you want to update README present in `<username>/repo2`, then assign `REPOSITORY` to `<username>/repo2` in workflow at `<username>/repo1`.

2. You can specify a commit message to override the default _"Update with auto-update-quote"_.

```yml
- uses: offensive-vk/auto-update-quote@v5
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}     # Needed if README repository is not profile repo
    REPOSITORY: <username>/<differentrepo>  # Needed if README repository is not current repo
    COMMIT_MESSAGE: <your-commit-message>       # default - Update with auto-update-quote
```

3. You can also choose if you only want either a random `quote` or a random `funfact` to appear on your readme, by default it is `both`.

```yml
- uses: offensive-vk/auto-update-quote@v5
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}     # Needed if README repository is not profile repo
    REPOSITORY: <username>/<differentrepo>  # Needed if README repository is not current repo
    COMMIT_MESSAGE: <your-commit-message>       # default - Update with auto-update-quote
    OPTION: both            # default - both, can be one of (quote, funfact, both), if 'both' then will display either a quote or a fact
```

---

### Tests

To run tests simply execute the following in the directory containing `master.py`:

```bash
python -m unittest discover
```

***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-update-quote?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
