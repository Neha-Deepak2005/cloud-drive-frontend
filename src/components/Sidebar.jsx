import { NavLink } from "react-router-dom";
import { useState } from "react";
import NewFolderModal from "./NewFolderModal.jsx";

const NAV_COLORS = {
  drive: "bg-violet-100 text-violet-700",
  shared: "bg-sky-100 text-sky-700",
  starred: "bg-amber-100 text-amber-700",
  trash: "bg-rose-100 text-rose-700",
};

const linkClass = (key) =>
  ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? NAV_COLORS[key] : "text-gray-600 hover:bg-gray-100"
    }`;

export default function Sidebar() {
  const [showNewFolder, setShowNewFolder] = useState(false);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M6 18a4 4 0 010-8 5 5 0 019.58-1.5A4.5 4.5 0 0118 18H6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold bg-brand-gradient bg-clip-text text-transparent">
          CloudDrive
        </span>
      </div>

      <button
        onClick={() => setShowNewFolder(true)}
        className="mb-6 flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
      >
        <span className="text-lg leading-none">+</span> New folder
      </button>

      <nav className="space-y-1">
        <NavLink to="/" end className={linkClass("drive")}>
          📁 My Drive
        </NavLink>
        <NavLink to="/shared" className={linkClass("shared")}>
          👥 Shared with me
        </NavLink>
        <NavLink to="/starred" className={linkClass("starred")}>
          ⭐ Starred
        </NavLink>
        <NavLink to="/trash" className={linkClass("trash")}>
          🗑️ Trash
        </NavLink>
      </nav>

      {showNewFolder && (
        <NewFolderModal parentId={null} onClose={() => setShowNewFolder(false)} />
      )}
    </aside>
  );
}
