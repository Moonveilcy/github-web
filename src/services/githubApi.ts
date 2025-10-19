import { RepoFile } from "../types";

const GITHUB_API_BASE = "https://api.github.com";

const apiFetch = async (url: string, token: string, options: RequestInit = {}) => {
    const response = await fetch(`${GITHUB_API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `token ${token}`,
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
    apiFetch(`/repos/${repo}/git/trees/${branch}?recursive=1`, token.trim());

export const fetchCommits = (repo: string, branch: string, token: string) =>
    apiFetch(`/repos/${repo}/commits?sha=${branch}&per_page=10`, token.trim());

export const getFileContent = async (repo: string, path: string, branch: string, token: string) => {
    try {
        const data = await apiFetch(`/repos/${repo}/contents/${path}?ref=${branch}`, token.trim());
        return atob(data.content);
    } catch (error) {
        if ((error as Error).message.includes("Not Found")) {
            return "";
        }
        throw error;
    }
};

const getLatestCommitSha = (repo: string, branch: string, token: string) =>
    apiFetch(`/repos/${repo}/git/ref/heads/${branch}`, token.trim()).then(data => data.object.sha);

const getTreeForCommit = (repo: string, commitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/commits/${commitSha}`, token.trim()).then(data => data.tree.sha);

const createBlob = (repo: string, content: string, token: string) =>
    apiFetch(`/repos/${repo}/git/blobs`, token.trim(), {
        method: 'POST',
        body: JSON.stringify({ content: btoa(unescape(encodeURIComponent(content))), encoding: 'base64' }),
    }).then(data => data.sha);

const createTree = (repo: string, baseTreeSha: string, tree: { path: string; mode: string; type: string; sha: string }[], token: string) =>
    apiFetch(`/repos/${repo}/git/trees`, token.trim(), {
        method: 'POST',
        body: JSON.stringify({ base_tree: baseTreeSha, tree }),
    }).then(data => data.sha);

const createCommit = (repo: string, message: string, treeSha: string, parentCommitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/commits`, token.trim(), {
        method: 'POST',
        body: JSON.stringify({ message, tree: treeSha, parents: [parentCommitSha] }),
    }).then(data => data.sha);

const updateBranchRef = (repo: string, branch: string, commitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/refs/heads/${branch}`, token.trim(), {
        method: 'PATCH',
        body: JSON.stringify({ sha: commitSha }),
    });

const createIndividualCommitMessage = (file: RepoFile): string => {
    const getScope = (path: string): string => {
        const pathParts = path.split('/').filter(p => p && !p.includes('.'));
        return pathParts.length > 0 ? pathParts.pop()! : path.split('.')[0];
    };
    const scope = getScope(file.path);
    const description = file.commitMessage || `update ${file.name}`;
    return `${file.commitType}(${scope}): ${description}`;
};

export const commitMultipleFiles = async (
    repo: string,
    branch: string,
    token: string,
    files: RepoFile[],
) => {
    const cleanToken = token.trim();
    let parentCommitSha = await getLatestCommitSha(repo, branch, cleanToken);

    for (const file of files) {
        const baseTreeSha = await getTreeForCommit(repo, parentCommitSha, cleanToken);
        const blobSha = await createBlob(repo, file.content, cleanToken);
        
        const tree = [{
            path: file.path,
            mode: '100644', 
            type: 'blob',
            sha: blobSha,
        }];

        const newTreeSha = await createTree(repo, baseTreeSha, tree, cleanToken);
        const commitMessage = createIndividualCommitMessage(file);
        const newCommitSha = await createCommit(repo, commitMessage, newTreeSha, parentCommitSha, cleanToken);
        
        parentCommitSha = newCommitSha;
    }

    await updateBranchRef(repo, branch, parentCommitSha, cleanToken);
    return parentCommitSha;
};