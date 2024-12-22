# Auto Stats

Auto Stats Action enables to generate a repository statistics file like total number of file, number of words in every file, etc.

## Example

You can use the following example as a template to create a new file with any name under `.github/workflows/`.

```yaml
name: Auto Repo Stats

on: 
  schedule:
    - cron: '10 0 * * *'

jobs:
  stats:
    name: Generate Stats
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      
    - name: Generate Stats
      uses: offensive-vk/auto-stats@v7
      with:
        branch: master
        commit-message: Updated Repo Stats
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Sample Output

# Daily Repository Statistics

Generated on `<time>`

SECURITY.md: 1111 characters  
LICENSE: 34523 characters  
compose.yaml: 260 characters  
STATS.md: 165 characters  
RECENT.md: 5505 characters  
Dockerfile: 922 characters  
pnpm-lock.yaml: 114 characters  
README.md: 16266 characters  
WORKFLOWS.md: 3035 characters  
package.json: 1201 characters  

## Summary ⛽  

- Total files: 44  
- Total character count: 5256228  
- Average characters per file: 119459  
- Largest file: shocked.gif (952063 characters)  
- Smallest file: GREETINGS.md (69 characters)  
- Optional: Total word count: 274804  


***

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-stats?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
