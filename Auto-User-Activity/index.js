const core = require("@actions/core");
const github = require("@actions/github");
const { owner: contextOwner, repo: contextRepo } = github.context.repo;
const OWNER = contextOwner;
const REPO = contextRepo;
const fs = require("fs");
const { spawn } = require("child_process");
const { Toolkit } = require("actions-toolkit");
const GH_USERNAME = core.getInput("username") || OWNER;
const COMMIT_NAME = core.getInput("committer");
const COMMIT_EMAIL = core.getInput("committer-email");
const COMMIT_MSG = core.getInput("commit-msg");
const MAX_LINES = parseInt(core.getInput("max-lines"), 10);
const TARGET_FILE = core.getInput("target-file");
const EMPTY_COMMIT_MSG = core.getInput("empty-commit-msg");
const TOKEN = core.getInput("token") || process.env.GITHUB_TOKEN;
const DEBUG = core.getInput("debug") === "true";
core.debug(`Using token: ${TOKEN}\n Debug: ${DEBUG}\n`);

/**
 * Returns the sentence case representation
 * @param {String} str - the string
 * @returns {String}
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Executes a shell command
 * @param {String} cmd - root command
 * @param {String[]} args - args to be passed along with
 * @returns {Promise<String>}
 */
const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
    const app = spawn(cmd, args);

    let stdout = "";
    let stderr = "";

    app.stdout.on("data", (data) => (stdout += data.toString()));
    app.stderr.on("data", (data) => (stderr += data.toString()));

    app.on("close", (code) => {
      if (code !== 0 && !stdout.includes("nothing to commit")) {
        return reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
      resolve(stdout);
    });

    app.on("error", (err) => reject(new Error(`Process error: ${err.message}`)));
  });

/**
 * Makes a commit
 * @param {Boolean} emptyCommit - whether to create an empty commit
 * @returns {Promise<void>}
 */
const commitFile = async (emptyCommit = false) => {
  await exec("git", ["config", "user.email", COMMIT_EMAIL]);
  await exec("git", ["config", "user.name", COMMIT_NAME]);

  if (emptyCommit) {
    await exec("git", ["commit", "--allow-empty", "-m", EMPTY_COMMIT_MSG]);
  } else {
    await exec("git", ["add", TARGET_FILE]);
    await exec("git", ["commit", "-m", COMMIT_MSG]);
  }

  await exec("git", ["push"]);
};

/**
 * Creates an empty commit if no activity is detected for over 50 days
 * @returns {Promise<void>}
 */
const createEmptyCommit = async () => {
  const lastCommitDate = await exec("git", [
    "--no-pager",
    "log",
    "-1",
    "--format=%ct",
  ]);

  const commitDate = new Date(parseInt(lastCommitDate, 10) * 1000);
  const diffInDays = Math.round((new Date() - commitDate) / (1000 * 60 * 60 * 24));

  core.debug(`Last commit date: ${commitDate}`);
  core.debug(`Difference in days: ${diffInDays}`);

  if (diffInDays > 50) {
    core.info("Creating an empty commit to keep workflow active");
    await commitFile(true);
    return "Empty Commit";
  }

  return "No activity found. Leaving README unchanged.";
};

/**
 * Serializers for activity types
 */
const serializers = {
  IssueCommentEvent: (item) => {
    return `🗣 Commented on [#${item.payload.issue.number}](${item.payload.comment.html_url}) in ${item.repo.name}`;
  },
  IssuesEvent: (item) => {
    const emojiMap = {
      opened: "❗",
      reopened: "🔓",
      closed: "🔒",
    };
    const emoji = emojiMap[item.payload.action] || "";
    return `${emoji} ${capitalize(item.payload.action)} issue [#${item.payload.issue.number}](${item.payload.issue.html_url}) in ${item.repo.name}`;
  },
  PullRequestEvent: (item) => {
    const action = item.payload.pull_request.merged ? "🎉 Merged" : `${item.payload.action}`;
    const emoji = item.payload.action === "opened" ? "💪" : "❌";
    return `${emoji} ${capitalize(action)} PR [#${item.payload.pull_request.number}](${item.payload.pull_request.html_url}) in ${item.repo.name}`;
  },
  ReleaseEvent: (item) => {
    return `🚀 ${capitalize(item.payload.action)} release [${item.payload.release.tag_name}](${item.payload.release.html_url}) in ${item.repo.name}`;
  },
};

/**
 * Main function executed by the Toolkit
 */
Toolkit.run(
  async (tools) => {
    tools.log.debug(`Getting activity for ${GH_USERNAME}`);
    const github = tools.github;
    const events = await github.activity.listPublicEventsForUser({
      username: GH_USERNAME,
      per_page: 100,
    });

    tools.log.debug(`Activity for ${GH_USERNAME}, ${events.data.length} events found.`);

    const content = events.data
      .filter((event) => serializers.hasOwnProperty(event.type))
      .slice(0, MAX_LINES)
      .map((item) => serializers[item.type](item));

    let readmeContent;
    try {
      readmeContent = fs.readFileSync(`./${TARGET_FILE}`, "utf-8").split("\n");
    } catch (err) {
      return tools.exit.failure(`Failed to read ${TARGET_FILE}: ${err.message}`);
    }

    const startIdx = readmeContent.findIndex(
      (line) => line.trim() === "<!--START_SECTION:activity-->",
    );

    const endIdx = readmeContent.findIndex(
      (line) => line.trim() === "<!--END_SECTION:activity-->",
    );

    if (startIdx === -1 || endIdx === -1) {
      return tools.exit.failure("Couldn't find activity section comments.");
    }

    const newContent = content.map((line, idx) => `${idx + 1}. ${line}`).join("\n");
    readmeContent.splice(startIdx + 1, endIdx - startIdx - 1, newContent);

    fs.writeFileSync(`${TARGET_FILE}`, readmeContent.join("\n"));
    console.log(`:: Actual Output ::\n`);
    console.dir(readmeContent);

    try {
      await commitFile();
    } catch (err) {
      return tools.exit.failure(`Failed to push changes: ${err.message}`);
    }

    tools.exit.success("Readme or Markdown Changes Committed.");
  },
  {
    event: ["push", "schedule", "workflow_dispatch", "workflow_call"],
    secrets: ["GITHUB_TOKEN" || TOKEN],
  },
);
