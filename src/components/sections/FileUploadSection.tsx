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
        <section className="bg-white dark:bg-gray-800/80 p-6 rounded-lg border-2 border-blue-400 shadow-[4px_4px_0px_#60A5FA] transition-shadow hover:shadow-[6px_6px_0px_#60A5FA]">
            <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Files to Commit</h2>
            <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-8 text-center"
            >
                <p className="text-slate-500 dark:text-slate-400">Drag & drop files here, or</p>
                <label className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Pilih File
                    <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && processFiles(e.target.files)}
                        className="sr-only"
                    />
                </label>
            </div>
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-gray-700 rounded-md">
                    <span className="truncate font-mono text-sm">{file.name}</span>
                    <div className="flex items-center gap-2">
                    {file.status === 'committing' && <span className="text-xs text-blue-500">...</span>}
                    {file.status === 'committed' && <span className="text-xs text-green-500">✓</span>}
                    {file.status === 'error' && <span className="text-xs text-red-500">✗</span>}
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