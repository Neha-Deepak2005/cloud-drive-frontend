import { NavLink } from "react-router-dom";
import { useState } from "react";
import NewFolderModal from "./NewFolderModal.jsx";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Sidebar() {
  const [showNewFolder, setShowNewFolder] = useState(false);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M6 18a4 4 0 010-8 5 5 0 019.58-1.5A4.5 4.5 0 0118 18H6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold text-gray-900">CloudDrive</span>
      </div>

      <button
        onClick={() => setShowNewFolder(true)}
        className="mb-6 flex items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        <span className="text-lg leading-none">+</span> New folder
      </button>

      <nav className="space-y-1">
        <NavLink to="/" end className={linkClass}>
          📁 My Drive
        </NavLink>
        <NavLink to="/shared" className={linkClass}>
          👥 Shared with me
        </NavLink>
        <NavLink to="/starred" className={linkClass}>
          ⭐ Starred
        </NavLink>
        <NavLink to="/trash" className={linkClass}>
          🗑️ Trash
        </NavLink>
      </nav>

      {showNewFolder && (
        <NewFolderModal parentId={null} onClose={() => setShowNewFolder(false)} />
      )}
    </aside>
  );
}
