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
    runs-on: ubuntu-latest
    steps:

    - uses: actions/checkout@v4
      
    - name: Generate Stats
    - uses: offensive-vk/auto-stats@v5
      with:
        branch: master
        commit-message: Update Repo Stats
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Sample Output

# Daily Repository Statistics

Generated on Sep 14, Saturday 12:40:33 PM  

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
