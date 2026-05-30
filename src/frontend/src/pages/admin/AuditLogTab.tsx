import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuditLog } from "@/hooks/useBackend";
import { ClipboardList, Clock, User } from "lucide-react";

function truncatePrincipal(p: string): string {
  if (p.length <= 20) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AuditLogTab() {
  const { data: rawLog, isLoading, isError } = useGetAuditLog();
  // Defensive: ensure we always have an array even if the hook returns unexpected shape
  const log = Array.isArray(rawLog) ? rawLog : [];

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="audit.loading_state">
        {[1, 2, 3, 4, 5].map((k) => (
          <Skeleton key={k} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="py-12 text-center text-destructive text-sm"
        data-ocid="audit.error_state"
      >
        Failed to load audit log.
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="audit.section">
      <div className="flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-primary" />
        <h2 className="font-display text-base font-bold tracking-widest uppercase text-primary">
          Audit Log
        </h2>
        <Badge variant="secondary" className="ml-auto text-xs">
          {log.length} {log.length === 1 ? "entry" : "entries"}
        </Badge>
      </div>

      {log.length === 0 ? (
        <div
          className="py-12 text-center text-muted-foreground text-sm"
          data-ocid="audit.empty_state"
        >
          No audit log entries yet.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Desktop table */}
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Performer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Target
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry, i) => (
                <tr
                  key={entry.id.toString()}
                  className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                  data-ocid={`audit.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <User className="w-3 h-3 shrink-0" />
                      <span title={entry.performer.toText()}>
                        {truncatePrincipal(entry.performer.toText())}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/5"
                    >
                      {entry.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {entry.target ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0" />
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {log.map((entry, i) => (
              <div
                key={entry.id.toString()}
                className="p-4 space-y-1.5"
                data-ocid={`audit.item.${i + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary bg-primary/5"
                  >
                    {entry.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {entry.performer.toText()}
                </p>
                {entry.target && (
                  <p className="text-xs text-muted-foreground">
                    Target: {entry.target}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
