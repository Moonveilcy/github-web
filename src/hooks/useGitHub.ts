import { useState, useEffect, useCallback } from 'react';
import { Commit, RepoFile } from '../types';

const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

export const useGitHub = () => {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [geminiKey, setGeminiKey] = useState('');
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [repoFilePaths, setRepoFilePaths] = useState<Map<string, string>>(new Map());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [storeToken, setStoreToken] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('githubToken');
    const storedGeminiKey = localStorage.getItem('geminiKey');
    const shouldStore = localStorage.getItem('shouldStoreToken') === 'true';
    if (shouldStore) {
        if (storedToken) setToken(storedToken);
        if (storedGeminiKey) setGeminiKey(storedGeminiKey);
        setStoreToken(true);
    }
  }, []);

  useEffect(() => {
    if (storeToken) {
      if(token) localStorage.setItem('githubToken', token);
      if(geminiKey) localStorage.setItem('geminiKey', geminiKey);
      localStorage.setItem('shouldStoreToken', 'true');
    } else {
      localStorage.removeItem('githubToken');
      localStorage.removeItem('geminiKey');
      localStorage.removeItem('shouldStoreToken');
    }
  }, [token, geminiKey, storeToken]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const finalCommitMessage = (file: RepoFile) => {
    const scopeParts = file.path.split('/').filter(p => p && !p.includes('.'));
    const scope = scopeParts.length > 0 ? scopeParts[scopeParts.length - 1] : '';
    const description = file.commitMessage || `update ${file.name}`;
    return `${file.commitType}${scope ? `(${scope})` : ''}: ${description}`;
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
  
  const handleGenerateCommitMessage = async (index: number) => {
    const file = files[index];
    if (!geminiKey) {
        showNotification('Gemini API Key is required to generate messages.', 'error');
        return;
    }
    if (!file.path) {
        showNotification('File path must be set to find the original file.', 'error');
        return;
    }
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'generating' } : f));
    try {
        const oldContentResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${file.path}?ref=${branch}`, {
            headers: { 'Authorization': `token ${token}` }
        });
        let oldContent = '';
        if (oldContentResponse.ok) {
            const data = await oldContentResponse.json();
            oldContent = atob(data.content);
        }

        const prompt = `You are an expert Git commit message generator. Analyze the difference between the old and new code below. Generate a Conventional Commit message.
        Respond ONLY with a JSON object in this format: {"type": "commit_type", "message": "your_concise_message"}.
        Example response: {"type": "refactor", "message": "improve API request error handling"}

        OLD CODE (if any):
        ---
        ${oldContent}
        ---

        NEW CODE:
        ---
        ${file.content}
        ---
        `;

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`;
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }]})
        });

        if (!response.ok) throw new Error('Gemini API failed.');

        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        updateFileCommitDetails(index, { type: parsed.type, message: parsed.message });

    } catch (error) {
        showNotification(`Failed to generate message: ${(error as Error).message}`, 'error');
    }
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'idle' } : f));
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const existingPath = repoFilePaths.get(file.name) || '';
        setFiles(prev => [...prev, { 
            name: file.name, 
            path: existingPath, 
            content, 
            status: 'idle',
            commitType: 'feat',
            commitMessage: '',
        }]);
      };
      reader.readAsText(file);
    });
  };

  const updateFilePath = (index: number, newPath: string) => {
    setFiles(prev => prev.map((file, i) => i === index ? { ...file, path: newPath } : file));
  };

  const updateFileCommitDetails = (index: number, details: { type?: string; message?: string }) => {
    setFiles(prev => prev.map((file, i) => {
        if (i === index) {
            return {
                ...file,
                commitType: details.type !== undefined ? details.type : file.commitType,
                commitMessage: details.message !== undefined ? details.message : file.commitMessage,
            };
        }
        return file;
    }));
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
    if (!file.path) {
        showNotification(`Path is required for ${file.name}.`, 'error');
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'error' } : f));
        return false;
    }
     if (!file.commitMessage) {
        showNotification(`Commit description is required for ${file.name}.`, 'error');
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'error' } : f));
        return false;
    }
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'committing' } : f));
    try {
      const sha = await getFileSha(file.path);
      const body = {
        message: finalCommitMessage(file),
        content: toBase64(file.content),
        branch: branch,
        ...(sha && { sha }),
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
    const idleFiles = files.filter(f => f.status === 'idle');
    if (!token || !repo || !branch || idleFiles.length === 0) {
      showNotification('Token, Repo, Branch, and at least one new file are required.', 'error');
      return;
    }
    setIsLoading(true);
    let allSucceeded = true;

    for (const file of idleFiles) {
        const fileIndex = files.findIndex(f => f === file);
        const success = await commitFile(file, fileIndex);
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
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
    setIsLoading(false);
  }, [token, repo, branch]);

  return {
    token, setToken,
    repo, setRepo,
    branch, setBranch,
    geminiKey, setGeminiKey,
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
    updateFileCommitDetails,
    handleCommitAndPush,
    handleFetchCommits,
    handleScanRepo,
    handleGenerateCommitMessage,
  };
};