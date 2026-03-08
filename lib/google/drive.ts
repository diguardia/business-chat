import { google } from "googleapis";
import { getGoogleClient } from "@/lib/google/auth";

function drive() {
  return google.drive({ version: "v3", auth: getGoogleClient() });
}

export async function createDriveFolder(name: string, parentFolderId?: string) {
  const response = await drive().files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : undefined
    },
    fields: "id,name,parents"
  });
  return response.data;
}

export async function listFolderContent(folderId: string) {
  const response = await drive().files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id,name,mimeType,parents,modifiedTime)",
    pageSize: 100
  });
  return response.data.files ?? [];
}

export async function moveDriveFile(fileId: string, destinationFolderId: string) {
  const file = await drive().files.get({ fileId, fields: "parents" });
  const previousParents = (file.data.parents ?? []).join(",");

  await drive().files.update({
    fileId,
    addParents: destinationFolderId,
    removeParents: previousParents,
    fields: "id,parents"
  });
}

export async function getDriveMetadata(fileId: string) {
  const response = await drive().files.get({
    fileId,
    fields: "id,name,mimeType,parents,createdTime,modifiedTime"
  });
  return response.data;
}
