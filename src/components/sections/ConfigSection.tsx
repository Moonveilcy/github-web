interface ConfigSectionProps {
    token: string;
    setToken: (token: string) => void;
    storeToken: boolean;
    setStoreToken: (store: boolean) => void;
    repo: string;
    setRepo: (repo: string) => void;
    branch: string;
    setBranch: (branch: string) => void;
}

export const ConfigSection = ({ token, setToken, storeToken, setStoreToken, repo, setRepo, branch, setBranch }: ConfigSectionProps) => {
    
    const handleRepoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        try {
            if (value.startsWith('http')) {
                const url = new URL(value);
                const pathParts = url.pathname.split('/').filter(part => part);
                if (pathParts.length >= 2) {
                    value = `${pathParts[0]}/${pathParts[1]}`;
                }
            }
        } catch (error) {}
        setRepo(value);
    };

    return (
        <section className="bg-white dark:bg-gray-800/80 p-6 rounded-lg border-2 border-purple-400 shadow-[4px_4px_0px_#A78BFA] transition-shadow hover:shadow-[6px_6px_0px_#A78BFA]">
            <h2 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">GitHub Configuration</h2>
            <div className="space-y-4">
                <input
                    type="password"
                    placeholder="GitHub Personal Access Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full p-2 border rounded-md bg-slate-50 dark:bg-gray-700 border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="text"
                    placeholder="Repository (e.g., username/repo-name)"
                    value={repo}
                    onChange={handleRepoChange}
                    className="w-full p-2 border rounded-md bg-slate-50 dark:bg-gray-700 border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="text"
                    placeholder="Branch (e.g., main)"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2 border rounded-md bg-slate-50 dark:bg-gray-700 border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center gap-2 text-sm pt-2">
                    <input type="checkbox" id="storeToken" checked={storeToken} onChange={(e) => setStoreToken(e.target.checked)} className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"/>
                    <label htmlFor="storeToken">Store token in localStorage</label>
                </div>
            </div>
        </section>
    );
}