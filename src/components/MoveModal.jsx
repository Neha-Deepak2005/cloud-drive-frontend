import { useEffect, useState } from "react";
import { getFolder, getRoot } from "../services/drive";

export default function MoveModal({ onSubmit, onClose }) {
  const [stack, setStack] = useState([{ id: null, name: "My Drive" }]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const current = stack[stack.length - 1];

  useEffect(() => {
    setLoading(true);
    const req = current.id ? getFolder(current.id) : getRoot();
    req.then((data) => {
      setFolders(data.folders);
      setLoading(false);
    });
  }, [current.id]);

  const enter = (folder) => setStack((s) => [...s, { id: folder.id, name: folder.name }]);
  const goTo = (index) => setStack((s) => s.slice(0, index + 1));

  const choose = async () => {
    setBusy(true);
    try {
      await onSubmit(current.id);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="flex w-full max-w-sm flex-col rounded-lg bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-100 p-4">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Move to</h2>
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
            {stack.map((s, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                <button onClick={() => goTo(i)} className="hover:underline">
                  {s.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="max-h-64 min-h-[8rem] overflow-y-auto p-2">
          {loading ? (
            <p className="p-3 text-sm text-gray-400">Loading…</p>
          ) : folders.length === 0 ? (
            <p className="p-3 text-sm text-gray-400">No subfolders</p>
          ) : (
            folders.map((f) => (
              <button
                key={f.id}
                onClick={() => enter(f)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                📁 {f.name}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 p-4">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={choose}
            disabled={busy}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            Move here
          </button>
        </div>
      </div>
    </div>
  );
}
