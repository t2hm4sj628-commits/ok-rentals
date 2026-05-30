import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminGetEmailSubscribers,
  useAdminSendPromoEmail,
} from "@/hooks/useBackend";
import { Download, Mail, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function exportToCSV(
  subscribers: Array<{ email: string; subscribedAt: bigint }>,
) {
  const headers = ["Email", "Subscribed Date"];
  const rows = subscribers.map((s) => [
    s.email,
    new Date(Number(s.subscribedAt)).toISOString(),
  ]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ok-rentals-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function EmailListTab() {
  const { data: subscribers = [], isLoading } = useAdminGetEmailSubscribers();
  const sendPromo = useAdminSendPromoEmail();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sentCount, setSentCount] = useState<number | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }
    try {
      const count = await sendPromo.mutateAsync({ subject, htmlBody: body });
      setSentCount(Number(count));
      toast.success(`Promotional email sent to ${count} subscriber(s)`);
      setSubject("");
      setBody("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="emaillist.loading_state">
        <Skeleton className="h-12 rounded-xl" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="emaillist.section">
      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">
            {subscribers.length}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Total Subscribers
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => exportToCSV(subscribers)}
          disabled={subscribers.length === 0}
          data-ocid="emaillist.export_button"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV
        </Button>
      </div>

      {/* Send Promo Email */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-bold tracking-widest uppercase text-foreground">
            Send Promotional Email
          </h3>
        </div>

        {sentCount !== null && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
            Email sent successfully to {sentCount} subscriber(s).
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label
              htmlFor="email-subject"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block"
            >
              Subject
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Fleet Arrivals — Limited Time Offer"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-ocid="emaillist.subject_input"
            />
          </div>
          <div>
            <label
              htmlFor="email-body"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block"
            >
              HTML Body
            </label>
            <textarea
              id="email-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="<p>Hello valued member,</p><p>We have exciting news...</p>"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono"
              data-ocid="emaillist.body_textarea"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sendPromo.isPending || !subject.trim() || !body.trim()}
            data-ocid="emaillist.send_button"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {sendPromo.isPending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/50">
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
            All Subscribers
          </h3>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["#", "Email", "Subscribed Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr
                  key={`${s.email}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                  data-ocid={`emaillist.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(s.subscribedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-0">
          {subscribers.map((s, i) => (
            <div
              key={`${s.email}-${i}`}
              className="border-b border-border last:border-0 px-4 py-3 hover:bg-secondary/20 transition-colors"
              data-ocid={`emaillist.item.${i + 1}`}
            >
              <p className="text-sm text-foreground">{s.email}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(s.subscribedAt)}
              </p>
            </div>
          ))}
        </div>
        {subscribers.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="emaillist.empty_state"
          >
            No subscribers yet.
          </div>
        )}
      </div>
    </div>
  );
}
