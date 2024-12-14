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
 
const context = github.context;

interface FileLabelConfig {
    label: string;
    match: Array<string>;
    description?: string;
}

async function getChangedFiles(octokit: any, owner: string, repo: string, prNumber: number): Promise<string[]> {
    const { data: files } = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
    });
    return files.map((file: any) => file.filename);
}

function GetFileLabels<T extends FileLabelConfig>(files: Array<string>, labels: Array<T>): Array<{ label: string; description?: string }> | undefined {
    const matchedLabels: Array<{ label: string; description?: string }> = [];
    labels.forEach(({ label, match, description }) => {
        if (match.some(pattern => files.some(file => minimatch(file, pattern)))) {
            matchedLabels.push({ label, description });
        }
    });
    return matchedLabels.length > 0 ? matchedLabels : undefined;
}

function parseConfigFile(filePath: string): Array<FileLabelConfig> {
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
        return Object.entries(parsedData).map(([label, patterns]) => ({
            label,
            match: patterns as string[],
        }));
    } else {
        throw new Error(`Parsed data from ${filePath} is not an object or is empty.`);
    }
}

async function ensureLabelExists(octokit: any, owner: string, repo: string, label: string, description?: string) {
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
            core.debug(`Label "${label}" not found, creating it with color #${randomColor} and description "${description}".`);
            await octokit.rest.issues.createLabel({
                owner,
                repo,
                name: label,
                color: randomColor,
                description: description || '',
            });
            core.info(`Label "${label}" created with color #${randomColor} and description "${description}".`);
        } else {
            core.error(error);
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

(async () => {
    try {
        const token = core.getInput('github-token', { required: true });
        const octokit = github.getOctokit(token);
        const { owner: contextOwner, repo: contextRepo } = github.context.repo;
        const owner = core.getInput('owner') || contextOwner;
        const repo = core.getInput('repo') || contextRepo;
        const fileConfigPath = core.getInput('pr-config') || core.getInput('issue-config');
        const fileLabelMapping = fileConfigPath ? parseConfigFile(fileConfigPath) : [];
        const labels: string[] = [];

        if (context.payload.pull_request) {
            const prNumber = context.payload.pull_request.number;
            const changedFiles = await getChangedFiles(octokit, owner, repo, prNumber);

            const matchedFileLabels = GetFileLabels(changedFiles, fileLabelMapping);
            if (matchedFileLabels) {
                for (const { label, description } of matchedFileLabels) {
                    labels.push(label);
                    await ensureLabelExists(octokit, owner, repo, label, description);
                }
            } else {
                labels.push('unknown');
                await ensureLabelExists(octokit, owner, repo, 'unknown', 'No specific file-based label matched');
            }
        }

        if (context.payload.pull_request?.number && labels.length > 0) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: context.payload.pull_request.number,
                labels: labels,
            });
        } else {
            core.warning("No pull request found in the context.");
        }

        console.log(`
            ---------------------------------------------------------------------
            🎉 Success! Labels have been applied to the Issue/PR.
            Thank you for using this action! – Vedansh ✨ (offensive-vk)
            ---------------------------------------------------------------------
        `);

    } catch (error: any) {
        console.dir(error);
        core.setFailed(`Failed to label PR based on file changes: ${error.message}`);
    }
})();

/** Special Ending For You, Bud */