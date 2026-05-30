import { createActor } from "@/backend";
import type { Booking } from "@/backend";
import { BookingStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminReportDamage,
  useMessages,
  useSendMessage,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Filter =
  | "all"
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "returned"
  | "cancelled";

function statusBadge(status: BookingStatus) {
  const map: Record<string, string> = {
    [BookingStatus.pending]:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    [BookingStatus.approved]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [BookingStatus.active]:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    [BookingStatus.completed]:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
    [BookingStatus.returned]: "bg-primary/10 text-primary border-primary/20",
    [BookingStatus.cancelled]:
      "bg-destructive/10 text-destructive border-destructive/20",
  };
  return map[status] ?? "bg-secondary text-muted-foreground border-border";
}

function truncatePrincipal(p: { toText(): string } | string) {
  const t = typeof p === "string" ? p : p.toText();
  return t.length > 16 ? `${t.slice(0, 8)}…${t.slice(-4)}` : t;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  const transitions: Record<string, BookingStatus[]> = {
    [BookingStatus.pending]: [BookingStatus.approved, BookingStatus.cancelled],
    [BookingStatus.approved]: [BookingStatus.active, BookingStatus.cancelled],
    [BookingStatus.active]: [BookingStatus.completed, BookingStatus.cancelled],
    [BookingStatus.completed]: [BookingStatus.returned],
  };
  return transitions[from]?.includes(to) ?? false;
}

function BookingMessages({ bookingId }: { bookingId: bigint }) {
  const { data: messages = [] } = useMessages(bookingId);
  const sendMessage = useSendMessage();
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    if (!reply.trim()) return;
    try {
      await sendMessage.mutateAsync({ bookingId, content: reply });
      setReply("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2 mt-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <MessageSquare className="w-3 h-3" />
        Messages
      </h4>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No messages yet.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id.toString()} className="text-xs">
            <span className="font-semibold text-foreground">
              {m.senderRole}
            </span>
            <span className="text-muted-foreground ml-1">
              {new Date(Number(m.timestamp)).toLocaleTimeString()}
            </span>
            <p className="text-foreground mt-0.5">{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a reply..."
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={handleSend}
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function BookingsTab() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [damageNotesMap, setDamageNotesMap] = useState<Record<string, string>>(
    {},
  );
  const [showDamageForm, setShowDamageForm] = useState<Set<string>>(new Set());

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["admin.bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllBookings();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVehicles();
    },
    enabled: !!actor && !isFetching,
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminUpdateBookingStatus(id, status);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.bookings"] });
      toast.success("Booking status updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const reportDamage = useAdminReportDamage();

  const vehicleMap = new Map(vehicles.map((v) => [v.id.toString(), v.name]));

  const filtered = bookings.filter(
    (b) => filter === "all" || b.status === filter,
  );

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "returned", label: "Returned" },
    { id: "cancelled", label: "Cancelled" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="bookings.loading_state">
        {["b1", "b2", "b3", "b4", "b5"].map((k) => (
          <Skeleton key={k} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="bookings.section">
      <div className="flex gap-2 flex-wrap" data-ocid="bookings.filter_tabs">
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
            data-ocid={`bookings.filter_${f.id}_tab`}
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
                "ID",
                "Customer",
                "Vehicle",
                "Dates",
                "Total",
                "Payment",
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
            {filtered.map((b, i) => (
              <tr
                key={b.id.toString()}
                className={cn(
                  "border-b border-border last:border-0",
                  i % 2 === 0 ? "bg-card" : "bg-secondary/20",
                )}
                data-ocid={`bookings.item.${i + 1}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{b.id.toString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[120px]">
                  <span
                    title={
                      typeof b.userId === "string"
                        ? b.userId
                        : b.userId.toText()
                    }
                  >
                    {truncatePrincipal(b.userId)}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground">
                  {vehicleMap.get(b.vehicleId.toString()) ??
                    b.vehicleId.toString()}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(b.startDate)} – {formatDate(b.endDate)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  ${Number(b.totalCost).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                  {b.paymentMethod}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium border",
                        statusBadge(b.status),
                      )}
                    >
                      {b.status}
                    </span>
                    {b.damageClaimFlag && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-destructive/10 text-destructive border-destructive/20">
                        Damage
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status transitions */}
                    {canTransition(b.status, BookingStatus.approved) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({
                            id: b.id,
                            status: BookingStatus.approved,
                          })
                        }
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="Approve"
                        data-ocid={`bookings.approve_button.${i + 1}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {canTransition(b.status, BookingStatus.active) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({
                            id: b.id,
                            status: BookingStatus.active,
                          })
                        }
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        aria-label="Activate"
                        data-ocid={`bookings.activate_button.${i + 1}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {canTransition(b.status, BookingStatus.completed) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({
                            id: b.id,
                            status: BookingStatus.completed,
                          })
                        }
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        aria-label="Complete"
                        data-ocid={`bookings.complete_button.${i + 1}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {canTransition(b.status, BookingStatus.returned) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({
                            id: b.id,
                            status: BookingStatus.returned,
                          })
                        }
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label="Mark returned"
                        data-ocid={`bookings.return_button.${i + 1}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {canTransition(b.status, BookingStatus.cancelled) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({
                            id: b.id,
                            status: BookingStatus.cancelled,
                          })
                        }
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label="Cancel"
                        data-ocid={`bookings.cancel_button.${i + 1}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* View Messages */}
                    <button
                      type="button"
                      onClick={() => {
                        const key = b.id.toString();
                        setExpandedMessages((prev) => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="View messages"
                      data-ocid={`bookings.messages_button.${i + 1}`}
                    >
                      {expandedMessages.has(b.id.toString()) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Report Damage */}
                    <button
                      type="button"
                      onClick={() => {
                        const key = b.id.toString();
                        setShowDamageForm((prev) => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                      className={cn(
                        "transition-colors",
                        b.damageClaimFlag
                          ? "text-destructive"
                          : "text-orange-400 hover:text-orange-300",
                      )}
                      aria-label="Report damage"
                      data-ocid={`bookings.damage_button.${i + 1}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Damage form */}
                  {showDamageForm.has(b.id.toString()) && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={damageNotesMap[b.id.toString()] ?? ""}
                        onChange={(e) =>
                          setDamageNotesMap((prev) => ({
                            ...prev,
                            [b.id.toString()]: e.target.value,
                          }))
                        }
                        rows={2}
                        placeholder="Damage notes..."
                        className="w-full text-xs rounded border border-border bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-y"
                        data-ocid={`bookings.damage_notes.${i + 1}`}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs h-7"
                        onClick={async () => {
                          try {
                            await reportDamage.mutateAsync({
                              bookingId: b.id,
                              notes: damageNotesMap[b.id.toString()] ?? "",
                            });
                            toast.success("Damage reported");
                            setShowDamageForm((prev) => {
                              const next = new Set(prev);
                              next.delete(b.id.toString());
                              return next;
                            });
                            setDamageNotesMap((prev) => {
                              const next = { ...prev };
                              delete next[b.id.toString()];
                              return next;
                            });
                          } catch (e) {
                            toast.error((e as Error).message);
                          }
                        }}
                        disabled={reportDamage.isPending}
                        data-ocid={`bookings.damage_submit.${i + 1}`}
                      >
                        {reportDamage.isPending ? "Saving..." : "Report Damage"}
                      </Button>
                    </div>
                  )}

                  {/* Messages thread */}
                  {expandedMessages.has(b.id.toString()) && (
                    <BookingMessages bookingId={b.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="bookings.empty_state"
          >
            No bookings found.
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((b, i) => (
          <div
            key={b.id.toString()}
            className="bg-card border border-border rounded-xl p-4 space-y-2"
            data-ocid={`bookings.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                #{b.id.toString()}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium border",
                  statusBadge(b.status),
                )}
              >
                {b.status}
              </span>
            </div>
            <p className="font-semibold text-foreground">
              {vehicleMap.get(b.vehicleId.toString()) ?? b.vehicleId.toString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(b.startDate)} – {formatDate(b.endDate)}
            </p>
            <p className="font-mono text-xs text-muted-foreground break-all mt-0.5">
              {typeof b.userId === "string" ? b.userId : b.userId.toText()}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">
                ${Number(b.totalCost).toLocaleString()}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {canTransition(b.status, BookingStatus.approved) && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus.mutate({
                        id: b.id,
                        status: BookingStatus.approved,
                      })
                    }
                    className="text-blue-400 hover:text-blue-300"
                    aria-label="Approve"
                    data-ocid={`bookings.mobile_approve_button.${i + 1}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {canTransition(b.status, BookingStatus.active) && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus.mutate({
                        id: b.id,
                        status: BookingStatus.active,
                      })
                    }
                    className="text-emerald-400 hover:text-emerald-300"
                    aria-label="Activate"
                    data-ocid={`bookings.mobile_activate_button.${i + 1}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {canTransition(b.status, BookingStatus.completed) && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus.mutate({
                        id: b.id,
                        status: BookingStatus.completed,
                      })
                    }
                    className="text-purple-400 hover:text-purple-300"
                    aria-label="Complete"
                    data-ocid={`bookings.mobile_complete_button.${i + 1}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {canTransition(b.status, BookingStatus.returned) && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus.mutate({
                        id: b.id,
                        status: BookingStatus.returned,
                      })
                    }
                    className="text-primary hover:text-primary/80"
                    aria-label="Mark returned"
                    data-ocid={`bookings.mobile_return_button.${i + 1}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {canTransition(b.status, BookingStatus.cancelled) && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus.mutate({
                        id: b.id,
                        status: BookingStatus.cancelled,
                      })
                    }
                    className="text-destructive"
                    aria-label="Cancel"
                    data-ocid={`bookings.mobile_cancel_button.${i + 1}`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const key = b.id.toString();
                    setExpandedMessages((prev) => {
                      const next = new Set(prev);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="View messages"
                  data-ocid={`bookings.mobile_messages_button.${i + 1}`}
                >
                  {expandedMessages.has(b.id.toString()) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const key = b.id.toString();
                    setShowDamageForm((prev) => {
                      const next = new Set(prev);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    });
                  }}
                  className={cn(
                    b.damageClaimFlag
                      ? "text-destructive"
                      : "text-orange-400 hover:text-orange-300",
                  )}
                  aria-label="Report damage"
                  data-ocid={`bookings.mobile_damage_button.${i + 1}`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>

              {showDamageForm.has(b.id.toString()) && (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={damageNotesMap[b.id.toString()] ?? ""}
                    onChange={(e) =>
                      setDamageNotesMap((prev) => ({
                        ...prev,
                        [b.id.toString()]: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Damage notes..."
                    className="w-full text-xs rounded border border-border bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-y"
                    data-ocid={`bookings.mobile_damage_notes.${i + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs h-7 w-full"
                    onClick={async () => {
                      try {
                        await reportDamage.mutateAsync({
                          bookingId: b.id,
                          notes: damageNotesMap[b.id.toString()] ?? "",
                        });
                        toast.success("Damage reported");
                        setShowDamageForm((prev) => {
                          const next = new Set(prev);
                          next.delete(b.id.toString());
                          return next;
                        });
                        setDamageNotesMap((prev) => {
                          const next = { ...prev };
                          delete next[b.id.toString()];
                          return next;
                        });
                      } catch (e) {
                        toast.error((e as Error).message);
                      }
                    }}
                    disabled={reportDamage.isPending}
                    data-ocid={`bookings.mobile_damage_submit.${i + 1}`}
                  >
                    {reportDamage.isPending ? "Saving..." : "Report Damage"}
                  </Button>
                </div>
              )}

              {expandedMessages.has(b.id.toString()) && (
                <BookingMessages bookingId={b.id} />
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="bookings.empty_state"
          >
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
