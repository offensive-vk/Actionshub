# 🌟 Auto Contributions - Profile 3D SVGs 🌐  

[🇯🇵 日本語](./docs/README.ja-jp.md) | [🇪🇸 Español](./docs/README.es-es.md)  

## 📖 Overview  

This GitHub Action 🛠️ creates an eye-catching **3D contribution calendar** 🗓️ for your GitHub profile 🎨.  

## 🚀 How to Use (GitHub Actions) - Basic  

This action generates a **3D contribution calendar** for your profile and automatically commits the SVG to your repository 📤. You can also manually trigger it if needed 🔄.  

### 🛠️ Step 1. Create a Special Repository  

Create a repository on GitHub named after your username 📝.  

For example:  
- If your username is `mona`, create a repository named `mona/mona`.  

📖 Reference: [Managing Your Github Profile Readme](https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme).  

---

### 🛠️ Step 2. Create a Workflow File  

Create the following workflow file at `.github/workflows/contributions.yml`:  

```yaml
name: Auto Contributions

on:
  schedule:
    - cron: "0 8 * * *" # Adjust the time as per your preference.
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    name: Generate 3D Profile SVGs
    steps:
      - uses: actions/checkout@v4
      - uses: ./ 
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          USERNAME: ${{ github.repository_owner }}

      - name: Commit & Push
        run: |
          git config user.name ${{ github.actor }}
          git config user.email ${{ github.actor }}@users.noreply.github.com
          git add .
          git commit -m "Updated 3D Profile SVGs."
          git push
```  

💡 **Tip:** If you want to include private repositories, generate a **personal access token** 🔐 and set it to `GITHUB_TOKEN`.  

---

### 🛠️ Step 3. Manually Launch the Action  

Navigate to:  
`Actions` → `GitHub-Profile-3D-Contrib` → `Run workflow`.  

The following profile images will be generated:  

📂 **Generated Files:**  
- `profile-3d-contrib/profile-green-animate.svg`  
- `profile-3d-contrib/profile-season-animate.svg`  
- `profile-3d-contrib/profile-night-view.svg`  
- `profile-3d-contrib/profile-gitblock.svg`  
(*and more variations!*)  

If you specify a custom `SETTING_JSON`, a unique image will be generated:  
- `profile-3d-contrib/profile-customize.svg`  

---

### 🛠️ Step 4. Add the Generated Image to Your README  

Add the generated SVG to your profile README 📜:  

```md
![](./profile-3d-contrib/profile-green-animate.svg)
```  

---

## 🎨 Demo  

Here are some examples of the stunning 3D contribution SVGs this action generates:  

- **Green Animated Version:**  
  ![Green Animate](https://raw.githubusercontent.com/offensive-vk/auto-contributions/master/docs/demo/profile-green-animate.svg)  

- **Season (Northern Hemisphere):**  
  ![Season Northern](https://raw.githubusercontent.com/offensive-vk/auto-contributions/master/docs/demo/profile-season-animate.svg)  

- **Night View Version:**  
  ![Night View](https://raw.githubusercontent.com/offensive-vk/auto-contributions/master/docs/demo/profile-night-view.svg)  

---

## 🖥️ How to Use (Local)  

You can also generate the 3D contribution calendar locally:  

1. Set the `GITHUB_TOKEN` environment variable with your **personal access token**:  
   ```bash
   export GITHUB_TOKEN=XXXXXXXXXXXXXXXXXXXXX
   ```  

2. Run the script using your GitHub username:  
   ```bash
   npm run build
   node . YOUR_USERNAME
   ```  

---

## 📜 License  

This project is licensed under the **MIT License**. 📝  

---

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-contributions?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
