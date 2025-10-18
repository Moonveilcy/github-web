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

export const ConfigSection = ({ token, setToken, storeToken, setStoreToken, repo, setRepo, branch, setBranch }: ConfigSectionProps) => (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">GitHub Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
            type="password"
            placeholder="GitHub Personal Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" id="storeToken" checked={storeToken} onChange={(e) => setStoreToken(e.target.checked)} />
            <label htmlFor="storeToken">Store token in localStorage</label>
        </div>
        <input
            type="text"
            placeholder="Repository (e.g., username/repo-name)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <input
            type="text"
            placeholder="Branch (e.g., main)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-md text-xs">
        🛡️ <span className="font-bold">Security Note:</span> Your token is only used for direct API calls to GitHub. Use a token with minimum required permissions.
        </div>
    </section>
);