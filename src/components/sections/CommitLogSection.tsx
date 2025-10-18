import { Commit } from '../../types';

interface CommitLogSectionProps {
    commits: Commit[];
}

export const CommitLogSection = ({ commits }: CommitLogSectionProps) => (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Latest Commits</h2>
        <div className="max-h-64 overflow-y-auto space-y-3">
        {commits.length > 0 ? (
            commits.map(c => (
            <div key={c.sha} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm">
                <p className="font-mono truncate">{c.commit.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">by {c.commit.author.name} on {new Date(c.commit.author.date).toLocaleString()}</p>
            </div>
            ))
        ) : (
            <p className="text-gray-500">No commits fetched yet. Click "Fetch Commits" to see the log.</p>
        )}
        </div>
    </section>
);