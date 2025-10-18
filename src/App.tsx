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
  const github = useGitHub();

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {github.notification && (
            <Toast 
              message={github.notification.message} 
              type={github.notification.type} 
              onDismiss={() => github.setNotification(null)} 
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-8">
              <ConfigSection
                token={github.token} setToken={github.setToken}
                storeToken={github.storeToken} setStoreToken={github.setStoreToken}
                repo={github.repo} setRepo={github.setRepo}
                branch={github.branch} setBranch={github.setBranch}
              />
              <FileUploadSection 
                files={github.files} 
                processFiles={github.processFiles} 
                removeFile={github.removeFile}
              />
            </div>
            <div className="space-y-8 mt-8 lg:mt-0">
               <ActionsSection 
                isLoading={github.isLoading}
                files={github.files}
                onCommitAndPush={github.handleCommitAndPush}
                onFetchCommits={github.handleFetchCommits}
              />
              <CommitLogSection commits={github.commits} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;