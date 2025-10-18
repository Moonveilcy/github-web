import { useState, useEffect, useCallback } from 'react';
import { Commit, RepoFile } from '../types';

const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

// Fungsi baru untuk menebak tipe commit
const getCommitType = (filePath: string): string => {
  if (filePath.includes('src/commands')) return 'feat';
  if (filePath.includes('src/')) return 'fix';
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
  
  // autoMessage di-upgrade
  const autoMessage = (file: RepoFile) => {
    const type = getCommitType(file.path);
    const scope = file.path.split('/')[1] || 'general'; // Ambil scope dari folder kedua
    return `${type}(${scope}): update ${file.name} - ${username || 'user'}`;
  };

  const processFiles = (fileHandles: FileSystemFileHandle[]) => {
    fileHandles.forEach(async (handle) => {
        if (handle.kind !== 'file') return;
        const file = await handle.getFile();
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            // Dapatkan path relatif dari handle
            // @ts-ignore - getRelativePath is not in standard TS lib yet
            handle.getRelativePath(handle.ancestor).then(path => {
                 setFiles(prev => [...prev, { name: file.name, path, content, status: 'idle' }]);
            });
        };
        reader.readAsText(file);
    });
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };
  
  const getFileSha = async (path: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
        headers: { 'Authorization': `token ${token}` },
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to get file SHA for ${path}`);
      const data = await response.json();
      return data.sha;
    } catch (error) {
      throw error;
    }
  };

  const commitFile = async (file: RepoFile, index: number) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'committing' } : f));
    try {
      // Gunakan file.path sekarang
      const sha = await getFileSha(file.path);
      const body = {
        message: autoMessage(file),
        content: toBase6á4(file.content),
        branch: branch,
        ...(sha && { sha }),
      };

      // Gunakan file.path di URL API
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
    token, setToken, repo, setRepo, branch, setBranch, files, commits,
    isLoading, notification, setNotification, storeToken, setStoreToken,
    processFiles, removeFile, handleCommitAndPush, handleFetchCommits,
  };
};