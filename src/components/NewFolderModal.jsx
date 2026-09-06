import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFolder } from "../services/drive";

export default function NewFolderModal({ parentId, onClose }) {
  const [name, setName] = useState("Untitled folder");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      await createFolder(name.trim(), parentId);
      queryClient.invalidateQueries({ queryKey: ["folder", parentId || "root"] });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create folder");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-base font-semibold text-gray-900">New folder</h2>
        <form onSubmit={submit}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-white hover:shadow-md disabled:opacity-60"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
