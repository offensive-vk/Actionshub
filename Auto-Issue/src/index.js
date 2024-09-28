/****************************************
 * @author Vedansh
 * @url https://github.com/offensive-vk
*****************************************
*/
const core = require('@actions/core');
const github = require('@actions/github');
const override = require('override.ps1');

const listToArray = (str = '') => str.split(',').map(item => item.trim());

(async () => {
  try {

    const token = core.getInput('github-token', { required: true });
    core.debug(`Using token: ${token}`);

    const { owner: contextOwner, repo: contextRepo } = github.context.repo;
    const owner = core.getInput('owner') || contextOwner;
    const repo = core.getInput('repo') || contextRepo;
    const title = core.getInput('title', { required: true });
    core.debug(`Using owner: ${owner}`);
    core.debug(`Using repo: ${repo}`);
    core.debug(`Using title: ${title}`);

    const body = core.getInput('body');
    const milestone = core.getInput('milestone');
    const labels = core.getInput('labels');
    const assignees = core.getInput('assignees');

    core.debug(`Using body: """${body || ''}"""`);
    core.debug(`Using milestone: ${milestone || ''}`);
    core.debug(`Using labels: ${labels || ''}`);
    core.debug(`Using assignees: ${assignees || ''}`);

    const octokit = github.getOctokit(token);
    const issueData = {
      owner,
      repo,
      title,
      body: body || null,
      milestone: milestone || null,
      labels: labels ? listToArray(labels) : null,
      assignees: assignees ? listToArray(assignees) : null,
    };
    
    core.debug(`Issue payload: ${JSON.stringify(issueData, null, 2)}`);
    
    const { data: newIssue } = await octokit.rest.issues.create(issueData);
    core.info(`Issue created: ${newIssue.html_url}`);
    
    core.setOutput('JSON', JSON.stringify(newIssue));
    core.setOutput('NUMBER', newIssue.number);
    core.setOutput('URL', newIssue.html_url);
    
    console.log(`
      -------------------------------------------------
      🎉 Success! Issue has been created successfully.
      Thank you for using this action! – Vedansh ✨
      -------------------------------------------------
    `);

  } catch (error) {
    core.error(error);
    override.handleError(error);
    core.setFailed(`Failed to create issue: ${error.message}`);
  }

})();
/****************************************
 * @author Vedansh
 * @url https://github.com/offensive-vk
  ***************************************
*/