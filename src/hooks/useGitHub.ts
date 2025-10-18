import { useState, useEffect, useCallback } from 'react';
import { Commit, RepoFile } from '../types';

// Helper function to convert string to Base64
const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

// Helper function to determine commit message type based on file path
const getCommitType = (filePath: string): string => {
  if (!filePath) return 'feat';
  if (filePath.includes('src/commands')) return 'feat';
  if (filePath.includes('src/models')) return 'fix';
  if (filePath.match(/(\.md|LICENSE)$/i)) return 'docs';
  if (filePath.match(/(package\.json|config\.js)$/i)) return 'chore';
  return 'refactor';
};

export const useGitHub = () => {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [repoFilePaths, setRepoFilePaths] = useState<Map<string, string>>(new Map());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [storeToken, setStoreToken] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('githubToken');
    const shouldStore = localStorage.getItem('shouldStoreToken') === 'true';
    if (storedToken && shouldStore) {
      setToken(storedToken);
      setStoreToken(true);
    }
  }, []);

  useEffect(() => {
    if (storeToken && token) {
      localStorage.setItem('githubToken', token);
      localStorage.setItem('shouldStoreToken', 'true');
    } else {
      localStorage.removeItem('githubToken');
      localStorage.removeItem('shouldStoreToken');
    }
  }, [token, storeToken]);

  useEffect(() => {
    if (!token) {
      setUsername('');
      return;
    }
    const fetchUsername = async () => {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: { 'Authorization': `token ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch username.');
        const data = await response.json();
        setUsername(data.login);
      } catch (error) {
        setNotification({ message: "Invalid token. Could not fetch username.", type: 'error' });
      }
    };
    fetchUsername();
  }, [token]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const autoMessage = (file: RepoFile) => {
    const type = getCommitType(file.path);
    const scopeParts = file.path.split('/');
    const scope = scopeParts.length > 1 ? scopeParts[scopeParts.length - 2] : 'general';
    const action = file.status === 'idle' ? 'update' : 'create';
    return `${type}(${scope}): ${action} ${file.name} - ${username || 'user'}`;
  };
  
  const handleScanRepo = useCallback(async () => {
    if (!token || !repo) {
        showNotification('Token and Repository must be filled to scan.', 'error');
        return;
    }
    setIsScanning(true);
    setRepoFilePaths(new Map());
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, {
            headers: { 'Authorization': `token ${token}` },
        });
        if (!response.ok) throw new Error('Failed to scan repository. Check repo name and branch.');
        const { tree } = await response.json();
        const fileMap = new Map();
        for (const item of tree) {
            if (item.type === 'blob') {
                const fileName = item.path.split('/').pop();
                if(fileName) fileMap.set(fileName, item.path);
            }
        }
        setRepoFilePaths(fileMap);
        showNotification(`Scan complete! Found ${fileMap.size} files.`, 'success');
    } catch (error) {
        showNotification((error as Error).message, 'error');
    }
    setIsScanning(false);
  }, [token, repo, branch]);

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const existingPath = repoFilePaths.get(file.name) || '';
        setFiles(prev => [...prev, { name: file.name, path: existingPath, content, status: 'idle' }]);
      };
      reader.readAsText(file);
    });
  };

  const updateFilePath = (index: number, newPath: string) => {
    setFiles(prev => prev.map((file, i) => i === index ? { ...file, path: newPath } : file));
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };
  
  const getFileSha = async (path: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
        headers: { 'Authorization': `token ${token}` },
      });
      if (response.status === 404) return null; // File doesn't exist, this is a new file
      if (!response.ok) throw new Error(`Failed to get file SHA for ${path}`);
      const data = await response.json();
      return data.sha;
    } catch (error) {
      throw error;
    }
  };

  const commitFile = async (file: RepoFile, index: number) => {
    if (!file.path) {
        showNotification(`Path is required for ${file.name}.`, 'error');
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'error' } : f));
        return false;
    }
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'committing' } : f));
    try {
      const sha = await getFileSha(file.path);
      const body = {
        message: autoMessage(file),
        content: toBase64(file.content),
        branch: branch,
        ...(sha && { sha }), // only include sha if it exists (for updates)
      };

      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${file.path}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Commit failed.');
      }
      setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'committed' } : f));
      return true;
    } catch (error) {
      setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'error' } : f));
      showNotification(`Error on ${file.name}: ${(error as Error).message}`, 'error');
      return false;
    }
  };

  const handleCommitAndPush = async () => {
    if (!token || !repo || !branch || files.filter(f => f.status === 'idle').length === 0) {
      showNotification('Token, Repo, Branch, and at least one new file are required.', 'error');
      return;
    }
    setIsLoading(true);
    let allSucceeded = true;

    for (const [index, file] of files.entries()) {
        if (file.status !== 'idle') continue;
        const success = await commitFile(file, index);
        if (!success) {
            allSucceeded = false;
            break; 
        }
    }
    
    setIsLoading(false);
    if (allSucceeded) {
      showNotification('All files committed and pushed successfully!', 'success');
      setFiles(prev => prev.filter(f => f.status !== 'committed'));
      handleFetchCommits();
    }
  };

  const handleFetchCommits = useCallback(async () => {
    if (!token || !repo) return;
    setIsLoading(true);
    setCommits([]);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=10`, {
        headers: { 'Authorization': `token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch commits.');
      setCommits(await response.json());
      showNotification('Fetched latest commits.', 'success');
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
    setIsLoading(false);
  }, [token, repo, branch]);

  return {
    token, setToken,
    repo, setRepo,
    branch, setBranch,
    files,
    commits,
    isLoading,
    isScanning,
    repoFilled: !!token && !!repo,
    notification, setNotification,
    storeToken, setStoreToken,
    processFiles,
    removeFile,
    updateFilePath,
    handleCommitAndPush,
    handleFetchCommits,
    handleScanRepo,
  };
};