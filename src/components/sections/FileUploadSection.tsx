import { RepoFile } from "../../types";

interface FileUploadSectionProps {
    files: RepoFile[];
    processFiles: (fileList: FileList) => void;
    removeFile: (index: number) => void;
}

export const FileUploadSection = ({ files, processFiles, removeFile }: FileUploadSectionProps) => {
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        processFiles(e.dataTransfer.files);
    };

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">Files to Commit</h2>
            <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
            >
                <p>Drag & drop files here, or</p>
                <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && processFiles(e.target.files)}
                    className="mt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50"
                />
            </div>
            <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <span className="truncate font-mono text-sm">{file.name}</span>
                    <div className="flex items-center gap-2">
                    {file.status === 'committing' && <span className="text-xs text-blue-500">Committing...</span>}
                    {file.status === 'committed' && <span className="text-xs text-green-500">Committed ✓</span>}
                    {file.status === 'error' && <span className="text-xs text-red-500">Error ✗</span>}
                    <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 font-bold">
                        &times;
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
};