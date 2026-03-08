import { google } from "googleapis";
import { getGoogleClient } from "@/lib/google/auth";

function docs() {
  return google.docs({ version: "v1", auth: getGoogleClient() });
}

export async function createGoogleDoc(title: string) {
  const response = await docs().documents.create({
    requestBody: { title }
  });
  return response.data;
}

export async function readGoogleDoc(docId: string): Promise<string> {
  const response = await docs().documents.get({ documentId: docId });
  const elements = response.data.body?.content ?? [];

  const text = elements
    .flatMap((item) => item.paragraph?.elements ?? [])
    .map((el) => el.textRun?.content ?? "")
    .join("");

  return text;
}

export async function overwriteGoogleDoc(docId: string, content: string) {
  const document = await docs().documents.get({ documentId: docId });
  const endIndex = document.data.body?.content?.at(-1)?.endIndex ?? 1;

  await docs().documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              startIndex: 1,
              endIndex: Math.max(1, endIndex - 1)
            }
          }
        },
        {
          insertText: {
            location: { index: 1 },
            text: content
          }
        }
      ]
    }
  });
}
