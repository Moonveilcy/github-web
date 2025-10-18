export interface CommitAuthor {
  name: string;
  date: string;
}

export interface CommitData {
  author: CommitAuthor;
  message: string;
}

export interface Commit {
  sha: string;
  commit: CommitData;
}

export interface RepoFile {
  name: string;
  path: string; // Path sekarang akan di-input manual oleh user
  content: string;
  status: 'idle' | 'committing' | 'committed' | 'error';
}