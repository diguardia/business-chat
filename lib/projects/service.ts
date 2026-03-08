import { prisma } from "@/lib/db/prisma";
import { createDriveFolder } from "@/lib/google/drive";

const defaultFolders = [
  "01 - Estrategia",
  "02 - Producto",
  "03 - Tecnología",
  "04 - Comercial",
  "05 - Operación"
];

export async function createProject(name: string, description?: string) {
  const rootParent = process.env.GOOGLE_DRIVE_SHARED_ROOT_ID;
  let rootFolderId: string | undefined;

  try {
    const folder = await createDriveFolder(name, rootParent);
    rootFolderId = folder.id ?? undefined;
    if (rootFolderId) {
      await Promise.all(defaultFolders.map((folderName) => createDriveFolder(folderName, rootFolderId)));
    }
  } catch {
    rootFolderId = undefined;
  }

  return prisma.project.create({
    data: {
      name,
      description,
      driveRootFolderId: rootFolderId
    }
  });
}

export async function listProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProjectDetail(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const [documents, messages, logs] = await Promise.all([
    prisma.document.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    prisma.chatMessage.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } }),
    prisma.actionLog.findMany({ where: { projectId }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  return { project, documents, messages, logs };
}

export async function listProjectDocuments(projectId: string) {
  return prisma.document.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
}

export async function createDocumentRecord(data: {
  projectId: string;
  title: string;
  driveFileId: string;
  docType?: string;
  folderName?: string;
  contentCache?: string;
}) {
  return prisma.document.create({ data });
}

export async function findDocumentById(docId: string) {
  return prisma.document.findUnique({ where: { id: docId } });
}

export async function updateDocumentCache(docId: string, contentCache: string) {
  return prisma.document.update({ where: { id: docId }, data: { contentCache } });
}

export async function saveMessage(projectId: string, role: string, content: string) {
  return prisma.chatMessage.create({ data: { projectId, role, content } });
}

export async function saveActionLog(data: {
  projectId: string;
  actionType: string;
  targetType?: string;
  targetId?: string;
  summary: string;
  confirmed: boolean;
}) {
  return prisma.actionLog.create({ data });
}
