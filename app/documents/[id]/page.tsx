import { notFound } from "next/navigation";
import { findDocumentById } from "@/lib/projects/service";
import { readGoogleDoc } from "@/lib/google/docs";

export default async function DocumentView({ params }: { params: { id: string } }) {
  const doc = await findDocumentById(params.id);
  if (!doc) notFound();

  let content = doc.contentCache ?? "";
  if (doc.driveFileId !== "pending") {
    try {
      content = await readGoogleDoc(doc.driveFileId);
    } catch {
      // fallback to cache
    }
  }

  return (
    <article className="space-y-4 rounded-xl border bg-white p-6">
      <header>
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        <p className="text-sm text-slate-600">Tipo: {doc.docType ?? "general"}</p>
        <p className="text-sm text-slate-600">Drive fileId: {doc.driveFileId}</p>
      </header>
      <pre className="whitespace-pre-wrap rounded border bg-slate-50 p-4 text-sm">{content}</pre>
    </article>
  );
}
