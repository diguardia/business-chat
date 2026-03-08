import { Document } from "@prisma/client";
import { ActionExecutionResult, AssistantAction } from "@/types/actions";
import { createProject, listProjectDocuments, findDocumentById, updateDocumentCache, createDocumentRecord } from "@/lib/projects/service";
import { createDriveFolder, moveDriveFile } from "@/lib/google/drive";
import { appendSection, replaceSection } from "@/lib/documents/section-parser";
import { createGoogleDoc, overwriteGoogleDoc, readGoogleDoc } from "@/lib/google/docs";
import { getTemplate } from "@/lib/documents/templates";

export async function executeAction(action: AssistantAction): Promise<ActionExecutionResult> {
  switch (action.type) {
    case "create_project": {
      const project = await createProject(action.name, action.description ?? "");
      return { message: `Proyecto '${project.name}' creado.`, data: project };
    }
    case "create_folder": {
      const folder = await createDriveFolder(action.folderName, action.parentFolderId);
      return { message: `Carpeta '${folder.name}' creada.`, data: folder };
    }
    case "create_doc":
    case "generate_from_template": {
      const templateName = action.type === "generate_from_template" ? action.template : action.template;
      const doc = await createGoogleDoc(action.title);
      const content = templateName ? await getTemplate(templateName) : `# ${action.title}`;
      if (doc.documentId && content) {
        await overwriteGoogleDoc(doc.documentId, content);
      }
      const record = await createDocumentRecord({
        projectId: action.projectId,
        title: action.title,
        driveFileId: doc.documentId ?? "pending",
        docType: templateName ?? "general",
        folderName: action.type === "create_doc" ? action.folderName : undefined,
        contentCache: content
      });
      return { message: `Documento '${record.title}' creado.`, data: record };
    }
    case "list_project_docs": {
      const docs = await listProjectDocuments(action.projectId);
      return { message: `Se encontraron ${docs.length} documentos.`, data: docs };
    }
    case "read_doc": {
      const doc = await findDocumentById(action.docId);
      if (!doc) return { message: "Documento no encontrado." };
      const content = await safeRead(doc);
      return { message: `Contenido de '${doc.title}'.`, data: { title: doc.title, content } };
    }
    case "append_section": {
      const doc = await assertDoc(action.docId);
      const content = await safeRead(doc);
      const updated = appendSection(content, action.heading, action.content);
      await persistDoc(doc, updated);
      return { message: `Se agregó la sección '${action.heading}'.`, data: { preview: action.content } };
    }
    case "replace_section": {
      const doc = await assertDoc(action.docId);
      const content = await safeRead(doc);
      const result = replaceSection(content, action.heading, action.content);
      if (!result.found) {
        return { message: `No existe '${action.heading}'. ¿Querés agregarla?`, requiresConfirmation: true };
      }
      await persistDoc(doc, result.content);
      return { message: `Se actualizó la sección '${action.heading}'.`, data: { preview: result.preview } };
    }
    case "rename_doc": {
      return { message: "Renombrado implementable vía Google Drive update (pendiente en este MVP)." };
    }
    case "move_doc": {
      const doc = await assertDoc(action.docId);
      await moveDriveFile(doc.driveFileId, action.folderId);
      return { message: `Documento '${doc.title}' movido.` };
    }
    case "delete_doc": {
      return { message: "Se requiere confirmación explícita para borrar un documento.", requiresConfirmation: true };
    }
    default:
      return { message: "Acción no soportada." };
  }
}

async function assertDoc(docId: string) {
  const doc = await findDocumentById(docId);
  if (!doc) throw new Error("Documento no encontrado");
  return doc;
}

async function safeRead(doc: Document) {
  if (doc.driveFileId !== "pending") {
    try {
      return await readGoogleDoc(doc.driveFileId);
    } catch {
      return doc.contentCache ?? "";
    }
  }
  return doc.contentCache ?? "";
}

async function persistDoc(doc: Document, content: string) {
  if (doc.driveFileId !== "pending") {
    try {
      await overwriteGoogleDoc(doc.driveFileId, content);
    } catch {
      // falls back to local cache in development without credentials
    }
  }
  await updateDocumentCache(doc.id, content);
}
