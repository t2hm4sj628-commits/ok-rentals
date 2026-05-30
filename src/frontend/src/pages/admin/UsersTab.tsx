import { createActor } from "@/backend";
import type { UserProfile } from "@/backend";
import { MembershipStatus } from "@/backend";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(s: string, n = 14) {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export function UsersTab() {
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery<UserProfile[]>({
    queryKey: ["admin.users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !isFetching,
  });

  const filtered = users.filter(
    (u) =>
      search === "" ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="users.loading_state">
        {["u1", "u2", "u3", "u4", "u5"].map((k) => (
          <Skeleton key={k} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="users.section">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-9"
          data-ocid="users.search_input"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Principal
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Joined
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Membership
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr
                key={u.principal.toText()}
                className={cn(
                  "border-b border-border last:border-0",
                  i % 2 === 0 ? "bg-card" : "bg-secondary/20",
                )}
                data-ocid={`users.item.${i + 1}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[140px]">
                  <span title={u.principal.toText()}>
                    {truncate(u.principal.toText(), 16)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {u.displayName || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.email || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {u.membershipStatus ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        u.membershipStatus === MembershipStatus.active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : u.membershipStatus === MembershipStatus.expired
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {u.membershipStatus}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="users.empty_state"
          >
            {search
              ? "No users match your search."
              : "No registered users yet."}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((u, i) => (
          <div
            key={u.principal.toText()}
            className="bg-card border border-border rounded-xl p-4 space-y-1"
            data-ocid={`users.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">
                {u.displayName || "—"}
              </p>
              {u.membershipStatus && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    u.membershipStatus === MembershipStatus.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {u.membershipStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {u.email || "No email"}
            </p>
            <p className="font-mono text-xs text-muted-foreground break-all">
              {u.principal.toText()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(u.createdAt)}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="py-10 text-center text-muted-foreground text-sm"
            data-ocid="users.empty_state"
          >
            {search ? "No users match your search." : "No users yet."}
          </div>
        )}
      </div>
    </div>
  );
}
