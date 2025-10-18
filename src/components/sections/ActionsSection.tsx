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
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_#999] disabled:cursor-not-allowed transition-all"
        >
            {isLoading ? 'Processing...' : `Commit & Push ${files.filter(f => f.status === 'idle').length} File(s)`}
        </button>
        <button
            onClick={onFetchCommits}
            disabled={isLoading}
            className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_#999] disabled:cursor-not-allowed transition-all"
        >
            Fetch Commits
        </button>
    </section>
);