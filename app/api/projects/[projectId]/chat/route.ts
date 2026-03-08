import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeAction } from "@/lib/actions/executor";
import { interpretIntent } from "@/lib/ai/intent-interpreter";
import { saveActionLog, saveMessage } from "@/lib/projects/service";

const chatSchema = z.object({
  role: z.literal("user"),
  content: z.string().min(1)
});

export async function POST(request: NextRequest, { params }: { params: { projectId: string } }) {
  const body = chatSchema.parse(await request.json());

  await saveMessage(params.projectId, body.role, body.content);
  const action = await interpretIntent(body.content, params.projectId);

  if (!action) {
    const fallbackMessage = "No pude inferir una acción estructurada. Reformulá con más detalle.";
    await saveMessage(params.projectId, "assistant", fallbackMessage);
    return NextResponse.json({ reply: fallbackMessage });
  }

  const result = await executeAction(action);
  await saveActionLog({
    projectId: params.projectId,
    actionType: action.type,
    summary: result.message,
    targetType: "document",
    targetId: "docId" in action ? action.docId : undefined,
    confirmed: !result.requiresConfirmation
  });

  await saveMessage(params.projectId, "assistant", result.message);

  return NextResponse.json({ action, result });
}
