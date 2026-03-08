import { AssistantAction } from "@/types/actions";
import { getOpenAIClient } from "@/lib/ai/openai";

const fallbackRules: Array<{ pattern: RegExp; map: (text: string, projectId: string) => AssistantAction | null }> = [
  {
    pattern: /list(a|á)?(me)?\s+los?\s+documentos/i,
    map: (_, projectId) => ({ type: "list_project_docs", projectId })
  },
  {
    pattern: /agreg(a|á)\s+una\s+secci(o|ó)n\s+(.+)/i,
    map: (text) => {
      const match = text.match(/secci(o|ó)n\s+(.+)/i);
      if (!match) return null;
      return { type: "append_section", docId: "", heading: match[2], content: "" };
    }
  }
];

export async function interpretIntent(input: string, projectId: string): Promise<AssistantAction | null> {
  if (!process.env.OPENAI_API_KEY) {
    return ruleBasedInterpretation(input, projectId);
  }

  const completion = await getOpenAIClient().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You convert user commands to JSON action. Return ONLY strict JSON with AssistantAction schema and include projectId when needed."
      },
      { role: "user", content: input }
    ],
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) return null;

  const parsed = JSON.parse(raw) as AssistantAction;
  if ("projectId" in parsed && !parsed.projectId) {
    (parsed as { projectId: string }).projectId = projectId;
  }
  return parsed;
}

function ruleBasedInterpretation(input: string, projectId: string): AssistantAction | null {
  for (const rule of fallbackRules) {
    if (rule.pattern.test(input)) {
      return rule.map(input, projectId);
    }
  }
  return null;
}
