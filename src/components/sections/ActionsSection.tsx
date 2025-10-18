interface ActionsSectionProps {
    isLoading: boolean;
    files: { status: string }[];
    onCommitAndPush: () => void;
    onFetchCommits: () => void;
}

export const ActionsSection = ({ isLoading, files, onCommitAndPush, onFetchCommits }: ActionsSectionProps) => (
    <section className="space-y-4">
        <button
            onClick={onCommitAndPush}
            disabled={isLoading || files.filter(f => f.status === 'idle').length === 0}
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md border-b-4 border-green-700 hover:bg-green-600 active:border-b-2 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed transition-all"
        >
            {isLoading ? 'Processing...' : `Commit & Push ${files.filter(f => f.status === 'idle').length} File(s)`}
        </button>
        <button
            onClick={onFetchCommits}
            disabled={isLoading}
            className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-md border-b-4 border-slate-800 hover:bg-slate-700 active:border-b-2 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed transition-all"
        >
            Fetch Commits
        </button>
    </section>
);