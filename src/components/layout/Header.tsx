import { GitHubIcon } from "../ui/Icons";

export const Header = () => (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <GitHubIcon />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AutoCommit</h1>
        </div>
    </header>
);