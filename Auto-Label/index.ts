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

/**
 * @interface LabelConfig Schema for Proper API Usage.
 */
interface LabelConfig {
    label: string;
    match: Array<string>;
    description?: string;
}
/**
 * @type MatchedLabels for Array that contains matched labels with pattern.
 */
type MatchedLabels = Array<{ label: string , description?: string}>;

/**
 * Replaces environment variable placeholders in a given path with their actual values.
 * 
 * @param path - The path containing placeholders in the format $VARIABLE_NAME.
 * @returns The path with placeholders replaced by environment variable values.
 */
function resolvePath (path: string) {
    return path.replace(/\$([A-Z_]+)/g, (_, name) => process.env[name] || '');
};

/**
 * Generates a random hexadecimal color code.
 * @returns A string representing a random color in hexadecimal format (e.g., '1A2B3C').
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.slice(1);
}

async function getChangedFiles(octokit: any, owner: string, repo: string, prNumber: number): Promise<string[]> {
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
    let parsedData: Record<string, { match: string[]; description?: string }>;

    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
        parsedData = yaml.load(fileContent) as Record<string, { match: string[]; description?: string }>;
    } else if (filePath.endsWith('.json')) {
        parsedData = JSON.parse(fileContent) as Record<string, { match: string[]; description?: string }>;
    } else {
        throw new Error(`Unsupported file type: ${filePath}`);
    }

    if (typeof parsedData === 'object' && parsedData !== null) {
        return Object.entries(parsedData).map(([label, config]) => {
            if (!Array.isArray(config.match)) {
                throw new Error(`Invalid configuration for label "${label}".`);
            }
            return {
                label,
                match: config.match,
                description: config.description || undefined,
            };
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

async function ensureLabelExists(octokit: any, owner: string, repo: string, label: string, desc?: string) {
    try {
        await octokit.rest.issues.getLabel({ owner, repo, name: label });
        core.debug(`Label "${label}" already exists.`);
    } catch (error: any) {
        if (error.status === 404) {
            const randomColor = getRandomColor();
            core.info(`Label "${label}" not found. Creating it with color "#${randomColor}".`);
            await octokit.rest.issues.createLabel({
                owner: owner,
                repo: repo,
                name: label,
                color: randomColor,
                description: desc || '',
            });
            core.info(`Label "${label}" created successfully.`);
        } else {
            core.warning(error);
        }
    }
}

function findMatchingLabels(body: string, labelConfig: LabelConfig[]): MatchedLabels {
    const content = body.replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase().split(/\s+/);
    const matchedLabels: MatchedLabels = [];

    for (const { label, match, description } of labelConfig) {
        for (const word of content) {
            if (match.some(pattern => minimatch(word, pattern))) {
                matchedLabels.push({ label, description });
                break; // Avoid duplicate entries
            }
        }
    }

    return matchedLabels;
}

function getMatchedLabels<T extends LabelConfig>(content: Array<string>, labels: Array<T>): 
    MatchedLabels {
    const matchedLabels: MatchedLabels = [];
    labels.forEach(({ label, match, description }) => {
        core.debug(`Checking label "${label}" with patterns: ${match.join(', ')}`);
        if (match.some(pattern => content.some(item => minimatch(item, pattern)))) {
            matchedLabels.push({ label, description });
        }
    });
    return matchedLabels.length > 0 ? matchedLabels : [];
}

(async () => {
    try {
        const token = core.getInput('auth-token');
        const octokit = github.getOctokit(token);
        const debugMode = core.getBooleanInput('debug') || false;
        const { owner: contextOwner, repo: contextRepo } = github.context.repo;
        const owner = core.getInput('owner') || contextOwner;
        const repo = core.getInput('repo') || contextRepo;
        const actionNumber = core.getInput('number') || undefined;
        const prConfigPath = resolvePath(core.getInput('pr-config'));
        const issueConfigPath = resolvePath(core.getInput('issue-config'));
        const context = github.context;

        if (debugMode) {
            core.debug(`PR Config Path: ${prConfigPath}`);
            core.debug(`Issue Config Path: ${issueConfigPath}`);
        }

        const eventType = context.eventName;
        const labelsToApply = [];
        let targetNumber;

        if (eventType === 'pull_request' && context.payload.pull_request || eventType === 'pull_request_target' && context.payload.pull_request) {
            const prNumber = context.payload.pull_request.number;
            targetNumber = prNumber;
            core.debug(`Pull Request Number: ${targetNumber}`)

            if (!prConfigPath) {
                core.setFailed('Missing "pr-config" input for pull request labeling.');
                return;
            }

            const changedFiles = await getChangedFiles(octokit, owner, repo, prNumber);
            const fileLabelMapping = parseConfigFile(prConfigPath);

            const matchedLabels = getMatchedLabels(changedFiles, fileLabelMapping);
            console.dir(matchedLabels);

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
            core.debug(`Issue Number: ${targetNumber}`)

            if (!issueConfigPath) {
                core.setFailed('Missing "issue-config" input for issue labeling.');
                return;
            }

            const titleAndBody = `${context.payload.issue.title} ${context.payload.issue.body || ''}`;
            const issueLabelMapping = parseConfigFile(issueConfigPath);

            const matchedLabels = findMatchingLabels(titleAndBody, issueLabelMapping);
            console.dir(matchedLabels);

            if (matchedLabels) {
                for (const { label, description } of matchedLabels) {
                    core.info(`Matching label "${label}" with description "${description}"`);
                    labelsToApply.push(label);
                    await ensureLabelExists(octokit, owner, repo, label, description);
                }
            } else {
                core.warning('No labels matched the issue title or body.');
            }

        } else if (eventType == 'workflow_dispatch' && actionNumber != 'undefined') {
            targetNumber = actionNumber as unknown as number;
            core.warning(`Workflow dispatch event is still under development. - ${targetNumber}`)
        } else {
            core.warning(`Event Type "${eventType}" is not supported.`);
        }

        if (targetNumber && labelsToApply.length > 0) {
            await octokit.rest.issues.addLabels({
                owner: contextOwner,
                repo: contextRepo,
                issue_number: targetNumber,
                labels: labelsToApply,
            });

            core.info(`Labels Applied: ${labelsToApply.join(', ')}`);
        } else {
            core.warning('No labels were applied.');
        }

        console.log(`
            -------------------------------------------------
            🎉 Success! Labels have been applied to Issue/PR.
            ✨ Thank you for using this action! – Vedansh
            -------------------------------------------------
        `);

    } catch (error: any) {
        core.error(`Error: ${error.message}`);
        core.error(`Debug Info: ${JSON.stringify(error, null, 2)}`);
        core.setFailed(`Something went wrong in here. Kindly check the detailed logs.`)
    }
})();