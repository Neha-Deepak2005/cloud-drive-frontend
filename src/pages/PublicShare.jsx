import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resolvePublicLink } from "../services/drive";
import api from "../services/api";
import { formatBytes, iconFor } from "../utils/format";

export default function PublicShare() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (pwd) => {
    setError("");
    try {
      const result = await resolvePublicLink(token, pwd);
      setData(result);
      setNeedsPassword(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setNeedsPassword(true);
      } else if (err.response?.status === 410) {
        setError("This link has expired.");
      } else {
        setError("This link is invalid or no longer available.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const download = async () => {
    const url = data.download_url.startsWith("http")
      ? data.download_url
      : `${api.defaults.baseURL}${data.download_url}`;
    window.location.href = url;
  };

  const submitPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    load(password);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-gray-500">Loading…</div>;

  if (needsPassword) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
        <form onSubmit={submitPassword} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-lg font-semibold text-gray-900">🔒 Password required</h1>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button className="mt-4 w-full rounded-md bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Shared with you via CloudDrive</h1>

      {data.resource_type === "file" ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{iconFor(data.file.mime_type)}</span>
            <div>
              <p className="font-medium text-gray-900">{data.file.name}</p>
              <p className="text-xs text-gray-400">{formatBytes(data.file.size_bytes)}</p>
            </div>
          </div>
          <button
            onClick={download}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Download
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="mb-4 font-medium text-gray-900">📁 {data.folder.name}</p>
          <div className="space-y-1">
            {data.folders.map((f) => (
              <div key={f.id} className="flex items-center gap-2 py-1 text-sm text-gray-600">
                📁 {f.name}
              </div>
            ))}
            {data.files.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-1 text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  {iconFor(f.mime_type)} {f.name}
                </span>
                <span className="text-xs text-gray-400">{formatBytes(f.size_bytes)}</span>
              </div>
            ))}
            {data.folders.length === 0 && data.files.length === 0 && (
              <p className="text-sm text-gray-400">This folder is empty.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
