import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFile, getFolder, getSharedWithMe, downloadFile } from "../services/drive";
import { iconFor } from "../utils/format";

export default function Shared() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      const shares = await getSharedWithMe();
      const resolved = await Promise.all(
        shares.map(async (s) => {
          try {
            const resource =
              s.resource_type === "file" ? await getFile(s.resource_id) : await getFolder(s.resource_id);
            const name = s.resource_type === "file" ? resource.name : resource.folder?.name;
            return { ...s, name, resource };
          } catch {
            return { ...s, name: "(no longer available)", resource: null };
          }
        })
      );
      setItems(resolved);
    })();
  }, []);

  if (items === null) return <div className="p-8 text-sm text-gray-500">Loading…</div>;

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">👥 Shared with me</h1>
      {items.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-400">
          <p className="text-4xl">👥</p>
          <p className="mt-2 text-sm">Nothing has been shared with you yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                if (!s.resource) return;
                if (s.resource_type === "folder") navigate(`/folder/${s.resource_id}`);
                else downloadFile(s.resource);
              }}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-sm"
            >
              <div className="mb-2 text-3xl">
                {s.resource_type === "folder" ? "📁" : iconFor(s.resource?.mime_type)}
              </div>
              <p className="truncate text-sm font-medium text-gray-800">{s.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                Shared by {s.shared_with_email ? s.shared_with_email : "owner"} · {s.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
