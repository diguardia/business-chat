import Link from "next/link";
import { Project } from "@prisma/client";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="rounded-md border bg-white p-4 text-slate-600">No hay proyectos todavía.</p>;
  }

  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <li key={project.id} className="rounded-md border bg-white p-4">
          <Link className="font-semibold text-blue-600 hover:underline" href={`/projects/${project.id}`}>
            {project.name}
          </Link>
          <p className="text-sm text-slate-600">{project.description || "Sin descripción"}</p>
        </li>
      ))}
    </ul>
  );
}
