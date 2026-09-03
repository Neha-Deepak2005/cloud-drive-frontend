import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/drive";

export default function UploadDropzone({ folderId, onUploaded, children }) {
  const [uploads, setUploads] = useState([]); // [{id, name, progress, error}]

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setUploads((prev) => [...prev, { id, name: file.name, progress: 0, error: null }]);

        uploadFile({
          file,
          folderId,
          onProgress: (progress) =>
            setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u))),
        })
          .then(() => {
            setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, progress: 100 } : u)));
            onUploaded?.();
            setTimeout(() => setUploads((prev) => prev.filter((u) => u.id !== id)), 2000);
          })
          .catch((err) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === id
                  ? { ...u, error: err.response?.data?.detail || "Upload failed" }
                  : u
              )
            );
          });
      });
    },
    [folderId, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="relative h-full">
      <input {...getInputProps()} />

      {isDragActive && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center border-4 border-dashed border-brand-500 bg-brand-50/80">
          <p className="text-lg font-medium text-brand-700">Drop files to upload</p>
        </div>
      )}

      <button
        onClick={open}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-gray-200 hover:bg-gray-50"
      >
        ⬆️ Upload
      </button>

      {uploads.length > 0 && (
        <div className="absolute bottom-6 left-6 z-20 w-72 space-y-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="text-xs font-semibold text-gray-500">Uploading</p>
          {uploads.map((u) => (
            <div key={u.id} className="text-xs">
              <div className="mb-1 flex justify-between">
                <span className="truncate text-gray-700">{u.name}</span>
                <span className="text-gray-400">{u.error ? "Error" : `${u.progress}%`}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${u.error ? "bg-red-500" : "bg-brand-500"}`}
                  style={{ width: `${u.error ? 100 : u.progress}%` }}
                />
              </div>
              {u.error && <p className="mt-1 text-red-600">{u.error}</p>}
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
