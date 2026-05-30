import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUpdatePolicy, usePolicies } from "@/hooks/useBackend";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const POLICY_TYPES = [
  {
    key: "cancellationPolicy",
    label: "Cancellation Policy",
    description: "Rules for cancellations and refunds.",
  },
  {
    key: "insuranceWaiverTerms",
    label: "Insurance Waiver Terms",
    description: "Terms for insurance coverage and liability.",
  },
  {
    key: "damagePolicy",
    label: "Damage Policy",
    description: "Rules for handling vehicle damage claims.",
  },
] as const;

export function PolicyTab() {
  const { data: policies, isLoading } = usePolicies();
  const updatePolicy = useAdminUpdatePolicy();

  const [edits, setEdits] = useState<Record<string, string>>({});

  const getValue = (key: string) =>
    edits[key] ?? (policies ? (policies as Record<string, string>)[key] : "");

  const handleSave = async (key: string) => {
    const content = edits[key];
    if (content === undefined) return;
    try {
      await updatePolicy.mutateAsync({ policyType: key, content });
      toast.success(
        `${POLICY_TYPES.find((p) => p.key === key)?.label} updated`,
      );
      setEdits((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="policy.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="policy.section">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg font-bold tracking-widest uppercase text-foreground">
          Policy Management
        </h2>
      </div>

      {POLICY_TYPES.map((policy) => (
        <div
          key={policy.key}
          className="bg-card border border-border rounded-xl p-5 space-y-3"
          data-ocid={`policy.card.${policy.key}`}
        >
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              {policy.label}
            </h3>
            <p className="text-xs text-muted-foreground">
              {policy.description}
            </p>
          </div>
          <textarea
            value={getValue(policy.key)}
            onChange={(e) =>
              setEdits((prev) => ({ ...prev, [policy.key]: e.target.value }))
            }
            rows={8}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            data-ocid={`policy.textarea.${policy.key}`}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {edits[policy.key] !== undefined ? "Unsaved changes" : "Saved"}
            </span>
            <Button
              size="sm"
              onClick={() => handleSave(policy.key)}
              disabled={
                edits[policy.key] === undefined || updatePolicy.isPending
              }
              data-ocid={`policy.save_button.${policy.key}`}
            >
              {updatePolicy.isPending ? "Saving..." : "Save Policy"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
