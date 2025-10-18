interface ConfigSectionProps {
    token: string;
    setToken: (token: string) => void;
    storeToken: boolean;
    setStoreToken: (store: boolean) => void;
    repo: string;
    setRepo: (repo: string) => void;
    branch: string;
    setBranch: (branch: string) => void;
    geminiKey: string;
    setGeminiKey: (key: string) => void;
}

export const ConfigSection = ({ token, setToken, storeToken, setStoreToken, repo, setRepo, branch, setBranch, geminiKey, setGeminiKey }: ConfigSectionProps) => {
    
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
        <section className="bg-yellow-100 text-slate-900 p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Configuration</h2>
            <div className="space-y-4">
                <input
                    type="password"
                    placeholder="GitHub Personal Access Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                    type="password"
                    placeholder="Gemini API Key"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                    type="text"
                    placeholder="Repository (e.g., username/repo-name)"
                    value={repo}
                    onChange={handleRepoChange}
                    className="w-full p-2 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                    type="text"
                    placeholder="Branch (e.g., main)"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex items-center gap-2 text-sm pt-2">
                    <input type="checkbox" id="storeToken" checked={storeToken} onChange={(e) => setStoreToken(e.target.checked)} className="h-4 w-4 rounded border-2 border-black text-yellow-600 focus:ring-yellow-500"/>
                    <label htmlFor="storeToken" className="font-medium">Store token in localStorage</label>
                </div>
            </div>
        </section>
    );
}