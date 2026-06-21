import { AlertTriangle, Database } from "lucide-react";
import { DATA_NOTICES } from "@/lib/config";

export function DataNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`rounded-2xl border border-amber-200 bg-amber-50 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex gap-3">
        {compact ? <Database className="mt-0.5 size-5 shrink-0 text-amber-700" /> : <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-amber-950">
          {DATA_NOTICES.map((notice) => <span key={notice}>{notice}</span>)}
        </div>
      </div>
    </aside>
  );
}
