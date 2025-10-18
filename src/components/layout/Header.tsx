import { GitHubIcon } from "../ui/Icons";

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
        <GitHubIcon />
        <h1 className="text-xl font-bold">AutoCommit</h1>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        {darkMode ? '☀️' : '🌙'}
        </button>
    </header>
);