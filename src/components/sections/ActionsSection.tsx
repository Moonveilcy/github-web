interface ActionsSectionProps {
    isLoading: boolean;
    files: { status: string }[];
    onCommitAndPush: () => void;
    onFetchCommits: () => void;
}

export const ActionsSection = ({ isLoading, files, onCommitAndPush, onFetchCommits }: ActionsSectionProps) => (
    <section className="flex flex-wrap gap-4 mb-8">
        <button
            onClick={onCommitAndPush}
            disabled={isLoading || files.filter(f => f.status === 'idle').length === 0}
            className="flex-grow bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? 'Processing...' : `Commit & Push ${files.filter(f => f.status === 'idle').length} File(s)`}
        </button>
        <button
            onClick={onFetchCommits}
            disabled={isLoading}
            className="flex-grow bg-gray-200 dark:bg-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            Fetch Commits
        </button>
    </section>
);