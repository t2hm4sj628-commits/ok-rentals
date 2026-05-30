import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useClearErrorLogs, useErrorLogs } from "@/hooks/useBackend";
import { CheckCircle, Clock, Trash2, User, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export function ErrorLogsTab({ currentRole }: { currentRole?: string | null }) {
  const { data: rawLog, isLoading, isError } = useErrorLogs();
  const clearLogs = useClearErrorLogs();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Defensive: ensure we always have an array
  const log = Array.isArray(rawLog) ? rawLog : [];
  const isOwner = currentRole === "owner";

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="errorlogs.loading_state">
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
        data-ocid="errorlogs.error_state"
      >
        Failed to load error logs.
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="errorlogs.section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" />
          <h2 className="font-display text-base font-bold tracking-widest uppercase text-primary">
            Error Logs
          </h2>
          <Badge variant="secondary" className="text-xs">
            {log.length} {log.length === 1 ? "entry" : "entries"}
          </Badge>
        </div>
        {isOwner && log.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs uppercase tracking-widest border-destructive/40 text-destructive hover:bg-destructive/10"
            data-ocid="errorlogs.clear_button"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Logs
          </Button>
        )}
      </div>

      {log.length === 0 ? (
        <div
          className="py-12 text-center text-muted-foreground text-sm"
          data-ocid="errorlogs.empty_state"
        >
          <CheckCircle className="w-8 h-8 mx-auto mb-3 text-emerald-500/60" />
          No errors logged.
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
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Message
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Principal
                </th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry, i) => (
                <tr
                  key={entry.id.toString()}
                  className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                  data-ocid={`errorlogs.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0" />
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="text-xs border-destructive/30 text-destructive bg-destructive/5"
                    >
                      {entry.errorType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground max-w-xs truncate">
                    {entry.message}
                  </td>
                  <td className="px-4 py-3">
                    {entry.principalId ? (
                      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <User className="w-3 h-3 shrink-0" />
                        <span title={entry.principalId}>
                          {truncatePrincipal(entry.principalId)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
                data-ocid={`errorlogs.item.${i + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-destructive/30 text-destructive bg-destructive/5"
                  >
                    {entry.errorType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-foreground">{entry.message}</p>
                {entry.principalId && (
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    {entry.principalId}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear confirmation dialog */}
      <Dialog
        open={showClearConfirm}
        onOpenChange={(o) => !o && setShowClearConfirm(false)}
      >
        <DialogContent data-ocid="errorlogs.clear_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Clear All Error Logs?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all error log entries. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
              data-ocid="errorlogs.clear_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                clearLogs.mutate(undefined, {
                  onSuccess: () => {
                    toast.success("Error logs cleared");
                    setShowClearConfirm(false);
                  },
                  onError: (e) => toast.error((e as Error).message),
                });
              }}
              disabled={clearLogs.isPending}
              data-ocid="errorlogs.clear_confirm_button"
            >
              {clearLogs.isPending ? "Clearing..." : "Clear All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
