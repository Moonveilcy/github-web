import { RepoFile } from "../types";

const GITHUB_API_BASE = "https://api.github.com";

const apiFetch = async (url: string, token: string, options: RequestInit = {}) => {
    const cleanToken = token.trim();
    const response = await fetch(`${GITHUB_API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `token ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `GitHub API request failed: ${response.statusText}`);
    }
    return response.json();
};

export const scanRepoTree = (repo: string, branch: string, token: string) => 
    apiFetch(`/repos/${repo}/git/trees/${branch}?recursive=1`, token);

export const fetchCommits = (repo: string, branch: string, token: string) =>
    apiFetch(`/repos/${repo}/commits?sha=${branch}&per_page=10`, token);

export const getFileContent = async (repo: string, path: string, branch: string, token: string) => {
    try {
        const data = await apiFetch(`/repos/${repo}/contents/${path}?ref=${branch}`, token);
        return atob(data.content);
    } catch (error) {
        if ((error as Error).message.includes("Not Found")) {
            return "";
        }
        throw error;
    }
};

const getLatestCommitSha = (repo: string, branch: string, token: string) =>
    apiFetch(`/repos/${repo}/git/ref/heads/${branch}`, token).then(data => data.object.sha);

const createBlob = (repo: string, content: string, token: string) =>
    apiFetch(`/repos/${repo}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({ content: btoa(unescape(encodeURIComponent(content))), encoding: 'base64' }),
    }).then(data => data.sha);

const createTree = (repo: string, baseTreeSha: string, tree: { path: string; mode: string; type: string; sha: string }[], token: string) =>
    apiFetch(`/repos/${repo}/git/trees`, token, {
        method: 'POST',
        body: JSON.stringify({ base_tree: baseTreeSha, tree }),
    }).then(data => data.sha);

const createCommit = (repo: string, message: string, treeSha: string, parentCommitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/commits`, token, {
        method: 'POST',
        body: JSON.stringify({ message, tree: treeSha, parents: [parentCommitSha] }),
    }).then(data => data.sha);

const updateBranchRef = (repo: string, branch: string, commitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/refs/heads/${branch}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commitSha }),
    });

const createSummaryCommitMessage = (files: RepoFile[]): string => {
    if (files.length === 0) return "chore: empty commit";

    const getScope = (path: string): string => {
        const pathParts = path.split('/').filter(p => p && !p.includes('.'));
        return pathParts.length > 0 ? pathParts.pop()! : path.split('.')[0];
    };

    if (files.length === 1) {
        const file = files[0];
        const scope = getScope(file.path);
        const description = file.commitMessage || `update ${file.name}`;
        return `${file.commitType}(${scope}): ${description}`;
    }

    const types = new Set(files.map(f => f.commitType));
    const primaryType = types.has('feat') ? 'feat' : types.has('fix') ? 'fix' : 'chore';
    
    const subject = `${primaryType}: update ${files.length} files across multiple scopes`;

    const body = files.map(file => {
        const scope = getScope(file.path);
        const description = file.commitMessage || `update ${file.name}`;
        return `* ${file.commitType}(${scope}): ${description}`;
    }).join('\n');

    return `${subject}\n\n${body}`;
};

export const commitMultipleFiles = async (
    repo: string,
    branch: string,
    token: string,
    files: RepoFile[],
) => {
    const parentCommitSha = await getLatestCommitSha(repo, branch);
    const parentCommitData = await apiFetch(`/repos/${repo}/git/commits/${parentCommitSha}`, token);
    const baseTreeSha = parentCommitData.tree.sha;

    const fileBlobs = await Promise.all(
        files.map(async file => ({
            path: file.path,
            sha: await createBlob(repo, file.content, token),
        }))
    );
    
    const tree = fileBlobs.map(blob => ({
        path: file.path,
        mode: '100644', 
        type: 'blob',
        sha: blob.sha,
    }));

    const newTreeSha = await createTree(repo, baseTreeSha, tree, token);
    
    const commitMessage = createSummaryCommitMessage(files);

    const newCommitSha = await createCommit(repo, commitMessage, newTreeSha, parentCommitSha, token);
    await updateBranchRef(repo, branch, newCommitSha, token);
    return newCommitSha;
};