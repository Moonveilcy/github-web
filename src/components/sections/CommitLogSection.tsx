import { Commit } from '../../types';

interface CommitLogSectionProps {
    commits: Commit[];
}

export const CommitLogSection = ({ commits }: CommitLogSectionProps) => (
    <section className="bg-white dark:bg-gray-800/80 p-6 rounded-lg border-2 border-green-400 shadow-[4px_4px_0px_#4ADE80] transition-shadow hover:shadow-[6px_6px_0px_#4ADE80]">
        <h2 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Latest Commits</h2>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {commits.length > 0 ? (
            commits.map(c => (
            <div key={c.sha} className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-md text-sm">
                <p className="font-mono truncate font-medium">{c.commit.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">by {c.commit.author.name} on {new Date(c.commit.author.date).toLocaleDateString()}</p>
            </div>
            ))
        ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No commits fetched yet.</p>
        )}
        </div>
    </section>
);