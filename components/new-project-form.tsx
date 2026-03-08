"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function NewProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description })
    });

    setLoading(false);
    setName("");
    setDescription("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border bg-white p-4 space-y-3">
      <h2 className="text-lg font-semibold">Nuevo proyecto</h2>
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Nombre"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <textarea
        className="w-full rounded border px-3 py-2"
        placeholder="Descripción"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-blue-300"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creando..." : "Crear proyecto"}
      </button>
    </form>
  );
}
