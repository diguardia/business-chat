export type AssistantAction =
  | { type: "create_project"; name: string; description?: string }
  | { type: "create_folder"; projectId: string; folderName: string; parentFolderId?: string }
  | { type: "create_doc"; projectId: string; title: string; folderName?: string; template?: string }
  | { type: "list_project_docs"; projectId: string }
  | { type: "read_doc"; docId: string }
  | { type: "append_section"; docId: string; heading: string; content: string }
  | { type: "replace_section"; docId: string; heading: string; content: string }
  | { type: "rename_doc"; docId: string; title: string }
  | { type: "move_doc"; docId: string; folderId: string }
  | { type: "delete_doc"; docId: string; requireConfirmation: true }
  | { type: "generate_from_template"; projectId: string; title: string; template: string };

export type ActionExecutionResult = {
  message: string;
  requiresConfirmation?: boolean;
  data?: unknown;
};
