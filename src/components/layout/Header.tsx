import { GitHubIcon } from "../ui/Icons";

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => (
    <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <GitHubIcon />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AutoCommit</h1>
        </div>
        <button onClick={toggleDarkMode} className="text-2xl p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {darkMode ? '☀️' : '🌙'}
        </button>
    </header>
);