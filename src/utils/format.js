export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function iconFor(mimeType = "") {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎞️";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType === "application/pdf") return "📕";
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "🗜️";
  if (mimeType.startsWith("text/")) return "📄";
  return "📄";
}

// Tailwind classes for a colored badge behind a file/folder icon, keyed by type.
export function iconColorFor(mimeType = "") {
  if (mimeType.startsWith("image/")) return "bg-pink-100 text-pink-600";
  if (mimeType.startsWith("video/")) return "bg-purple-100 text-purple-600";
  if (mimeType.startsWith("audio/")) return "bg-teal-100 text-teal-600";
  if (mimeType === "application/pdf") return "bg-red-100 text-red-600";
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "bg-orange-100 text-orange-600";
  if (mimeType.startsWith("text/")) return "bg-sky-100 text-sky-600";
  return "bg-blue-100 text-blue-600";
}

export const FOLDER_ICON_COLOR = "bg-amber-100 text-amber-600";
