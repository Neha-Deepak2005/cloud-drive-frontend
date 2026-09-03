import axios from "axios";
import api from "./api";

// ---- Folders ----
export const getRoot = () => api.get("/folders/root").then((r) => r.data);
export const getFolder = (id) => api.get(`/folders/${id}`).then((r) => r.data);
export const createFolder = (name, parentId) =>
  api.post("/folders", { name, parent_id: parentId }).then((r) => r.data);
export const renameFolder = (id, name) =>
  api.patch(`/folders/${id}`, { name }).then((r) => r.data);
export const moveFolder = (id, parentId) =>
  api.patch(`/folders/${id}`, { parent_id: parentId }).then((r) => r.data);
export const trashFolder = (id) => api.delete(`/folders/${id}`);
export const restoreFolder = (id) => api.post(`/folders/${id}/restore`).then((r) => r.data);

// ---- Files ----
export async function uploadFile({ file, folderId, onProgress, existingFileId }) {
  const initRes = await api.post("/files/init-upload", {
    name: file.name,
    folder_id: folderId || null,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
  });
  const init = initRes.data;

  if (init.method === "direct") {
    const form = new FormData();
    form.append("file", file);
    await api.post(init.upload_url, form, {
      params: { storage_key: init.storage_key },
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    });
  } else {
    // Signed URL flow (Supabase/S3): PUT bytes directly to storage, bypassing our API.
    await axios.put(init.upload_url, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    });
  }

  const completeRes = await api.post("/files/complete-upload", {
    upload_id: init.upload_id,
    storage_key: init.storage_key,
    name: file.name,
    folder_id: folderId || null,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
    file_id: existingFileId || null,
  });
  return completeRes.data;
}

export const getFile = (id) => api.get(`/files/${id}`).then((r) => r.data);
export const renameFile = (id, name) => api.patch(`/files/${id}`, { name }).then((r) => r.data);
export const moveFile = (id, folderId) =>
  api.patch(`/files/${id}`, { folder_id: folderId }).then((r) => r.data);
export const trashFile = (id) => api.delete(`/files/${id}`);
export const restoreFile = (id) => api.post(`/files/${id}/restore`).then((r) => r.data);
export const starFile = (id) => api.post(`/files/${id}/star`).then((r) => r.data);
export const unstarFile = (id) => api.delete(`/files/${id}/star`).then((r) => r.data);

export async function downloadFile(file) {
  const { data } = await api.get(`/files/${file.id}/download`);
  let blob;
  if (data.url.startsWith("http")) {
    // Absolute, pre-signed URL (Supabase/S3 driver) - fetch directly, no auth header.
    blob = (await axios.get(data.url, { responseType: "blob" })).data;
  } else {
    // Relative URL served by our own authenticated API (local driver).
    blob = (await api.get(data.url, { responseType: "blob" })).data;
  }
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

// ---- Search ----
export const search = (q, type = "all") =>
  api.get("/search", { params: { q, type } }).then((r) => r.data);

// ---- Trash ----
export const getTrash = () => api.get("/trash").then((r) => r.data);
export const permanentlyDeleteFile = (id) => api.delete(`/trash/file/${id}`);
export const permanentlyDeleteFolder = (id) => api.delete(`/trash/folder/${id}`);
export const emptyTrash = () => api.post("/trash/empty");

// ---- Starred ----
export const getStarred = () => api.get("/starred").then((r) => r.data);

// ---- Sharing ----
export const createShare = (resourceType, resourceId, email, role) =>
  api
    .post("/shares", { resource_type: resourceType, resource_id: resourceId, email, role })
    .then((r) => r.data);
export const listShares = (resourceType, resourceId) =>
  api
    .get("/shares", { params: { resource_type: resourceType, resource_id: resourceId } })
    .then((r) => r.data);
export const deleteShare = (id) => api.delete(`/shares/${id}`);
export const getSharedWithMe = () => api.get("/shared-with-me").then((r) => r.data);

export const createPublicLink = (resourceType, resourceId, role, expiresInHours, password) =>
  api
    .post("/public-link", {
      resource_type: resourceType,
      resource_id: resourceId,
      role,
      expires_in_hours: expiresInHours || null,
      password: password || null,
    })
    .then((r) => r.data);
export const listPublicLinks = (resourceType, resourceId) =>
  api
    .get("/public-link", { params: { resource_type: resourceType, resource_id: resourceId } })
    .then((r) => r.data);
export const deletePublicLink = (id) => api.delete(`/public-link/${id}`);
export const resolvePublicLink = (token, password) =>
  api.get(`/public/${token}`, { params: password ? { password } : {} }).then((r) => r.data);
