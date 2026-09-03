import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFolder, getRoot } from "../services/drive";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FileExplorer from "../components/FileExplorer.jsx";
import UploadDropzone from "../components/UploadDropzone.jsx";
import { useInvalidateDrive } from "../hooks/useInvalidateDrive";

export default function Drive() {
  const { folderId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["folder", folderId || "root"],
    queryFn: () => (folderId ? getFolder(folderId) : getRoot()),
  });

  const invalidate = useInvalidateDrive();

  if (isLoading) return <div className="p-8 text-sm text-gray-500">Loading…</div>;
  if (error)
    return (
      <div className="p-8 text-sm text-red-600">
        {error.response?.status === 403
          ? "You don't have access to this folder."
          : "Folder not found."}
      </div>
    );

  return (
    <UploadDropzone folderId={folderId || null} onUploaded={invalidate}>
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-4">
          <Breadcrumbs breadcrumbs={data.breadcrumbs} />
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          <FileExplorer
            folders={data.folders}
            files={data.files}
            currentFolderId={folderId || null}
            onChanged={invalidate}
          />
        </div>
      </div>
    </UploadDropzone>
  );
}
