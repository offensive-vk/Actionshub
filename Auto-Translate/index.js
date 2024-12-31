/******************************************************/
/**
 * @author Vedansh (offensive-vk)
 * @url https://github.com/offensive-vk/auto-translate/
 * @type Github Action for Translating the README.
 * @lang JavaScript + Node.js
 * @uses Octokit and Actions Core
 * @runs Nodejs v20.x
 */
/******************************************************/
const { readFileSync, writeFileSync, readdirSync, readFile } = require("fs");
const { join } = require("path");
const core = require("@actions/core");
const github = require("@actions/github");
const githubToken = core.getInput("repo-token", { required: false });
const committer = core.getInput("committer") || "github-actions[bot]";
const commitMessage = core.getInput("commit-message") || `CI: Translation Successful.`;
const commitOptions = core.getInput("commit-options") || "";
const filePath = core.getInput("file") || "README.md";
const lang = core.getInput("language") || "es";
const $ = require("@iamtraction/google-translate");
const simpleGit = require("simple-git");
const git = simpleGit();
const unified = require("unified");
const parse = require("remark-parse");
const stringify = require("remark-stringify");
const visit = require("unist-util-visit");

const toAst = (markdown) => unified().use(parse).parse(markdown);
const toMarkdown = (ast) => unified().use(stringify).stringify(ast);

const mainDir = ".";
let README = readdirSync(mainDir).includes(filePath) ? filePath : "README.md";
const readme = readFileSync(join(mainDir, README), { encoding: "utf8" });
const readmeAST = toAst(readme);

console.log("*** Started Processing ***");

async function translateNode(node) {
  if (node.type === "text") {
    const translated = await $(node.value, { to: lang });
    node.value = translated.text;
  }
}

async function translateReadme() {
  try {
    const nodes = [];
    visit(readmeAST, (node) => {
      nodes.push(translateNode(node));
    });
    await Promise.all(nodes);

    writeFileSync(
      join(mainDir, `README.${lang}.md`),
      toMarkdown(readmeAST),
      "utf8"
    );
    core.setCommandEcho(true);
    await git.add('*.md');
    console.log(`README.${lang}.md Translated.`);
  } catch (error) {
    console.error("Error during translation:", error);
    console.dir(error, {depth: Infinity});
  }
}

async function commitChanges() {
  try {
    console.log("*** Commit and Push ***");
    await git.init();
    await git.addConfig("user.name", committer, append = true, scope = 'global');
    await git.addConfig("user.email", `${committer}@users.noreply.github.com`, append = true, scope = 'global');
    await git.add(".");
    await git.commit(`${commitMessage} (${commitOptions})`);
    console.log("*** Committed Successfully ***");
    const fullRepoName = `${github.context.repo.owner}/${github.context.repo.repo}`;    
    await git.push(`https://${encodeURIComponent(githubToken)}@github.com/${fullRepoName}.git`);
    console.log("*** Pushed to Remote Repository ***");
  } catch (error) {
    console.error("*** Git Push Failed ***", error.message);
    console.log(error);
  }
}

// Translate 
translateReadme();