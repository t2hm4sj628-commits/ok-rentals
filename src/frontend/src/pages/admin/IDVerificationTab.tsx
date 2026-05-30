import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminGetPendingVerifications,
  useAdminReviewVerification,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Eye, Shield, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncatePrincipal(p: { toText(): string } | string) {
  const t = typeof p === "string" ? p : p.toText();
  return t.length > 16 ? `${t.slice(0, 8)}…${t.slice(-4)}` : t;
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "approved":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

export function IDVerificationTab() {
  const { data: verifications = [], isLoading } =
    useAdminGetPendingVerifications();
  const reviewMutation = useAdminReviewVerification();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  const filtered = verifications.filter((v) =>
    filter === "all" ? true : v.status === filter,
  );

  const pendingCount = verifications.filter(
    (v) => v.status === "pending",
  ).length;

  const handleReview = async (bookingId: string, approved: boolean) => {
    const notes = notesMap[bookingId] ?? "";
    try {
      await reviewMutation.mutateAsync({ bookingId, approved, notes });
      toast.success(
        approved ? "Verification approved" : "Verification rejected",
      );
      setNotesMap((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const FILTERS: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="idver.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="idver.section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold tracking-widest uppercase text-foreground">
            ID Verification
          </h2>
          {pendingCount > 0 && (
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs"
            >
              {pendingCount} pending
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap" data-ocid="idver.filter_tabs">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-colors border",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:border-primary/50",
            )}
            data-ocid={`idver.filter_${f.id}_tab`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {[
                "Booking ID",
                "User",
                "Submitted",
                "SSN (last 4)",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr
                key={`${v.bookingId}-${i}`}
                className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                data-ocid={`idver.item.${i + 1}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{v.bookingId}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {truncatePrincipal(v.userId)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    {formatDate(v.submittedAt)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  ***-{v.ssnLast4}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium border",
                      statusBadgeClass(v.status),
                    )}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingPhoto(v.licensePhotoId)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label="View license photo"
                      data-ocid={`idver.view_photo_button.${i + 1}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {v.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReview(v.bookingId, true)}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                          aria-label="Approve"
                          data-ocid={`idver.approve_button.${i + 1}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReview(v.bookingId, false)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Reject"
                          data-ocid={`idver.reject_button.${i + 1}`}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {v.status === "pending" && (
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={notesMap[v.bookingId] ?? ""}
                      onChange={(e) =>
                        setNotesMap((prev) => ({
                          ...prev,
                          [v.bookingId]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full text-xs rounded border border-border bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      data-ocid={`idver.notes_input.${i + 1}`}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="idver.empty_state"
          >
            No verification requests found.
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((v, i) => (
          <div
            key={`${v.bookingId}-${i}`}
            className="bg-card border border-border rounded-xl p-4 space-y-2"
            data-ocid={`idver.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                #{v.bookingId}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium border",
                  statusBadgeClass(v.status),
                )}
              >
                {v.status}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground break-all">
              {truncatePrincipal(v.userId)}
            </p>
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {formatDate(v.submittedAt)}
            </p>
            <p className="font-mono text-xs text-foreground">
              SSN: ***-{v.ssnLast4}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setViewingPhoto(v.licensePhotoId)}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="View license photo"
                data-ocid={`idver.mobile_view_photo_button.${i + 1}`}
              >
                <Eye className="w-4 h-4" />
              </button>
              {v.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReview(v.bookingId, true)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    aria-label="Approve"
                    data-ocid={`idver.mobile_approve_button.${i + 1}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(v.bookingId, false)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    aria-label="Reject"
                    data-ocid={`idver.mobile_reject_button.${i + 1}`}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {v.status === "pending" && (
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notesMap[v.bookingId] ?? ""}
                onChange={(e) =>
                  setNotesMap((prev) => ({
                    ...prev,
                    [v.bookingId]: e.target.value,
                  }))
                }
                className="w-full text-xs rounded border border-border bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                data-ocid={`idver.mobile_notes_input.${i + 1}`}
              />
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="idver.empty_state"
          >
            No verification requests found.
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {viewingPhoto && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewingPhoto(null)}
          data-ocid="idver.photo_modal"
        >
          <div
            className="bg-card rounded-xl p-4 max-w-lg w-full"
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">
                License Photo
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewingPhoto(null)}
                data-ocid="idver.close_photo_button"
              >
                Close
              </Button>
            </div>
            <img
              src={`/api/object-storage/${viewingPhoto}`}
              alt="License"
              className="w-full rounded-lg object-contain max-h-[60vh]"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
          </div>
        </button>
      )}
    </div>
  );
}
