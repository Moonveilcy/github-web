import { useGitHub } from './hooks/useGitHub';
import { Header } from './components/layout/Header';
import { Toast } from './components/ui/Toast';
import { ConfigSection } from './components/sections/ConfigSection';
import { FileUploadSection } from './components/sections/FileUploadSection';
import { ActionsSection } from './components/sections/ActionsSection';
import { CommitLogSection } from './components/sections/CommitLogSection';

function App() {
  const github = useGitHub();

  return (
    <div className="min-h-screen font-sans bg-white text-slate-800">
      <Header />
      
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {github.notification && ( /* ... */ )}

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-8">
            <ConfigSection
              token={github.token} setToken={github.setToken}
              storeToken={github.storeToken} setStoreToken={github.setStoreToken}
              repo={github.repo} setRepo={github.setRepo}
              branch={github.branch} setBranch={github.setBranch}
              geminiKey={github.geminiKey} setGeminiKey={github.setGeminiKey}
            />
            <FileUploadSection 
              files={github.files} 
              processFiles={github.processFiles} 
              removeFile={github.removeFile}
              updateFilePath={github.updateFilePath} 
              updateFileCommitDetails={github.updateFileCommitDetails}
              onGenerateMessage={github.handleGenerateCommitMessage}
            />
          </div>
          <div className="space-y-8 mt-8 lg:mt-0">
             <ActionsSection 
              isLoading={github.isLoading}
              isScanning={github.isScanning}
              files={github.files}
              repoFilled={!!github.token && !!github.repo}
              onCommitAndPush={github.handleCommitAndPush}
              onFetchCommits={github.handleFetchCommits}
              onScanRepo={github.handleScanRepo}
            />
            <CommitLogSection commits={github.commits} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;