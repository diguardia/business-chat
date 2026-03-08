import { ActionLog } from "@prisma/client";

export function ActivityFeed({ logs }: { logs: ActionLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">Aún no hay actividad.</p>;
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <li key={log.id} className="rounded border p-2 text-sm">
          <p className="font-medium">{log.actionType}</p>
          <p className="text-slate-600">{log.summary}</p>
          <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
