import { useState, useEffect, useCallback } from 'react';
import { Commit, RepoFile } from '../types';
import * as githubApi from '../services/githubApi';
import * as geminiApi from '../services/geminiApi';

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
  
  const handleScanRepo = useCallback(async () => {
    if (!token || !repo) {
        showNotification('Token and Repository must be filled to scan.', 'error');
        return;
    }
    setIsScanning(true);
    setRepoFilePaths(new Map());
    try {
        const { tree } = await githubApi.scanRepoTree(repo, branch, token);
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
    if (!file.path) {
        showNotification('File path must be set to find the original file.', 'error');
        return;
    }
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'generating' } : f));
    try {
        const oldContent = await githubApi.getFileContent(repo, file.path, branch, token);
        const { type, message } = await geminiApi.generateCommitMessageFromDiff(geminiKey, oldContent, file.content);
        updateFileCommitDetails(index, { type, message });
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
            name: file.name, path: existingPath, content, status: 'idle',
            commitType: 'feat', commitMessage: '',
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
            return { ...file, commitType: details.type ?? file.commitType, commitMessage: details.message ?? file.commitMessage };
        }
        return file;
    }));
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };

  const handleCommitAndPush = async () => {
    const filesToCommit = files.filter(f => f.status === 'idle');
    if (!token || !repo || !branch || filesToCommit.length === 0) {
      showNotification('Configuration and at least one file are required.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await githubApi.commitMultipleFiles(repo, branch, token, filesToCommit);
      showNotification(`${filesToCommit.length} files committed successfully in a single push!`, 'success');
      setFiles(prev => prev.filter(f => f.status !== 'idle'));
      handleFetchCommits();
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
    setIsLoading(false);
  };

  const handleFetchCommits = useCallback(async () => {
    if (!token || !repo) return;
    setIsLoading(true);
    setCommits([]);
    try {
      const commitsData = await githubApi.fetchCommits(repo, branch, token);
      setCommits(commitsData);
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
    setIsLoading(false);
  }, [token, repo, branch]);

  return {
    token, setToken, repo, setRepo, branch, setBranch, geminiKey, setGeminiKey, files,
    commits, isLoading, isScanning, repoFilled: !!token && !!repo, notification, setNotification,
    storeToken, setStoreToken, processFiles, removeFile, updateFilePath, updateFileCommitDetails,
    handleCommitAndPush, handleFetchCommits, handleScanRepo, handleGenerateCommitMessage,
  };
};