import { useQuery } from "@tanstack/react-query";
import { getStarred } from "../services/drive";
import FileExplorer from "../components/FileExplorer.jsx";
import { useInvalidateDrive } from "../hooks/useInvalidateDrive";

export default function Starred() {
  const { data, isLoading } = useQuery({ queryKey: ["starred"], queryFn: getStarred });
  const invalidate = useInvalidateDrive();

  if (isLoading) return <div className="p-8 text-sm text-gray-500">Loading…</div>;

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">⭐ Starred</h1>
      <FileExplorer folders={[]} files={data} onChanged={invalidate} />
    </div>
  );
}
