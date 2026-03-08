import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createProject, listProjects } from "@/lib/projects/service";

const bodySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional()
});

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const body = bodySchema.parse(await request.json());
  const project = await createProject(body.name, body.description);
  return NextResponse.json({ project }, { status: 201 });
}
