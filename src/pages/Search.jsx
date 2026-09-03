import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { search } from "../services/drive";
import FileExplorer from "../components/FileExplorer.jsx";
import { useInvalidateDrive } from "../hooks/useInvalidateDrive";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const invalidate = useInvalidateDrive();

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => search(q),
    enabled: !!q,
  });

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">
        Search results for "{q}"
      </h1>
      {isLoading ? (
        <p className="text-sm text-gray-500">Searching…</p>
      ) : (
        <FileExplorer
          folders={data?.folders || []}
          files={data?.files || []}
          onChanged={invalidate}
        />
      )}
    </div>
  );
}
