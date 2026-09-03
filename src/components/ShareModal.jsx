import { useEffect, useState } from "react";
import {
  createPublicLink,
  createShare,
  deleteShare,
  listPublicLinks,
  listShares,
} from "../services/drive";

export default function ShareModal({ resourceType, resourceId, name, onClose }) {
  const [shares, setShares] = useState([]);
  const [links, setLinks] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [linkRole, setLinkRole] = useState("viewer");
  const [linkExpiry, setLinkExpiry] = useState("");
  const [linkPassword, setLinkPassword] = useState("");

  const load = async () => {
    const [s, l] = await Promise.all([
      listShares(resourceType, resourceId),
      listPublicLinks(resourceType, resourceId),
    ]);
    setShares(s);
    setLinks(l);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const share = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createShare(resourceType, resourceId, email, role);
      setEmail("");
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not share");
    } finally {
      setBusy(false);
    }
  };

  const removeShare = async (id) => {
    await deleteShare(id);
    await load();
  };

  const makeLink = async () => {
    setError("");
    try {
      await createPublicLink(
        resourceType,
        resourceId,
        linkRole,
        linkExpiry ? Number(linkExpiry) : null,
        linkPassword || null
      );
      setLinkPassword("");
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create link");
    }
  };

  const copyLink = (url) => {
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-base font-semibold text-gray-900">Share "{name}"</h2>
        <p className="mb-4 text-xs text-gray-500">
          Invite people or create a shareable link.
        </p>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={share} className="mb-4 flex gap-2">
          <input
            type="email"
            required
            placeholder="Add people by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            Share
          </button>
        </form>

        {shares.length > 0 && (
          <div className="mb-5 space-y-2">
            <p className="text-xs font-semibold text-gray-500">People with access</p>
            {shares.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-700">{s.shared_with_email}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {s.role}
                  </span>
                  <button
                    onClick={() => removeShare(s.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <p className="mb-2 text-xs font-semibold text-gray-500">Public link</p>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              value={linkRole}
              onChange={(e) => setLinkRole(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <input
              type="number"
              min="1"
              placeholder="Expires in (hrs)"
              value={linkExpiry}
              onChange={(e) => setLinkExpiry(e.target.value)}
              className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-xs"
            />
            <input
              type="text"
              placeholder="Password (optional)"
              value={linkPassword}
              onChange={(e) => setLinkPassword(e.target.value)}
              className="w-32 rounded-md border border-gray-300 px-2 py-1.5 text-xs"
            />
            <button
              onClick={makeLink}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Create link
            </button>
          </div>

          {links.map((l) => (
            <div key={l.id} className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate text-gray-600">{l.url}</span>
              <div className="flex items-center gap-2">
                {l.has_password && <span title="Password protected">🔒</span>}
                <button onClick={() => copyLink(l.url)} className="text-brand-600 hover:underline">
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
