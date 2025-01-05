/******************************************************/
/**
 * @author Vedansh (offensive-vk)
 * @url https://github.com/offensive-vk/auto-user-activity/
 * @lang JavaScript + Node.js + Octokit
 * @type Github Action for Fetching and Updating Your Github Activity User Data.
 * @runs Nodejs v20.x
 * @bundler esbuild
 */
/******************************************************/
const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const { spawn } = require("child_process");

/**
 * Executes a shell command.
 * @param {string} cmd - The command to execute.
 * @param {string[]} args - Arguments for the command.
 * @returns {Promise<string>} - The stdout from the command.
 */
const exec = (cmd, args = []) => {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => (stdout += data.toString()));
    process.stderr.on("data", (data) => (stderr += data.toString()));

    process.on("close", (code) => {
      if (code !== 0 && !stdout.includes("nothing to commit")) {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    process.on("error", (err) => reject(new Error(`Process error: ${err.message}`)));
  });
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

(async () => {
  try {
    const token = core.getInput("token") || process.env.GITHUB_TOKEN;
    const username = core.getInput("username");
    const committerName = core.getInput("committer") || "github-actions[bot]";
    const committerEmail = core.getInput("committer-email") || "github-actions[bot]@users.noreply.github.com";
    const commitMessage = core.getInput("commit-msg");
    const maxLines = parseInt(core.getInput("max-lines"), 10);
    const targetFile = core.getInput("target-file");
    const emptyCommitMsg = core.getInput("empty-commit-msg");
    const enableEmptyCommit = core.getInput("enable-empty-commit") === "true";
    const debug = core.getInput("debug") === "true";
    const { owner, repo } = github.context.repo;
    const octokit = github.getOctokit(token);

    /**
     * Ensures the target file exists, creating it if necessary.
     */
    const ensureFileExists = (filePath) => {
      if (!fs.existsSync(filePath)) {
        const initialContent = `<!--START_SECTION:activity-->\n<!--END_SECTION:activity-->`;
        fs.writeFileSync(filePath, initialContent, "utf-8");
        core.info(`File ${filePath} created successfully.`);
      }
    };

    /**
     * Makes a commit to the repository.
     * @param {boolean} emptyCommit - Whether to make an empty commit.
     */
    const commitFile = async (emptyCommit = false) => {
      await exec("git", ["config", "user.email", committerEmail]);
      await exec("git", ["config", "user.name", committerName]);

      if (emptyCommit) {
        await exec("git", ["commit", "--allow-empty", "-m", emptyCommitMsg]);
      } else {
        await exec("git", ["add", targetFile]);
        await exec("git", ["commit", "-m", commitMessage]);
      }

      await exec("git", ["push"]);
    };

    /**
     * Creates an empty commit if no activity is detected for over 50 days.
     */
    const createEmptyCommit = async () => {
      if (!enableEmptyCommit) {
        core.info("Empty commits are disabled by workflow configuration.");
        return;
      }

      const lastCommitDate = await exec("git", [
        "--no-pager",
        "log",
        "-1",
        "--format=%ct",
      ]);

      const commitDate = new Date(parseInt(lastCommitDate, 10) * 1000);
      const diffInDays = Math.round((new Date() - commitDate) / (1000 * 60 * 60 * 24));

      if (debug) {
        core.debug(`Last commit date: ${commitDate}`);
        core.debug(`Difference in days: ${diffInDays}`);
      }

      if (diffInDays > 50) {
        core.info("Creating an empty commit to keep the workflow active.");
        await commitFile(true);
      }
    };

    /**
     * Updates the target file with the latest activity.
     */
    const updateActivitySection = async () => {
      ensureFileExists(targetFile);

      const events = await octokit.rest.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      });

      const serializers = {
        IssueCommentEvent: (item) => {
          return `🗣 Commented on issue [#${item.payload.issue.number}](https://github.com/${item.repo.name}/issues/${item.payload.issue.number}) in [${item.repo.name}](https://github.com/${item.repo.name})`;
        },
        IssuesEvent: (item) => {
          const actionMap = {
            opened: "❗ Opened",
            reopened: "🔓 Reopened",
            closed: "🔒 Closed",
          };
          const action = actionMap[item.payload.action] || capitalize(item.payload.action);
          return `${action} issue [#${item.payload.issue.number}](https://github.com/${item.repo.name}/issues/${item.payload.issue.number}) in [${item.repo.name}](https://github.com/${item.repo.name})`;
        },
        PullRequestEvent: (item) => {
          const action = item.payload.pull_request.merged ? " Merged" : capitalize(item.payload.action);
          const emoji = item.payload.pull_request.merged ? "🎉" : item.payload.action === "opened" ? "💪" : "❌";
          return `${emoji} ${action} pull request [#${item.payload.pull_request.number}](https://github.com/${item.repo.name}/pull/${item.payload.pull_request.number}) in [${item.repo.name}](https://github.com/${item.repo.name})`;
        },
        PullRequestReviewEvent: (item) => {
          const stateMap = {
            approved: "✅ Approved",
            changes_requested: "🔄 Changes Requested",
            commented: "💬 Commented",
          };
          const state = stateMap[item.payload.review.state] || capitalize(item.payload.review.state);
          return `${state} on pull request [#${item.payload.pull_request.number}](https://github.com/${item.repo.name}/pull/${item.payload.pull_request.number}) in [${item.repo.name}](https://github.com/${item.repo.name})`;
        },
        ReleaseEvent: (item) => {
          return `🚀 ${capitalize(item.payload.action)} release [${item.payload.release.tag_name}](https://github.com/${item.repo.name}/releases/tag/${item.payload.release.tag_name}) in [${item.repo.name}](https://github.com/${item.repo.name})`;
        },
      };

      const content = events.data
        .filter((event) => serializers.hasOwnProperty(event.type))
        .slice(0, maxLines || 10)
        .map((item) => serializers[item.type](item));

      const fileContent = fs.readFileSync(targetFile, "utf-8").split("\n");
      const startIdx = fileContent.findIndex(
        (line) => line.trim() === "<!--START_SECTION:activity-->"
      );
      const endIdx = fileContent.findIndex(
        (line) => line.trim() === "<!--END_SECTION:activity-->"
      );

      if (startIdx === -1 || endIdx === -1) {
        throw new Error("Couldn't find activity section comments.");
      }

      const newContent = content.map((line, idx) => `${idx + 1}. ${line}`).join("\n");
      fileContent.splice(startIdx + 1, endIdx - startIdx - 1, newContent);

      fs.writeFileSync(targetFile, fileContent.join("\n"));
      core.info("Activity Updated Successfully.");

      await commitFile();
    };

    await createEmptyCommit();
    await updateActivitySection();
    console.log(`
      --------------------------------------------------------------
      🎉 Success!
      Thank you for using this action! – Vedansh (offensive-vk)
      --------------------------------------------------------------
    `);
  } catch (error) {
    core.error(error);
    core.setFailed(`Action failed with error: ${error.message}`);
  }
})();
