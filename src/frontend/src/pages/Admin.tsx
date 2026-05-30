import { createActor } from "@/backend";
import { PrincipalDisplay } from "@/components/PrincipalDisplay";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useListAdminsWithRoles } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { BlogTab } from "@/pages/admin/BlogTab";
import { EmailListTab } from "@/pages/admin/EmailListTab";
import { ErrorLogsTab } from "@/pages/admin/ErrorLogsTab";
import { IDVerificationTab } from "@/pages/admin/IDVerificationTab";
import { PolicyTab } from "@/pages/admin/PolicyTab";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  CalendarCheck,
  Car,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Crown,
  FileText,
  LayoutDashboard,
  Lock,
  Mail,
  Settings,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AdminSettingsTab } from "./admin/AdminSettingsTab";
import { AnalyticsTab } from "./admin/AnalyticsTab";
import { AuditLogTab } from "./admin/AuditLogTab";
import { BookingsTab } from "./admin/BookingsTab";
import { FleetTab } from "./admin/FleetTab";
import { MembershipsTab } from "./admin/MembershipsTab";
import { UsersTab } from "./admin/UsersTab";

function AccessDeniedScreen({
  principal,
  onLogin,
}: {
  principal: string | null;
  onLogin: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      data-ocid="admin.access_denied"
    >
      <div className="w-full max-w-lg space-y-8">
        {/* Icon + Heading */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm">
            Your account does not have administrator privileges.
          </p>
        </div>

        {/* Principal ID block */}
        <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Your Principal ID
            </span>
          </div>

          {principal ? (
            <>
              <div
                className="rounded-lg border border-border bg-muted/50 px-4 py-3"
                data-ocid="admin.principal_id_box"
              >
                <PrincipalDisplay principal={principal} />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-center space-y-3">
              <p className="text-muted-foreground text-sm">
                You must be logged in to see your Principal ID.
              </p>
              <Button
                type="button"
                onClick={onLogin}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
                data-ocid="admin.login_to_see_principal_button"
              >
                Sign In with Internet Identity
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-lg bg-muted/30 border border-border px-4 py-3 space-y-1.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                Share this ID
              </span>{" "}
              with your administrator to be granted access.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                If you are the owner,
              </span>{" "}
              log in as an existing admin and paste this ID into the{" "}
              <span className="font-mono text-primary">
                Admin Settings → Access Control
              </span>{" "}
              tab to grant yourself access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ALL_TABS = [
  {
    id: "analytics",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "manager", "support", "viewer", null],
  },
  { id: "fleet", label: "Fleet", icon: Car, roles: ["owner", "manager", null] },
  {
    id: "bookings",
    label: "Bookings",
    icon: CalendarCheck,
    roles: ["owner", "manager", "support", null],
  },
  {
    id: "memberships",
    label: "Memberships",
    icon: CreditCard,
    roles: ["owner", "manager", null],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    roles: ["owner", "manager", "support", null],
  },
  {
    id: "blog",
    label: "Blog",
    icon: BookOpen,
    roles: ["owner", "manager"],
  },
  {
    id: "policy",
    label: "Policies",
    icon: FileText,
    roles: ["owner", "manager"],
  },
  {
    id: "idverification",
    label: "ID Verification",
    icon: ShieldCheck,
    roles: ["owner", "manager"],
  },
  {
    id: "emaillist",
    label: "Email List",
    icon: Mail,
    roles: ["owner", "manager"],
  },
  {
    id: "errorlogs",
    label: "Error Logs",
    icon: AlertCircle,
    roles: ["owner", "manager"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    roles: ["owner", "manager", null],
  },
  {
    id: "auditlog",
    label: "Audit Log",
    icon: ClipboardList,
    roles: ["owner", "manager"],
  },
] as const;

type TabId = (typeof ALL_TABS)[number]["id"];

type AdminRoleStr = "owner" | "manager" | "support" | "viewer";

export function AdminPage() {
  const {
    isAuthenticated,
    principal,
    isLoading: authLoading,
    login,
  } = useAuth();
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<TabId>("analytics");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  const { data: isAdmin, isLoading: adminLoading } = useQuery<boolean>({
    queryKey: ["isAdmin", principal?.toText()],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isAdmin(principal);
    },
    enabled: !!actor && !actorLoading && !!principal,
  });

  const { data: myRole } = useListAdminsWithRoles();
  const currentRole: AdminRoleStr | null =
    (myRole?.find((e) => e.principal.toText() === principal?.toText())
      ?.role as AdminRoleStr | null) ?? null;

  const visibleTabs = ALL_TABS.filter((t) =>
    (t.roles as ReadonlyArray<string | null>).includes(currentRole),
  );

  const isChecking = authLoading || actorLoading || adminLoading;

  if (isChecking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="admin.loading_state"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-body tracking-widest uppercase text-sm">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="admin.error_state"
      >
        <div className="text-center space-y-6 max-w-sm px-4">
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in with Internet Identity to access the admin panel.
            </p>
          </div>
          <Button
            onClick={login}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
            data-ocid="admin.login_button"
          >
            Sign In with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AccessDeniedScreen
        principal={principal?.toText() ?? null}
        onLogin={login}
      />
    );
  }

  const ActiveTab = ALL_TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.page">
      {/* Admin Header Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Crown className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-bold tracking-widest uppercase text-primary">
            Admin Console
          </span>
          <div className="ml-auto flex items-center gap-2">
            {currentRole && (
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  currentRole === "owner" &&
                    "bg-primary/20 text-primary border-primary/40",
                  currentRole === "manager" &&
                    "bg-blue-500/20 text-blue-400 border-blue-500/40",
                  currentRole === "support" &&
                    "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
                  currentRole === "viewer" &&
                    "bg-secondary text-muted-foreground border-border",
                )}
              >
                <Shield className="w-2.5 h-2.5 inline mr-1" />
                {currentRole}
              </span>
            )}
            <PrincipalDisplay
              principal={principal?.toText() ?? ""}
              className="max-w-[220px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-4 relative">
          <button
            type="button"
            onClick={() => setMobileTabOpen(!mobileTabOpen)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 text-sm font-medium"
            data-ocid="admin.mobile_tab_toggle"
          >
            <span className="flex items-center gap-2">
              {ActiveTab && <ActiveTab.icon className="w-4 h-4 text-primary" />}
              {ActiveTab?.label}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                mobileTabOpen && "rotate-180",
              )}
            />
          </button>
          {mobileTabOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileTabOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                  data-ocid={`admin.mobile_tab_${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Tab Navigation */}
        <div
          className="hidden md:flex items-center gap-1 mb-6 border-b border-border pb-1"
          data-ocid="admin.tabs"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
              data-ocid={`admin.tab_${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "analytics" && (
            <AnalyticsTab onNavigateTab={(tab) => setActiveTab(tab as TabId)} />
          )}
          {activeTab === "fleet" && <FleetTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "memberships" && <MembershipsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "policy" && <PolicyTab />}
          {activeTab === "idverification" && <IDVerificationTab />}
          {activeTab === "emaillist" && <EmailListTab />}
          {activeTab === "settings" && (
            <AdminSettingsTab currentRole={currentRole} />
          )}
          {activeTab === "auditlog" && <AuditLogTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "errorlogs" && (
            <ErrorLogsTab currentRole={currentRole} />
          )}
        </div>
      </div>
    </div>
  );
}
