import { createActor } from "@/backend";
import type { UserMembership } from "@/backend";
import { MembershipStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetComparisonRows,
  useGetPlanConfigs,
  useSetComparisonRows,
  useSetPlanConfigs,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { ComparisonRow } from "@/types";
import type { MembershipPlanConfig, PlanConfigs } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function statusColor(s: MembershipStatus) {
  const map: Record<MembershipStatus, string> = {
    [MembershipStatus.active]: "bg-emerald-500/10 text-emerald-400",
    [MembershipStatus.cancelled]: "bg-destructive/10 text-destructive",
    [MembershipStatus.expired]: "bg-yellow-500/10 text-yellow-400",
    [MembershipStatus.pending]: "bg-yellow-500/10 text-yellow-400",
    [MembershipStatus.failed]: "bg-destructive/10 text-destructive",
  };
  return map[s] ?? "bg-secondary text-muted-foreground";
}

function PlanEditor({
  label,
  ocidPrefix,
  plan,
  onChange,
}: {
  label: string;
  ocidPrefix: string;
  plan: MembershipPlanConfig;
  onChange: (updated: MembershipPlanConfig) => void;
}) {
  function updateField<K extends keyof MembershipPlanConfig>(
    key: K,
    value: MembershipPlanConfig[K],
  ) {
    onChange({ ...plan, [key]: value });
  }

  function updateFeature(index: number, value: string) {
    const next = [...plan.features];
    next[index] = value;
    onChange({ ...plan, features: next });
  }

  function removeFeature(index: number) {
    onChange({
      ...plan,
      features: plan.features.filter((_, i) => i !== index),
    });
  }

  function addFeature() {
    onChange({ ...plan, features: [...plan.features, ""] });
  }

  return (
    <div className="bg-secondary/30 border border-border rounded-xl p-5 space-y-4">
      <p className="font-display text-xs font-semibold uppercase tracking-widest text-primary">
        {label}
      </p>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-widest">Plan Name</Label>
        <Input
          value={plan.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Monthly Elite"
          data-ocid={`${ocidPrefix}.name_input`}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-widest">Description</Label>
        <Textarea
          value={plan.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Plan description…"
          rows={2}
          className="resize-none text-sm"
          data-ocid={`${ocidPrefix}.description_input`}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-widest">
          Price per period (USD)
        </Label>
        <Input
          type="number"
          min={0}
          max={1000000}
          step={1}
          value={plan.price}
          onChange={(e) => updateField("price", Number(e.target.value))}
          placeholder="5000"
          data-ocid={`${ocidPrefix}.price_input`}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest">Features</Label>
        {plan.features.map((feat, i) => (
          <div key={`feature-${feat}`} className="flex items-center gap-2">
            <Input
              value={feat}
              onChange={(e) => updateFeature(i, e.target.value)}
              placeholder={`Feature ${i + 1}`}
              className="text-sm flex-1"
              data-ocid={`${ocidPrefix}.feature_input.${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFeature(i)}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              aria-label="Remove feature"
              data-ocid={`${ocidPrefix}.remove_feature_button.${i + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeature}
          className="text-xs uppercase tracking-widest gap-1.5 mt-1"
          data-ocid={`${ocidPrefix}.add_feature_button`}
        >
          <Plus className="w-3.5 h-3.5" /> Add Feature
        </Button>
      </div>
    </div>
  );
}

function ComparisonTableEditor() {
  const { data: savedRows, isLoading } = useGetComparisonRows();
  const setComparisonRows = useSetComparisonRows();
  const [rows, setRows] = useState<ComparisonRow[]>([]);

  useEffect(() => {
    if (savedRows && rows.length === 0) {
      setRows(savedRows);
    }
  }, [savedRows, rows.length]);

  function updateRow(index: number, updated: Partial<ComparisonRow>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...updated } : r)),
    );
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { feature: "", monthly: false, annual: false },
    ]);
  }

  async function handleSave() {
    try {
      await setComparisonRows.mutateAsync(rows);
      toast.success("Comparison table saved successfully.");
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to save comparison table.");
    }
  }

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="memberships.comparison_editor"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
          Plan Comparison Table
        </h3>
        <p className="text-xs text-muted-foreground">
          Edits update live on the Membership page.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Feature
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-16 text-center">
          Monthly
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary w-16 text-center">
          Annual
        </span>
        <span className="w-8" />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={`comparison-row-${row.feature || i}`}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center bg-secondary/30 border border-border rounded-lg px-3 py-2.5"
            data-ocid={`memberships.comparison_row.${i + 1}`}
          >
            <Input
              value={row.feature}
              onChange={(e) => updateRow(i, { feature: e.target.value })}
              placeholder={`Feature ${i + 1}`}
              className="text-sm h-8"
              data-ocid={`memberships.comparison_feature_input.${i + 1}`}
            />
            <div className="flex items-center justify-center w-16">
              <Switch
                checked={row.monthly}
                onCheckedChange={(checked) =>
                  updateRow(i, { monthly: checked })
                }
                data-ocid={`memberships.comparison_monthly_toggle.${i + 1}`}
              />
            </div>
            <div className="flex items-center justify-center w-16">
              <Switch
                checked={row.annual}
                onCheckedChange={(checked) => updateRow(i, { annual: checked })}
                data-ocid={`memberships.comparison_annual_toggle.${i + 1}`}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(i)}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              aria-label="Remove row"
              data-ocid={`memberships.comparison_remove_button.${i + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p
          className="text-xs text-muted-foreground text-center py-4"
          data-ocid="memberships.comparison_empty_state"
        >
          No rows yet. Add one below.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-xs uppercase tracking-widest gap-1.5"
          data-ocid="memberships.comparison_add_row_button"
        >
          <Plus className="w-3.5 h-3.5" /> Add Row
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={setComparisonRows.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs px-6"
          data-ocid="memberships.comparison_save_button"
        >
          {setComparisonRows.isPending ? "Saving…" : "Save Comparison Table"}
        </Button>
      </div>
    </div>
  );
}

export function MembershipsTab() {
  const { actor, isFetching } = useActor(createActor);

  const { data: planConfigs, isLoading: configsLoading } = useGetPlanConfigs();
  const setPlanConfigs = useSetPlanConfigs();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin.users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !isFetching,
  });

  const activeMemberships = users
    .filter((u) => u.membershipStatus === MembershipStatus.active)
    .map((u) => ({ user: u, status: MembershipStatus.active }));

  const [draft, setDraft] = useState<PlanConfigs | null>(null);

  // Sync draft from loaded data (only on first load)
  useEffect(() => {
    if (planConfigs && draft === null) {
      setDraft(planConfigs);
    }
  }, [planConfigs, draft]);

  async function handleSave() {
    if (!draft) return;
    try {
      await setPlanConfigs.mutateAsync(draft);
      toast.success("Membership plans saved successfully.");
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to save plans.");
    }
  }

  if (configsLoading || usersLoading || draft === null) {
    return (
      <div className="space-y-4" data-ocid="memberships.loading_state">
        <Skeleton className="h-60 rounded-xl" />
        <Skeleton className="h-60 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="memberships.section">
      {/* Plan Editors */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Membership Plans
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <PlanEditor
            label="Monthly Plan"
            ocidPrefix="memberships.monthly"
            plan={draft.monthly}
            onChange={(updated) =>
              setDraft((prev) => (prev ? { ...prev, monthly: updated } : prev))
            }
          />
          <PlanEditor
            label="Annual Plan"
            ocidPrefix="memberships.annual"
            plan={draft.annual}
            onChange={(updated) =>
              setDraft((prev) => (prev ? { ...prev, annual: updated } : prev))
            }
          />
        </div>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Changes apply live to the customer-facing membership page.
          </p>
          <Button
            type="button"
            onClick={handleSave}
            disabled={setPlanConfigs.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs px-6"
            data-ocid="memberships.save_all_button"
          >
            {setPlanConfigs.isPending ? "Saving…" : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* Active Memberships */}
      {/* Comparison Table Editor */}
      <ComparisonTableEditor />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Active Members ({activeMemberships.length})
          </h3>
        </div>
        {activeMemberships.length === 0 ? (
          <div
            className="py-10 text-center text-muted-foreground text-sm"
            data-ocid="memberships.empty_state"
          >
            No active memberships.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Plan
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activeMemberships.map(({ user, status }, i) => (
                <tr
                  key={user.principal.toText()}
                  className={cn(
                    "border-b border-border last:border-0",
                    i % 2 === 0 ? "bg-card" : "bg-secondary/20",
                  )}
                  data-ocid={`memberships.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground truncate">
                      {user.displayName || "—"}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {user.principal.toText().slice(0, 14)}…
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground text-xs">
                    Active Member
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        statusColor(status),
                      )}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
