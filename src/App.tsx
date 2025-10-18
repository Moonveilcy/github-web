import { useTheme } from './hooks/useTheme';
import { useGitHub } from './hooks/useGitHub';

import { Header } from './components/layout/Header';
import { Toast } from './components/ui/Toast';
import { ConfigSection } from './components/sections/ConfigSection';
import { FileUploadSection } from './components/sections/FileUploadSection';
import { ActionsSection } from './components/sections/ActionsSection';
import { CommitLogSection } from './components/sections/CommitLogSection';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    token, setToken,
    repo, setRepo,
    branch, setBranch,
    files,
    commits,
    isLoading,
    notification, setNotification,
    storeToken, setStoreToken,
    processFiles,
    removeFile,
    handleCommitAndPush,
    handleFetchCommits,
  } = useGitHub();

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {notification && (
            <Toast 
              message={notification.message} 
              type={notification.type} 
              onDismiss={() => setNotification(null)} 
            />
          )}

          <ConfigSection 
            token={token} setToken={setToken}
            storeToken={storeToken} setStoreToken={setStoreToken}
            repo={repo} setRepo={setRepo}
            branch={branch} setBranch={setBranch}
          />
          
          <FileUploadSection 
            files={files} 
            processFiles={processFiles} 
            removeFile={removeFile}
          />

          <ActionsSection 
            isLoading={isLoading}
            files={files}
            onCommitAndPush={handleCommitAndPush}
            onFetchCommits={handleFetchCommits}
          />

          <CommitLogSection commits={commits} />
        </main>
      </div>
    </div>
  );
}

export default App;