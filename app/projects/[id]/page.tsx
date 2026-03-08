import { notFound } from "next/navigation";
import { ChatPanel } from "@/components/chat-panel";
import { DocumentPanel } from "@/components/document-panel";
import { ActivityFeed } from "@/components/activity-feed";
import { getProjectDetail } from "@/lib/projects/service";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const detail = await getProjectDetail(params.id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="rounded-xl border bg-white p-4 lg:col-span-3">
        <h2 className="mb-3 text-lg font-semibold">Documentos</h2>
        <DocumentPanel projectId={detail.project.id} documents={detail.documents} />
      </section>
      <section className="rounded-xl border bg-white p-4 lg:col-span-6">
        <h2 className="mb-3 text-lg font-semibold">Chat</h2>
        <ChatPanel projectId={detail.project.id} messages={detail.messages} />
      </section>
      <section className="rounded-xl border bg-white p-4 lg:col-span-3">
        <h2 className="mb-3 text-lg font-semibold">Actividad</h2>
        <ActivityFeed logs={detail.logs} />
      </section>
    </div>
  );
}
