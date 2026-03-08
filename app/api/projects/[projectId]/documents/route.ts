import { NextResponse } from "next/server";
import { listProjectDocuments } from "@/lib/projects/service";

export async function GET(_: Request, { params }: { params: { projectId: string } }) {
  const documents = await listProjectDocuments(params.projectId);
  return NextResponse.json({ documents });
}
