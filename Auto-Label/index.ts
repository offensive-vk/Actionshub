/******************************************************/
/**
 * @author Vedansh (offensive-vk)
 * @url https://github.com/offensive-vk/auto-label/
 * @lang TypeScript + Node.js
 * @type Github Action for Applying Labels on Issue and PR.
 * @uses Octokit and Actions Core
 * @runs Nodejs v20.x
 */
/******************************************************/
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const context = github.context;
const issue = context.payload.issue || context.payload.pull_request;
const title = issue?.title ? issue.title.toLowerCase() : '';
const body = issue?.body ? issue.body.toLowerCase() : '';


function GetLabels<T extends { label: string; match: Array<string> }>(labels: Array<T>): Array<string> | undefined {
    const tempLabels: Array<string> = [];
    labels.forEach(({ label, match }) => {
        if (match.some(keyword => title.includes(keyword) || body.includes(keyword))) {
            tempLabels.push(label);
        }
    });
    return tempLabels.length > 0 ? tempLabels : undefined;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.slice(1);
}

async function ensureLabelExists(octokit: any, owner: string, repo: string, label: string) {
    try {
        await octokit.rest.issues.getLabel({
            owner,
            repo,
            name: label,
        });
        core.debug(`Label "${label}" already exists.`);
    } catch (error: any) {
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
            core.error(error);
        }
    }
}

function parseConfigFile(filePath: string): Array<{ label: string; match: Array<string> }> {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let parsedData;
    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
        parsedData = yaml.load(fileContent);
    } else if (filePath.endsWith('.json')) {
        parsedData = JSON.parse(fileContent);
    } else {
        throw new Error(`Unsupported file type: ${filePath}`);
    }

    if (typeof parsedData === 'object' && parsedData !== null) {
        // Flatten dictionary to an array
        return Object.values(parsedData).flat() as Array<{ label: string; match: Array<string> }>;
    } else {
        throw new Error(`Parsed data from ${filePath} is not an object or is empty.`);
    }
}

(async () => {
    try {
        const token = core.getInput('github-token');
        const octokit = github.getOctokit(token);
        const labels: Array<string> = [];
        const { owner: contextOwner, repo: contextRepo } = github.context.repo;
        const owner = core.getInput('owner') || contextOwner;
        const repo = core.getInput('repo') || contextRepo;
        const createLabels = core.getInput('create-labels') === 'true';

        const issueConfigPath = core.getInput('issue-config');
        const prConfigPath = core.getInput('pr-config');

        const issueLabelMapping = issueConfigPath ? parseConfigFile(issueConfigPath) : [];
        const prLabelMapping = prConfigPath ? parseConfigFile(prConfigPath) : [];

        const matchedLabels = GetLabels(issueLabelMapping);
        if (matchedLabels) {
            for (const label of matchedLabels) {
                labels.push(label);
                await ensureLabelExists(octokit, owner, repo, label);
            }
        } else {
            labels.push('unknown');
            await ensureLabelExists(octokit, owner, repo, 'unknown');
        }

        if (context.issue?.number && labels.length > 0) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: context.issue.number,
                labels: labels,
            });
        } else {
            core.warning("No issue or PR number found in the context.");
        }

        console.log(`
            -------------------------------------------------
            🎉 Success! Issue/PRs have been labeled successfully.
            Thank you for using this action! – Vedansh ✨
            -------------------------------------------------
        `);

    } catch (error: any) {
        core.setFailed(`Failed to label PR or issue: ${error.message}`);
    }
})();
