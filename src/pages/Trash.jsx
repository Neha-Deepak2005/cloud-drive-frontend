import { useQuery } from "@tanstack/react-query";
import {
  emptyTrash,
  getTrash,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  restoreFile,
  restoreFolder,
} from "../services/drive";
import { formatBytes, iconFor } from "../utils/format";
import { useInvalidateDrive } from "../hooks/useInvalidateDrive";

export default function Trash() {
  const { data, isLoading } = useQuery({ queryKey: ["trash"], queryFn: getTrash });
  const refresh = useInvalidateDrive();

  const doEmpty = async () => {
    if (!confirm("Permanently delete everything in Trash? This cannot be undone.")) return;
    await emptyTrash();
    refresh();
  };

  if (isLoading) return <div className="p-8 text-sm text-gray-500">Loading…</div>;

  const isEmpty = data.folders.length === 0 && data.files.length === 0;

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">🗑️ Trash</h1>
        {!isEmpty && (
          <button
            onClick={doEmpty}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Empty trash
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-400">
          <p className="text-4xl">🗑️</p>
          <p className="mt-2 text-sm">Trash is empty</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-400">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Size</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.folders.map((f) => (
              <tr key={f.id} className="border-b border-gray-100">
                <td className="flex items-center gap-2 py-2.5">📁 {f.name}</td>
                <td className="py-2.5 text-gray-400">—</td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={async () => {
                      await restoreFolder(f.id);
                      refresh();
                    }}
                    className="mr-3 text-xs font-medium text-brand-600 hover:underline"
                  >
                    Restore
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Permanently delete "${f.name}" and everything inside it?`)) return;
                      await permanentlyDeleteFolder(f.id);
                      refresh();
                    }}
                    className="text-xs font-medium text-red-500 hover:underline"
                  >
                    Delete forever
                  </button>
                </td>
              </tr>
            ))}
            {data.files.map((f) => (
              <tr key={f.id} className="border-b border-gray-100">
                <td className="flex items-center gap-2 py-2.5">
                  {iconFor(f.mime_type)} {f.name}
                </td>
                <td className="py-2.5 text-gray-400">{formatBytes(f.size_bytes)}</td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={async () => {
                      await restoreFile(f.id);
                      refresh();
                    }}
                    className="mr-3 text-xs font-medium text-brand-600 hover:underline"
                  >
                    Restore
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Permanently delete "${f.name}"?`)) return;
                      await permanentlyDeleteFile(f.id);
                      refresh();
                    }}
                    className="text-xs font-medium text-red-500 hover:underline"
                  >
                    Delete forever
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
