import { RepoFile } from "../../types";

interface FileUploadSectionProps {
    files: RepoFile[];
    processFiles: (fileList: FileList) => void;
    removeFile: (index: number) => void;
    updateFilePath: (index: number, newPath: string) => void;
}

export const FileUploadSection = ({ files, processFiles, removeFile, updateFilePath }: FileUploadSectionProps) => {
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        processFiles(e.dataTransfer.files);
    };

    return (
        <section className="bg-blue-100 text-slate-900 p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Files to Commit</h2>
            <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-black rounded-lg p-8 text-center"
            >
                <p className="text-slate-600">Drag & drop files here, or</p>
                <label className="mt-2 text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                    Pilih File
                    <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && processFiles(e.target.files)}
                        className="sr-only"
                    />
                </label>
            </div>
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                <div key={index} className="p-2 bg-white/50 rounded-md">
                    <div className="flex items-center justify-between">
                        <span className="truncate font-mono text-sm font-bold">{file.name}</span>
                        <div className="flex items-center gap-2">
                        {file.status === 'committing' && <span className="text-xs text-blue-500">...</span>}
                        {file.status === 'committed' && <span className="text-xs text-green-500 font-bold">✓</span>}
                        {file.status === 'error' && <span className="text-xs text-red-500 font-bold">✗</span>}
                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-xl font-bold">
                            &times;
                        </button>
                        </div>
                    </div>
                    <input 
                        type="text"
                        placeholder="path/to/your/file.js"
                        value={file.path}
                        onChange={(e) => updateFilePath(index, e.target.value)}
                        className="w-full mt-2 p-1 text-xs border-2 border-black rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                </div>
                ))}
            </div>
        </section>
    );
};