function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

export function replaceSection(content: string, heading: string, nextContent: string) {
  const headingPattern = `^##\\s+${escapeRegex(heading)}\\s*$`;
  const sectionRegex = new RegExp(`(${headingPattern}[\\s\\S]*?)(?=^##\\s+|$)`, "im");

  if (!sectionRegex.test(content)) {
    return {
      found: false,
      content,
      preview: `No existe la sección '${heading}'.`
    };
  }

  const replacement = `## ${heading}\n\n${nextContent.trim()}\n`;
  const updated = content.replace(sectionRegex, replacement);

  return {
    found: true,
    content: updated,
    preview: replacement
  };
}

export function appendSection(content: string, heading: string, nextContent: string) {
  const section = `\n\n## ${heading}\n\n${nextContent.trim()}\n`;
  return `${content.trim()}${section}`;
}
