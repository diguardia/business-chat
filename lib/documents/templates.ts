import { promises as fs } from "node:fs";
import path from "node:path";

const templateMap: Record<string, string> = {
  "business-plan": "business-plan.md",
  "value-proposition": "value-proposition.md",
  mvp: "mvp.md",
  roadmap: "roadmap.md",
  architecture: "architecture.md",
  pricing: "pricing.md",
  onboarding: "onboarding.md"
};

export async function getTemplate(template: string) {
  const filename = templateMap[template];
  if (!filename) {
    throw new Error(`Template '${template}' no disponible`);
  }
  return fs.readFile(path.join(process.cwd(), "templates", filename), "utf8");
}

export function listTemplateKeys() {
  return Object.keys(templateMap);
}
