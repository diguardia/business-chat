import { NewProjectForm } from "@/components/new-project-form";
import { ProjectList } from "@/components/project-list";
import { listProjects } from "@/lib/projects/service";

export default async function HomePage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Asistente Documental</h1>
        <p className="text-slate-600">
          Gestioná proyectos, documentos y acciones sobre Google Drive/Docs desde chat.
        </p>
      </header>
      <NewProjectForm />
      <ProjectList projects={projects} />
    </div>
  );
}
