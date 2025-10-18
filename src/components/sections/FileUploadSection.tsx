import { RepoFile } from "../../types";

interface FileUploadSectionProps {
    files: RepoFile[];
    // @ts-ignore
    processFiles: (handles: FileSystemFileHandle[]) => void;
    removeFile: (index: number) => void;
}

export const FileUploadSection = ({ files, processFiles, removeFile }: FileUploadSectionProps) => {
    const handleFolderSelect = async () => {
        try {
            // @ts-ignore
            const dirHandle = await window.showDirectoryPicker();
            const fileHandles = [];
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    fileHandles.push(entry);
                }
            }
            processFiles(fileHandles);
        } catch (err) {
            console.error("Folder selection was cancelled or failed.", err);
        }
    };

    return (
        <section className="bg-blue-100 text-slate-900 p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Files to Commit</h2>
            <div className="border-2 border-dashed border-black rounded-lg p-8 text-center">
                <p className="text-slate-600">Select your project folder to upload files.</p>
                <button
                    onClick={handleFolderSelect}
                    className="mt-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md border-2 border-black"
                >
                    Pilih Folder
                </button>
            </div>
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-md">
                    <span className="truncate font-mono text-sm" title={file.path}>{file.path}</span>
                    <div className="flex items-center gap-2">
                    {file.status === 'committing' && <span className="text-xs text-blue-500">...</span>}
                    {file.status === 'committed' && <span className="text-xs text-green-500 font-bold">✓</span>}
                    {file.status === 'error' && <span className="text-xs text-red-500 font-bold">✗</span>}
                    <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-xl font-bold">
                        &times;
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
};