/******************************************************/
/**
 * @author Vedansh (offensive-vk)
 * @url https://github.com/offensive-vk/auto-label/
 * @lang TypeScript + Node.js + Octokit
 * @type Github Action for Applying Labels on PRs.
 * @runs Nodejs v20.x
 * @bundler esbuild
 */
/******************************************************/
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { minimatch } from 'minimatch';
import { Octokit } from '@octokit/rest';

const context = github.context;

interface LabelConfig {
    label: string;
    match: Array<string>;
    description?: string;
}

async function getChangedFiles(octokit: Octokit, owner: string, repo: string, prNumber: number): Promise<string[]> {
    const { data: files } = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
    });
    const filenames = files.map((file: any) => file.filename);
    core.debug(`Changed files: ${filenames.join(', ')}`);
    return filenames;
}

function parseConfigFile(filePath: string): Array<LabelConfig> {
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
        return Object.entries(parsedData).map(([label, patterns]) => {
            if (!Array.isArray(patterns)) {
                throw new Error(`Patterns for label "${label}" should be an array.`);
            }
            return { label, match: patterns as string[] };
        });
    } else {
        throw new Error(`Parsed data from ${filePath} is not an object or is empty.`);
    }
}
async function ensureLabelsExist(
    octokit: any,
    owner: string,
    repo: string,
    labels: Array<{ label: string; description?: string }>
) {
    const tasks = labels.map(({ label, description }) =>
        ensureLabelExists(octokit, owner, repo, label, description)
    );
    await Promise.all(tasks);
}

async function ensureLabelExists(octokit: any, owner: string, repo: string, label: string, description?: string) {
    try {
        await octokit.rest.issues.getLabel({ owner, repo, name: label });
        core.debug(`Label "${label}" already exists.`);
    } catch (error: any) {
        if (error.status === 404) {
            const randomColor = getRandomColor();
            core.info(`Label "${label}" not found. Creating it with color #${randomColor}.`);
            await octokit.rest.issues.createLabel({
                owner,
                repo,
                name: label,
                color: randomColor,
                description: description || '',
            });
            core.info(`Label "${label}" created successfully.`);
        } else {
            core.warning(error);
        }
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.slice(1);
}

function getMatchedLabels<T extends LabelConfig>(content: Array<string>, labels: Array<T>): 
    Array<{ label: string; description?: string }> | undefined {
    const matchedLabels: Array<{ label: string; description?: string }> = [];
    labels.forEach(({ label, match, description }) => {
        core.debug(`Checking label "${label}" with patterns: ${match.join(', ')}`);
        if (match.some(pattern => content.some(item => minimatch(item, pattern)))) {
            matchedLabels.push({ label, description });
        }
    });
    return matchedLabels.length > 0 ? matchedLabels : undefined;
}

function resolvePath (path: string) {
    return path.replace(/\$([A-Z_]+)/g, (_, name) => process.env[name] || '');
};

(async () => {
    try {
        const token = core.getInput('github-token') || process.env.GITHUB_TOKEN || '';
        const octokit = github.getOctokit(token);
        const debugMode = core.getBooleanInput('debug') || true;

        const { owner: contextOwner, repo: contextRepo } = github.context.repo;
        const owner = core.getInput('owner') || contextOwner;
        const repo = core.getInput('repo') || contextRepo;
        const actionNumber = core.getInput('number') || undefined;
        const prConfigPath = resolvePath(core.getInput('pr-config') || '.github/pr.yml');
        const issueConfigPath = resolvePath(core.getInput('issue-config') || '.github/issues.yml');

        if (debugMode) {
            core.debug(`PR Config Path: ${prConfigPath}`);
            core.debug(`Issue Config Path: ${issueConfigPath}`);
        }

        const eventType = context.eventName;
        const labelsToApply: string[] = [];
        let targetNumber;

        if (eventType === 'pull_request' && context.payload.pull_request) {
            const prNumber = context.payload.pull_request.number;
            targetNumber = prNumber;

            if (!prConfigPath) {
                core.setFailed('Missing "pr-config" input for pull request labeling.');
                return;
            }

            const changedFiles = await getChangedFiles(octokit as unknown as Octokit, owner, repo, prNumber);
            const fileLabelMapping = parseConfigFile(prConfigPath);

            const matchedLabels = getMatchedLabels(changedFiles, fileLabelMapping);
            if (matchedLabels) {
                for (const { label, description } of matchedLabels) {
                    labelsToApply.push(label);
                    await ensureLabelsExist(octokit, owner, repo, [{label: label, description: description}]);
                }
            } else {
                core.warning('No labels matched the file changes in this pull request.');
            }

        } else if (eventType === 'issues' && context.payload.issue) {
            const issueNumber = context.payload.issue.number;
            targetNumber = issueNumber;

            if (!issueConfigPath) {
                core.setFailed('Missing "issue-config" input for issue labeling.');
                return;
            }

            const titleAndBody = [`${context.payload.issue.title}`, `${context.payload.issue.body || ''}`];
            const issueLabelMapping = parseConfigFile(issueConfigPath);

            const matchedLabels = getMatchedLabels(titleAndBody, issueLabelMapping);
            if (matchedLabels) {
                for (const { label, description } of matchedLabels) {
                    labelsToApply.push(label);
                    await ensureLabelExists(octokit, owner, repo, label, description);
                }
            } else {
                core.warning('No labels matched the issue title or body.');
            }

        } else if (eventType == 'workflow_dispatch' && actionNumber != 'undefined') {
            targetNumber = actionNumber as unknown as number;
            
            if (context.payload.issue) {
                if (!issueConfigPath) {
                    core.setFailed('Missing "issue-config" input for issue labeling.');
                    return;
                }
    
                const titleAndBody = [`${context.payload.issue.title}`, `${context.payload.issue.body || ''}`];
                const issueLabelMapping = parseConfigFile(issueConfigPath);
    
                const matchedLabels = getMatchedLabels(titleAndBody, issueLabelMapping);
                if (matchedLabels) {
                    for (const { label, description } of matchedLabels) {
                        labelsToApply.push(label);
                        await ensureLabelExists(octokit, owner, repo, label, description);
                    }
                } else {
                    core.warning('No labels matched the issue title or body.');
                }
            }

            if (context.payload.pull_request) {
                if (!prConfigPath) {
                    core.setFailed('Missing "pr-config" input for pull request labeling.');
                    return;
                }
    
                const changedFiles = await getChangedFiles(octokit as unknown as Octokit, owner, repo, targetNumber);
                const fileLabelMapping = parseConfigFile(prConfigPath);
    
                const matchedLabels = getMatchedLabels(changedFiles, fileLabelMapping);
                if (matchedLabels) {
                    for (const { label, description } of matchedLabels) {
                        labelsToApply.push(label);
                        await ensureLabelsExist(octokit, owner, repo, [{label: label, description: description}]);
                    }
                } else {
                    core.warning('No labels matched the file changes in this pull request.');
                }
            }
        } else {
            core.warning(`Event Type "${eventType}" is not supported.`);
        }

        if (targetNumber && labelsToApply.length > 0) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: targetNumber,
                labels: labelsToApply,
            });
            core.info(`Issue Labels Applied: ${labelsToApply.join(', ')}`);
        } else {
            core.warning('No labels were applied.');
        }

        console.log(`
            --------------------------------------------------------------
            🎉 Success! Labels have been applied to Issue/PR.
            ✨ Thank you for using this action! – Vedansh
            --------------------------------------------------------------
        `);

    } catch (error: any) {
        core.error(`Error: ${error.message}`);
        core.setFailed(`Failed to label PR based on file changes: \n${error.message}`);
    }
})();