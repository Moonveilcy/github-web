import { Commit } from '../../types';

interface CommitLogSectionProps {
    commits: Commit[];
}

export const CommitLogSection = ({ commits }: CommitLogSectionProps) => (
    <section className="bg-pink-100 text-slate-900 p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]">
        <h2 className="text-lg font-bold mb-4 text-slate-800">Latest Commits</h2>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {commits.length > 0 ? (
            commits.map(c => (
            <div key={c.sha} className="p-3 bg-white/50 rounded-md text-sm">
                <p className="font-mono truncate font-medium">{c.commit.message}</p>
                <p className="text-xs text-slate-500">by {c.commit.author.name} on {new Date(c.commit.author.date).toLocaleDateString()}</p>
            </div>
            ))
        ) : (
            <p className="text-slate-500 text-center py-8">No commits fetched yet.</p>
        )}
        </div>
    </section>
);