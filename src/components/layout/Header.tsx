import { GitHubIcon } from "../ui/Icons";

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => (
    <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <GitHubIcon />
            <h1 className="text-xl font-bold tracking-tight">AutoCommit</h1>
        </div>
        <button onClick={toggleDarkMode} className="text-xl p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700">
            {darkMode ? '☀️' : '🌙'}
        </button>
    </header>
);