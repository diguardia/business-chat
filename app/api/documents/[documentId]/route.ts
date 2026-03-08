import { NextResponse } from "next/server";
import { findDocumentById } from "@/lib/projects/service";
import { readGoogleDoc } from "@/lib/google/docs";

export async function GET(_: Request, { params }: { params: { documentId: string } }) {
  const doc = await findDocumentById(params.documentId);
  if (!doc) {
    return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
  }

  let content = doc.contentCache ?? "";
  if (doc.driveFileId !== "pending") {
    try {
      content = await readGoogleDoc(doc.driveFileId);
    } catch {
      // fall back to cache
    }
  }

  return NextResponse.json({ document: doc, content });
}
