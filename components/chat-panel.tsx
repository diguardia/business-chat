"use client";

import { ChatMessage } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ChatPanel({ projectId, messages }: { projectId: string; messages: ChatMessage[] }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    await fetch(`/api/projects/${projectId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, role: "user" })
    });

    setText("");
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded border bg-slate-50 p-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded p-2 text-sm ${
              message.role === "assistant" ? "bg-blue-100" : message.role === "system" ? "bg-amber-100" : "bg-white"
            }`}
          >
            <p className="mb-1 text-xs uppercase text-slate-500">{message.role}</p>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={submit}>
        <input
          className="flex-1 rounded border px-3 py-2"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribí una instrucción..."
        />
        <button className="rounded bg-blue-600 px-3 py-2 text-white disabled:bg-blue-300" disabled={loading} type="submit">
          {loading ? "Enviando" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
