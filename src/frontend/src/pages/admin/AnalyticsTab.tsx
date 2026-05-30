import { createActor } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CalendarCheck, DollarSign, Users } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-body">
          {label}
        </p>
        <p className="text-2xl font-display font-bold text-foreground mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

export function AnalyticsTab({
  onNavigateTab,
}: {
  onNavigateTab?: (tab: string) => void;
}) {
  const { actor, isFetching } = useActor(createActor);
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: allBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin.bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllBookings();
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading || bookingsLoading) {
    return (
      <div className="space-y-6" data-ocid="analytics.loading_state">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["a1", "a2", "a3", "a4"].map((k) => (
            <Skeleton key={k} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const totalRevenue = analytics
    ? `${Number(analytics.totalRevenue).toLocaleString()}`
    : "$0";
  const totalBookings = allBookings?.length.toString() ?? "0";
  const utilization = analytics
    ? `${analytics.fleetUtilizationPercent.toFixed(1)}%`
    : "0%";
  const activeUsers = analytics
    ? Number(analytics.activeUserCount).toString()
    : "0";
  const vehicleBreakdown = analytics?.bookingCountByVehicle ?? [];

  const maxCount = vehicleBreakdown.reduce(
    (m, [, c]) => Math.max(m, Number(c)),
    1,
  );

  return (
    <div className="space-y-6" data-ocid="analytics.section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          icon={CalendarCheck}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Fleet Utilization"
          value={utilization}
          icon={BarChart3}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={Users}
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-6">
          Bookings by Vehicle
        </h3>
        {vehicleBreakdown.length === 0 ? (
          <p className="text-muted-foreground text-sm">No booking data yet.</p>
        ) : (
          <div className="space-y-4">
            {vehicleBreakdown.map(([name, count]) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium truncate">
                    {name}
                  </span>
                  <span className="text-muted-foreground ml-4">
                    {count.toString()} bookings
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(Number(count) / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab?.("fleet")}
            className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest"
            data-ocid="analytics.fleet_action_button"
          >
            Manage Fleet
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("bookings")}
            className="px-4 py-2 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors uppercase tracking-widest"
            data-ocid="analytics.bookings_action_button"
          >
            Review Bookings
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("memberships")}
            className="px-4 py-2 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors uppercase tracking-widest"
            data-ocid="analytics.pricing_action_button"
          >
            Update Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
