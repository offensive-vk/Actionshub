// @ts-nocheck
const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');
const yaml = require('js-yaml'); // To handle YAML files

const context = github.context;
const issue = context.payload.issue;
const labels = [];
const title = issue.title.toLowerCase();
const body = issue.body ? issue.body.toLowerCase() : '';

/**
 * Fetch the labels from configuration and verify them
 * @param labels the labels from the user config file
 * @returns all matching labels
 */
function GetLabels<T extends Array<{ label: string, match: Array<string> }>>(labels: T): Array<T> | undefined {
    const tempLabels: Array<T> = [];
    labels.forEach(({ label, match }) => {
        if (match.some(keyword => title.includes(keyword) || body.includes(keyword))) {
            tempLabels.push({ label, match });
        }
    });
    return tempLabels.length > 0 ? tempLabels : undefined;
}

/**
 * Generate a random color in hex format (e.g., 'ff5733')
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.slice(1);
}

/**
 * Check if a label exists in the repository, if not, create it with a random color.
 */
async function ensureLabelExists(octokit, owner, repo, label) {
    try {
        await octokit.rest.issues.getLabel({
            owner,
            repo,
            name: label,
        });
        core.debug(`Label "${label}" already exists.`);
    } catch (error) {
        if (error.status === 404) {
            const randomColor = getRandomColor();
            core.debug(`Label "${label}" not found, creating it with color #${randomColor}.`);
            await octokit.rest.issues.createLabel({
                owner,
                repo,
                name: label,
                color: randomColor,
            });
            core.info(`Label "${label}" created with color #${randomColor}.`);
        } else {
            throw error;
        }
    }
}

/**
 * Parse configuration file (JSON or YAML)
 * @param filePath Path to the configuration file
 * @returns Parsed configuration object
 */
function parseConfigFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
        return yaml.load(fileContent);  // Parse YAML
    } else if (filePath.endsWith('.json')) {
        return JSON.parse(fileContent);  // Parse JSON
    }
    throw new Error(`Unsupported file type: ${filePath}`);
}

(async () => {
    try {
        const token = core.getInput('github-token', { required: true });
        const octokit = github.getOctokit(token);

        const { owner: contextOwner, repo: contextRepo } = github.context.repo;
        const owner = core.getInput('owner') || contextOwner;
        const repo = core.getInput('repo') || contextRepo;

        // Get file paths for the issue and PR config files from action inputs
        const issueConfigPath = core.getInput('issue-config');
        const prConfigPath = core.getInput('pr-config');

        // Parse the config files
        const issueLabelMapping = parseConfigFile(issueConfigPath) || [];
        const prLabelMapping = prConfigPath ? parseConfigFile(prConfigPath) : [];

        let matched = false;

        // Process issue labels
        for (const { label, match } of issueLabelMapping) {
            if (match.some(keyword => title.includes(keyword) || body.includes(keyword))) {
                labels.push(label as never);
                matched = true;

                // Ensure the label exists in the repo, otherwise create it with a random color
                await ensureLabelExists(octokit, owner, repo, label);
            }
        }

        if (!matched) {
            labels.push('unknown' as unknown as never);

            // Ensure the 'unknown' label exists in the repo
            await ensureLabelExists(octokit, owner, repo, 'unknown');
        }

        // Add labels to the issue or PR
        if (labels.length > 0) {
            await octokit.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                labels: labels
            });
        }

        console.log(`
            -------------------------------------------------
            🎉 Success! Issue/PRs have been labeled successfully.
            Thank you for using this action! – Vedansh ✨
            -------------------------------------------------
        `);

    } catch (error) {
        core.error(error);
        core.setFailed(`Failed to label pr or issue: ${error.message}`);
    }

})();
