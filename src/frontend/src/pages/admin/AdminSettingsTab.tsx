import {
  AdminRole,
  type CeoProfile,
  ExternalBlob,
  createActor,
} from "@/backend";
import { PrincipalDisplay } from "@/components/PrincipalDisplay";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddAdmin,
  useAdminSetAnalyticsSettings,
  useAdminSetSiteStats,
  useAnalyticsSettings,
  useAssignRole,
  useGetCeoProfile,
  useGetSiteStats,
  useListAdminsWithRoles,
  useListVehicles,
  useRemoveAdmin,
  useSetCeoProfile,
  useTransferOwnership,
} from "@/hooks/useBackend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@dfinity/principal";
import {
  AlertCircle,
  ArrowRightLeft,
  BarChart2,
  BarChart3,
  BookmarkIcon,
  Camera,
  CreditCard,
  ExternalLink,
  Info,
  Loader2,
  Shield,
  ShieldCheck,
  User,
  UserMinus,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ROLE_DESCRIPTIONS: Record<string, string> = {
  owner: "Full access — roles, ownership transfer, all settings",
  manager: "Fleet, bookings, pricing, audit log",
  support: "View bookings and users only",
  viewer: "Read-only dashboard access",
};

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    owner: "bg-primary/20 text-primary border-primary/40",
    manager: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    support: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    viewer: "bg-secondary text-muted-foreground border-border",
  };
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors[role] ?? colors.viewer}`}
    >
      {role}
    </span>
  );
}

function extractInstagramHandle(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      const path = url.pathname.replace(/^\/+/, "");
      const handle = path.split("/")[0];
      return handle || "";
    } catch {
      return "";
    }
  }
  return raw.replace(/^@/, "");
}

export function AdminSettingsTab({
  currentRole,
}: { currentRole?: string | null }) {
  const { actor } = useActor(createActor);
  const [newAdmin, setNewAdmin] = useState("");
  const [removeTarget, setRemoveTarget] = useState<{
    principal: string;
    role: string;
  } | null>(null);
  const [transferTarget, setTransferTarget] = useState("");
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [assignPrincipal, setAssignPrincipal] = useState("");
  const [assignRole, setAssignRole] = useState<AdminRole>(AdminRole.viewer);

  const assignRoleMutation = useAssignRole();
  const { data: adminList = [] } = useListAdminsWithRoles();
  const transferOwnership = useTransferOwnership();

  const grantAdmin = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();

  const myPrincipal = actor
    ? ((
        actor as unknown as { principal?: { toText: () => string } }
      ).principal?.toText?.() ?? null)
    : null;

  const { data: ceoProfile } = useGetCeoProfile();
  const setCeoProfile = useSetCeoProfile();

  // Site Stats
  const { data: siteStats } = useGetSiteStats();
  const { data: liveVehicles } = useListVehicles();
  const setStatsMutation = useAdminSetSiteStats();
  const [statsSatisfiedClients, setStatsSatisfiedClients] = useState("");
  const [statsConciergeSupport, setStatsConciergeSupport] = useState("");
  const [statsFiveStarReviews, setStatsFiveStarReviews] = useState("");
  const [ga4Id, setGa4Id] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [tiktokPixelId, setTiktokPixelId] = useState("");

  const { data: analyticsSettings } = useAnalyticsSettings();
  const setAnalyticsMutation = useAdminSetAnalyticsSettings();

  useEffect(() => {
    if (siteStats) {
      setStatsSatisfiedClients(siteStats.satisfiedClients);
      setStatsConciergeSupport(siteStats.conciergeSupport);
      setStatsFiveStarReviews(siteStats.fiveStarReviews);
    }
  }, [siteStats]);

  const [ceoName, setCeoName] = useState("");
  const [ceoHandle, setCeoHandle] = useState("");
  const [ceoTitle, setCeoTitle] = useState("");
  const [ceoDesc, setCeoDesc] = useState("");
  const [ceoPhotoPreview, setCeoPhotoPreview] = useState<string | null>(null);
  const [ceoStagedFile, setCeoStagedFile] = useState<File | null>(null);
  const ceoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ceoProfile) {
      setCeoName(ceoProfile.name);
      setCeoHandle(extractInstagramHandle(ceoProfile.instagramHandle));
      setCeoTitle(ceoProfile.title);
      setCeoDesc(ceoProfile.description);
    }
  }, [ceoProfile]);

  useEffect(() => {
    if (analyticsSettings) {
      setGa4Id(analyticsSettings.ga4Id ?? "");
      setMetaPixelId(analyticsSettings.metaPixelId ?? "");
      setTiktokPixelId(analyticsSettings.tiktokPixelId ?? "");
    }
  }, [analyticsSettings]);

  function handleCeoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCeoStagedFile(file);
    const preview = URL.createObjectURL(file);
    setCeoPhotoPreview(preview);
  }

  async function handleSaveCeoProfile() {
    const currentPhotoUrl = ceoProfile?.photoUrl ?? "";
    if (ceoStagedFile) {
      if (!actor) {
        toast.error("Not connected");
        return;
      }
      try {
        const bytes = new Uint8Array(await ceoStagedFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        const backend = actor as unknown as {
          _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>;
          _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>;
        };
        const reference = await backend._uploadFile(blob);
        const downloaded = await backend._downloadFile(reference);
        const photoUrl = downloaded.getDirectURL();
        const profile: CeoProfile = {
          name: ceoName,
          instagramHandle: ceoHandle.replace(/^@/, ""),
          title: ceoTitle,
          description: ceoDesc,
          photoUrl,
        };
        setCeoProfile.mutate(profile, {
          onSuccess: () => {
            toast.success("CEO profile updated!");
            if (ceoPhotoPreview) URL.revokeObjectURL(ceoPhotoPreview);
            setCeoStagedFile(null);
            setCeoPhotoPreview(null);
          },
          onError: (e) => toast.error((e as Error).message),
        });
      } catch (e) {
        toast.error((e as Error).message);
      }
    } else {
      const profile: CeoProfile = {
        name: ceoName,
        instagramHandle: ceoHandle.replace(/^@/, ""),
        title: ceoTitle,
        description: ceoDesc,
        photoUrl: currentPhotoUrl,
      };
      setCeoProfile.mutate(profile, {
        onSuccess: () => toast.success("CEO profile updated!"),
        onError: (e) => toast.error((e as Error).message),
      });
    }
  }

  return (
    <div className="space-y-6 max-w-lg" data-ocid="settings.section">
      {/* CEO Profile */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-5"
        data-ocid="settings.ceo_profile_section"
      >
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            CEO Profile
          </h3>
        </div>

        {/* Photo preview + upload */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary/40 bg-secondary flex items-center justify-center shadow-luxury cursor-pointer relative group"
            onClick={() => ceoFileInputRef.current?.click()}
            aria-label="Upload CEO profile photo"
            data-ocid="settings.ceo_photo_preview"
          >
            {ceoPhotoPreview || ceoProfile?.photoUrl ? (
              <img
                src={ceoPhotoPreview ?? ceoProfile?.photoUrl}
                alt="CEO profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-10 h-10 text-muted-foreground" />
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>
          <input
            ref={ceoFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCeoFileChange}
            data-ocid="settings.ceo_photo_input"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => ceoFileInputRef.current?.click()}
            className="uppercase tracking-widest text-xs border-primary/40 text-primary hover:bg-primary/10"
            data-ocid="settings.ceo_upload_button"
          >
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            {ceoStagedFile ? "Change Photo" : "Upload Photo"}
          </Button>
          {ceoStagedFile && (
            <p className="text-xs text-primary">
              Preview ready — save to apply
            </p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Name
            </Label>
            <Input
              value={ceoName}
              onChange={(e) => setCeoName(e.target.value)}
              placeholder="Full name or display name"
              data-ocid="settings.ceo_name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Instagram Handle
            </Label>
            <Input
              value={ceoHandle}
              onChange={(e) => setCeoHandle(e.target.value)}
              placeholder="@handle"
              data-ocid="settings.ceo_handle_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Title
            </Label>
            <Input
              value={ceoTitle}
              onChange={(e) => setCeoTitle(e.target.value)}
              placeholder="CEO"
              data-ocid="settings.ceo_title_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={ceoDesc}
              onChange={(e) => setCeoDesc(e.target.value)}
              placeholder="Brief bio shown on the homepage..."
              rows={3}
              data-ocid="settings.ceo_desc_textarea"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSaveCeoProfile}
          disabled={setCeoProfile.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs w-full sm:w-auto"
          data-ocid="settings.ceo_save_button"
        >
          {setCeoProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
            </>
          ) : (
            "Save CEO Profile"
          )}
        </Button>
      </div>

      {/* Site Stats */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-5"
        data-ocid="settings.site_stats_section"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Site Stats
          </h3>
        </div>

        {/* Read-only: Elite Vehicles */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            Elite Vehicles (live count)
          </Label>
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/40 border border-border rounded-md">
            <span className="font-mono text-sm text-foreground">
              {liveVehicles
                ? liveVehicles.length.toString()
                : siteStats
                  ? siteStats.eliteVehicles.toString()
                  : "--"}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              — derived from your fleet, not editable
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Satisfied Clients
            </Label>
            <Input
              value={statsSatisfiedClients}
              onChange={(e) => setStatsSatisfiedClients(e.target.value)}
              placeholder="e.g. 100+"
              data-ocid="settings.stats_satisfied_clients_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Concierge Support
            </Label>
            <Input
              value={statsConciergeSupport}
              onChange={(e) => setStatsConciergeSupport(e.target.value)}
              placeholder="e.g. 24/7"
              data-ocid="settings.stats_concierge_support_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              5-Star Reviews
            </Label>
            <Input
              value={statsFiveStarReviews}
              onChange={(e) => setStatsFiveStarReviews(e.target.value)}
              placeholder="e.g. 100%"
              data-ocid="settings.stats_five_star_input"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={() =>
            setStatsMutation.mutate(
              {
                satisfiedClients: statsSatisfiedClients,
                conciergeSupport: statsConciergeSupport,
                fiveStarReviews: statsFiveStarReviews,
              },
              {
                onSuccess: () => toast.success("Site stats updated!"),
                onError: (e) => toast.error((e as Error).message),
              },
            )
          }
          disabled={setStatsMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs w-full sm:w-auto"
          data-ocid="settings.stats_save_button"
        >
          {setStatsMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
            </>
          ) : (
            "Save Stats"
          )}
        </Button>
      </div>

      {/* Remove admin confirmation modal */}
      <Dialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
      >
        <DialogContent data-ocid="settings.remove_admin_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Remove this admin?
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <span className="block">
                <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded break-all">
                  {removeTarget?.principal}
                </code>{" "}
                will no longer have admin access.
              </span>
              <span className="block text-muted-foreground">
                You can always re-add them later.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveTarget(null)}
              data-ocid="settings.remove_admin_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!removeTarget) return;
                let parsed: Principal;
                try {
                  parsed = Principal.fromText(removeTarget.principal.trim());
                } catch {
                  toast.error("Invalid principal");
                  return;
                }
                removeAdminMutation.mutate(parsed, {
                  onSuccess: () => {
                    toast.success("Admin removed");
                    setRemoveTarget(null);
                  },
                  onError: (e) => toast.error((e as Error).message),
                });
              }}
              disabled={removeAdminMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="settings.remove_admin_confirm_button"
            >
              {removeAdminMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer ownership confirmation modal */}
      <Dialog
        open={showTransferConfirm}
        onOpenChange={(o) => !o && setShowTransferConfirm(false)}
      >
        <DialogContent data-ocid="settings.transfer_dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Transfer Ownership
            </DialogTitle>
            <DialogDescription>
              You are about to transfer full ownership to{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded break-all">
                {transferTarget}
              </code>
              . You will lose Owner privileges after this action. This requires
              confirmation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTransferConfirm(false)}
              data-ocid="settings.transfer_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                transferOwnership.mutate(transferTarget, {
                  onSuccess: () => {
                    toast.success("Ownership transferred");
                    setTransferTarget("");
                    setShowTransferConfirm(false);
                  },
                  onError: (e) => toast.error((e as Error).message),
                });
              }}
              disabled={transferOwnership.isPending}
              data-ocid="settings.transfer_confirm_button"
            >
              {transferOwnership.isPending
                ? "Transferring..."
                : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Admin URL Reminder */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
        <BookmarkIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-foreground leading-relaxed">
          <strong className="text-primary uppercase tracking-widest">
            Quick Access:
          </strong>{" "}
          The admin dashboard is accessible at{" "}
          <code className="font-mono bg-card border border-border rounded px-1 py-0.5">
            /admin
          </code>
          {" - "} bookmark this URL for quick access.
        </p>
      </div>

      {/* Payment & Payout Setup */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-4"
        data-ocid="settings.payment_section"
      >
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Payment &amp; Payout Setup
          </h3>
        </div>

        <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">
              Connect your bank account via Stripe to start receiving payments.
            </strong>{" "}
            Until your Stripe account is linked, customer payments will not be
            deposited into your bank account.
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          To receive customer payments into your bank account, you must connect
          your Stripe account. Click the button below to access your Stripe
          Dashboard where you can add your bank account and configure payouts.
          You will also find transaction history, payout reports, and any failed
          payment logs there.
        </p>

        <div className="space-y-2">
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Stripe Checkout enabled
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Recurring subscriptions enabled
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
              Bank payout requires Stripe onboarding
            </span>
          </div>
        </div>

        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="settings.stripe_dashboard_button"
        >
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs w-full sm:w-auto"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Open Stripe Dashboard
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </a>

        <p className="text-xs text-muted-foreground">
          Need help? Visit{" "}
          <a
            href="https://support.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            support.stripe.com
          </a>{" "}
          to set up payouts, manage your merchant account, or resolve payment
          issues.
        </p>
      </div>

      {/* Manage Admins */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-5"
        data-ocid="settings.manage_admins_section"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Manage Admins
          </h3>
        </div>

        {/* Add Admin */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            Add Admin
          </Label>
          <div className="flex gap-2">
            <Input
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              placeholder="Paste principal ID…"
              className="font-mono text-xs flex-1"
              data-ocid="settings.add_admin_input"
            />
            <Button
              type="button"
              onClick={() => {
                let parsed: Principal;
                try {
                  parsed = Principal.fromText(newAdmin.trim());
                } catch {
                  toast.error("Invalid principal format");
                  return;
                }
                grantAdmin.mutate(parsed, {
                  onSuccess: () => {
                    toast.success("Admin role granted");
                    setNewAdmin("");
                  },
                  onError: (e) => toast.error((e as Error).message),
                });
              }}
              disabled={!newAdmin.trim() || grantAdmin.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs shrink-0"
              data-ocid="settings.add_admin_button"
            >
              {grantAdmin.isPending ? (
                "Adding…"
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-1" /> Add
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a valid Internet Identity principal to give someone admin
            access.
          </p>
        </div>

        {/* Admin list */}
        {adminList.length > 0 ? (
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {adminList.map((entry, i) => {
              const principalText = entry.principal.toText();
              const isSelf = myPrincipal === principalText;
              return (
                <div
                  key={principalText}
                  className="flex items-center gap-3 px-4 py-3 bg-background border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                  data-ocid={`settings.admin_entry.${i + 1}`}
                >
                  {/* Role badge */}
                  <RoleBadge role={entry.role} />
                  {/* Principal */}
                  <div className="flex-1 min-w-0">
                    <PrincipalDisplay principal={principalText} />
                  </div>
                  {/* You badge */}
                  {isSelf && (
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-secondary text-muted-foreground border-border">
                      You
                    </span>
                  )}
                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSelf}
                    onClick={() =>
                      setRemoveTarget({
                        principal: principalText,
                        role: entry.role,
                      })
                    }
                    className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Remove ${principalText}`}
                    data-ocid={`settings.remove_admin_button.${i + 1}`}
                  >
                    <UserMinus className="w-4 h-4" />
                    <span className="ml-1 text-xs">Remove</span>
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p
            className="text-xs text-muted-foreground italic"
            data-ocid="settings.admin_list_empty"
          >
            No admins added yet.
          </p>
        )}
      </div>

      {/* Assign Role */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-4"
        data-ocid="settings.assign_role_section"
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Assign Role
          </h3>
        </div>
        <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-3">
          {(
            [
              [
                "owner",
                "Owner",
                "Full access — roles, ownership transfer, all settings",
              ],
              ["manager", "Manager", "Fleet, bookings, pricing, audit log"],
              ["support", "Support", "View bookings and users only"],
              ["viewer", "Viewer", "Read-only dashboard access"],
            ] as [string, string, string][]
          ).map(([role, _label, desc]) => (
            <div key={role} className="flex items-start gap-2">
              <RoleBadge role={role} />
              <span className="text-xs text-muted-foreground leading-relaxed">
                <Info className="w-3 h-3 inline mr-0.5 text-primary/60" />
                {desc}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest">Principal</Label>
          <Input
            value={assignPrincipal}
            onChange={(e) => setAssignPrincipal(e.target.value)}
            placeholder="aaaaa-aa (principal text)"
            className="font-mono text-xs"
            data-ocid="settings.assign_role_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest">Role</Label>
          <Select
            value={assignRole}
            onValueChange={(v) => setAssignRole(v as AdminRole)}
          >
            <SelectTrigger data-ocid="settings.assign_role_select">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AdminRole).map((r) => (
                <SelectItem key={r} value={r}>
                  <span className="capitalize">{r}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    — {ROLE_DESCRIPTIONS[r]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={() =>
            assignRoleMutation.mutate(
              { principal: assignPrincipal, role: assignRole },
              {
                onSuccess: () => {
                  toast.success(`Role '${assignRole}' assigned`);
                  setAssignPrincipal("");
                },
                onError: (e) => toast.error((e as Error).message),
              },
            )
          }
          disabled={!assignPrincipal.trim() || assignRoleMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
          data-ocid="settings.assign_role_button"
        >
          {assignRoleMutation.isPending ? (
            "Assigning..."
          ) : (
            <>
              <Shield className="w-4 h-4 mr-1" /> Assign Role
            </>
          )}
        </Button>
      </div>

      {/* Transfer Ownership — owner only */}
      {currentRole === "owner" && (
        <div
          className="bg-card border border-destructive/30 rounded-xl p-6 space-y-4"
          data-ocid="settings.transfer_section"
        >
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightLeft className="w-5 h-5 text-destructive" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-destructive">
              Transfer Ownership
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Permanently transfer Owner privileges to another principal. You will
            lose Owner access after this action. A confirmation dialog will
            appear before any changes are made.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">
              New Owner Principal
            </Label>
            <Input
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              placeholder="aaaaa-aa (principal text)"
              className="font-mono text-xs"
              data-ocid="settings.transfer_owner_input"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowTransferConfirm(true)}
            disabled={!transferTarget.trim()}
            className="uppercase tracking-widest text-xs"
            data-ocid="settings.transfer_owner_button"
          >
            <ArrowRightLeft className="w-4 h-4 mr-1" /> Transfer Ownership
          </Button>
        </div>
      )}

      {/* Analytics Settings */}
      <div
        className="bg-card border border-border rounded-xl p-6 space-y-5"
        data-ocid="settings.analytics_section"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Analytics &amp; Tracking
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="ga4-id-input"
              className="block text-sm font-medium text-foreground mb-1"
            >
              GA4 Measurement ID
            </label>
            <input
              id="ga4-id-input"
              type="text"
              className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="G-XXXXXXXXXX"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="meta-pixel-id-input"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Meta Pixel ID
            </label>
            <input
              id="meta-pixel-id-input"
              type="text"
              className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="000000000000000"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="tiktok-pixel-id-input"
              className="block text-sm font-medium text-foreground mb-1"
            >
              TikTok Pixel ID
            </label>
            <input
              id="tiktok-pixel-id-input"
              type="text"
              className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="CXXXXXXXXXXXXXXXXX"
              value={tiktokPixelId}
              onChange={(e) => setTiktokPixelId(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            onClick={() => {
              setAnalyticsMutation.mutate(
                { ga4Id, metaPixelId, tiktokPixelId },
                {
                  onSuccess: () => toast.success("Analytics settings saved"),
                  onError: () =>
                    toast.error("Failed to save analytics settings"),
                },
              );
            }}
          >
            Save Analytics Settings
          </button>
        </div>
      </div>

      <div className="bg-secondary/30 border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Security note:</strong> Admin
          principals have full access to fleet management, booking controls,
          user data, and pricing. Only grant access to trusted individuals.
        </p>
      </div>
    </div>
  );
}
