import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  downloadFile,
  moveFile,
  moveFolder,
  renameFile,
  renameFolder,
  starFile,
  trashFile,
  trashFolder,
  unstarFile,
} from "../services/drive";
import { formatBytes, formatDate, iconFor } from "../utils/format";
import ItemMenu from "./ItemMenu.jsx";
import RenameModal from "./RenameModal.jsx";
import MoveModal from "./MoveModal.jsx";
import ShareModal from "./ShareModal.jsx";

const SORTS = {
  name: (a, b) => a.name.localeCompare(b.name),
  date: (a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at),
  size: (a, b) => (b.size_bytes || 0) - (a.size_bytes || 0),
};

export default function FileExplorer({ folders, files, currentFolderId, onChanged, readOnly = false }) {
  const navigate = useNavigate();
  const [view, setView] = useState("grid"); // grid | list
  const [sortKey, setSortKey] = useState("name");
  const [renameTarget, setRenameTarget] = useState(null); // {type, id, name}
  const [moveTarget, setMoveTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  const sortedFolders = useMemo(() => [...folders].sort(SORTS[sortKey] || SORTS.name), [folders, sortKey]);
  const sortedFiles = useMemo(() => [...files].sort(SORTS[sortKey]), [files, sortKey]);

  const doTrashFolder = async (id) => {
    await trashFolder(id);
    onChanged();
  };
  const doTrashFile = async (id) => {
    await trashFile(id);
    onChanged();
  };
  const toggleStar = async (file) => {
    if (file.is_starred) await unstarFile(file.id);
    else await starFile(file.id);
    onChanged();
  };

  const folderActions = (f) =>
    readOnly
      ? []
      : [
          { icon: "✏️", label: "Rename", onClick: () => setRenameTarget({ type: "folder", id: f.id, name: f.name }) },
          { icon: "📂", label: "Move", onClick: () => setMoveTarget({ type: "folder", id: f.id }) },
          { icon: "🔗", label: "Share", onClick: () => setShareTarget({ type: "folder", id: f.id, name: f.name }) },
          { divider: true },
          { icon: "🗑️", label: "Delete", danger: true, onClick: () => doTrashFolder(f.id) },
        ];

  const fileActions = (f) =>
    readOnly
      ? [{ icon: "⬇️", label: "Download", onClick: () => downloadFile(f) }]
      : [
          { icon: "⬇️", label: "Download", onClick: () => downloadFile(f) },
          { icon: f.is_starred ? "★" : "☆", label: f.is_starred ? "Unstar" : "Star", onClick: () => toggleStar(f) },
          { icon: "✏️", label: "Rename", onClick: () => setRenameTarget({ type: "file", id: f.id, name: f.name }) },
          { icon: "📂", label: "Move", onClick: () => setMoveTarget({ type: "file", id: f.id }) },
          { icon: "🔗", label: "Share", onClick: () => setShareTarget({ type: "file", id: f.id, name: f.name }) },
          { divider: true },
          { icon: "🗑️", label: "Delete", danger: true, onClick: () => doTrashFile(f.id) },
        ];

  const isEmpty = sortedFolders.length === 0 && sortedFiles.length === 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Sort by</span>
          {["name", "date", "size"].map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={`rounded px-2 py-1 capitalize ${
                sortKey === k ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded p-1.5 ${view === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            title="Grid view"
          >
            ▦
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded p-1.5 ${view === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {isEmpty && (
        <div className="flex h-64 flex-col items-center justify-center text-gray-400">
          <p className="text-4xl">📭</p>
          <p className="mt-2 text-sm">This folder is empty</p>
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sortedFolders.map((f) => (
            <div
              key={f.id}
              onClick={() => navigate(`/folder/${f.id}`)}
              className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-sm"
            >
              <div className="mb-2 text-3xl">📁</div>
              <p className="truncate text-sm font-medium text-gray-800">{f.name}</p>
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
                <ItemMenu actions={folderActions(f)} />
              </div>
            </div>
          ))}
          {sortedFiles.map((f) => (
            <div
              key={f.id}
              onClick={() => downloadFile(f)}
              className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-sm"
            >
              <div className="mb-2 text-3xl">{iconFor(f.mime_type)}</div>
              <p className="truncate text-sm font-medium text-gray-800">{f.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">{formatBytes(f.size_bytes)}</p>
              {f.is_starred && <span className="absolute left-2 top-2 text-yellow-500">★</span>}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
                <ItemMenu actions={fileActions(f)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-400">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Modified</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sortedFolders.map((f) => (
              <tr
                key={f.id}
                onClick={() => navigate(`/folder/${f.id}`)}
                className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="flex items-center gap-2 py-2.5">📁 {f.name}</td>
                <td className="py-2.5 text-gray-400">—</td>
                <td className="py-2.5 text-gray-400">{formatDate(f.updated_at)}</td>
                <td className="py-2.5 text-right">
                  <ItemMenu actions={folderActions(f)} />
                </td>
              </tr>
            ))}
            {sortedFiles.map((f) => (
              <tr
                key={f.id}
                onClick={() => downloadFile(f)}
                className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="flex items-center gap-2 py-2.5">
                  {iconFor(f.mime_type)} {f.name} {f.is_starred && <span className="text-yellow-500">★</span>}
                </td>
                <td className="py-2.5 text-gray-400">{formatBytes(f.size_bytes)}</td>
                <td className="py-2.5 text-gray-400">{formatDate(f.updated_at)}</td>
                <td className="py-2.5 text-right">
                  <ItemMenu actions={fileActions(f)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {renameTarget && (
        <RenameModal
          initialName={renameTarget.name}
          onClose={() => setRenameTarget(null)}
          onSubmit={async (name) => {
            if (renameTarget.type === "folder") await renameFolder(renameTarget.id, name);
            else await renameFile(renameTarget.id, name);
            onChanged();
          }}
        />
      )}

      {moveTarget && (
        <MoveModal
          onClose={() => setMoveTarget(null)}
          onSubmit={async (destinationId) => {
            if (moveTarget.type === "folder") await moveFolder(moveTarget.id, destinationId);
            else await moveFile(moveTarget.id, destinationId);
            onChanged();
          }}
        />
      )}

      {shareTarget && (
        <ShareModal
          resourceType={shareTarget.type}
          resourceId={shareTarget.id}
          name={shareTarget.name}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  );
}
