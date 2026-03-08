import Link from "next/link";
import { Document } from "@prisma/client";

export function DocumentPanel({ projectId, documents }: { projectId: string; documents: Document[] }) {
  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li key={doc.id} className="rounded border p-2">
          <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/documents/${doc.id}`}>
            {doc.title}
          </Link>
          <p className="text-xs text-slate-500">{doc.docType ?? "general"}</p>
        </li>
      ))}
      {documents.length === 0 && <li className="text-sm text-slate-500">Sin documentos en este proyecto.</li>}
      <li>
        <a className="text-xs text-blue-600 hover:underline" href={`/api/projects/${projectId}/documents`}>
          Ver JSON de documentos
        </a>
      </li>
    </ul>
  );
}
