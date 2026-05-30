import {
  type EmailSubscriber,
  type IDVerification,
  type Message,
  type Review,
  type TripPhoto,
  createActor,
} from "@/backend";
import type {
  AdminEntry,
  AdminRole,
  AnalyticsSettings,
  AuditLog,
  BlogPost,
  Booking,
  BookingId,
  BookingStatus,
  CeoProfile,
  ErrorLogEntry,
  MembershipPlan,
  MembershipStatus,
  PaymentMethod,
  UserId,
  UserMembership,
  UserProfile,
  Vehicle,
  VehicleId,
  VehicleInput,
} from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import type { ComparisonRow } from "@/types";
import type { MembershipPlanConfig, PlanConfigs } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useActorInstance() {
  return useActor(createActor);
}

// ─── Vehicle Queries ───────────────────────────────────────────────

export function useListVehicles() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVehicles();
    },
    enabled: !isFetching,
  });
}

export function useGetVehicle(id: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Vehicle | null>({
    queryKey: ["vehicle", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getVehicle(id);
    },
    enabled: !isFetching && id !== null,
  });
}

export function useCheckAvailability(
  vehicleId: bigint | null,
  startDate: bigint | null,
  endDate: bigint | null,
) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<boolean>({
    queryKey: [
      "availability",
      vehicleId?.toString(),
      startDate?.toString(),
      endDate?.toString(),
    ],
    queryFn: async () => {
      if (
        !actor ||
        vehicleId === null ||
        startDate === null ||
        endDate === null
      )
        return false;
      return actor.checkVehicleAvailability(vehicleId, startDate, endDate);
    },
    enabled:
      !isFetching &&
      vehicleId !== null &&
      startDate !== null &&
      endDate !== null,
  });
}

// ─── Booking Mutations ────────────────────────────────────────────

export function useCreateBooking() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    Booking,
    Error,
    {
      vehicleId: bigint;
      startDate: bigint;
      endDate: bigint;
      paymentMethod: PaymentMethod;
      cryptoTxRef?: string;
      stripeSessionId?: string;
    }
  >({
    mutationFn: async ({
      vehicleId,
      startDate,
      endDate,
      paymentMethod,
      cryptoTxRef,
      stripeSessionId,
    }) => {
      if (!actor) throw new Error("Not connected");
      // cryptoTxRef and stripeSessionId are captured for frontend reference;
      // backend createBooking accepts the core booking fields.
      void (cryptoTxRef ?? null);
      void (stripeSessionId ?? null);
      const result = await actor.createBooking(
        vehicleId,
        startDate,
        endDate,
        paymentMethod,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useMyBookings() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !isFetching,
  });
}

export function useCancelBooking() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useGetBookingById(id: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Booking | null>({
    queryKey: ["booking", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBookingById(id);
    },
    enabled: !isFetching && id !== null,
  });
}

// ─── Membership ───────────────────────────────────────────────────

export function useMyMembership() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<UserMembership | null>({
    queryKey: ["membership"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyMembership();
    },
    enabled: !isFetching,
  });
}

export function useSubscribeMembership() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<UserMembership, Error, MembershipPlan>({
    mutationFn: async (plan) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.subscribeMembership(plan);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership"] });
    },
  });
}

export function useCancelMembership() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership"] });
    },
  });
}

export function useUpdateMembershipStatus() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userId: UserId; status: MembershipStatus }>(
    {
      mutationFn: async ({ userId, status }) => {
        if (!actor) throw new Error("Not connected");
        const result = await actor.updateMembershipStatus(userId, status);
        if (result.__kind__ === "err") throw new Error(result.err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["membership"] });
      },
    },
  );
}

export function useMembershipPricing() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{ monthly: number; annual: number }>({
    queryKey: ["membershipPricing"],
    queryFn: async () => {
      if (!actor) return { monthly: 10000, annual: 100000 };
      return actor.getMembershipPricing();
    },
    enabled: !isFetching,
  });
}

export function useAdminSetMembershipPricing() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { monthly: number; annual: number }>({
    mutationFn: async ({ monthly, annual }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSetMembershipPricing(monthly, annual);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipPricing"] });
    },
  });
}

// ─── User Profile ────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !isFetching,
  });
}

export function useRegisterProfile() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    UserProfile,
    Error,
    { displayName: string; email: string }
  >({
    mutationFn: async ({ displayName, email }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProfile(displayName, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    UserProfile | null,
    Error,
    { displayName: string; email: string }
  >({
    mutationFn: async ({ displayName, email }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProfile(displayName, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────

export function useAdminAllBookings() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Booking[]>({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllBookings();
    },
    enabled: !isFetching,
  });
}

export function useAdminUpdateBookingStatus() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    Booking,
    Error,
    { bookingId: BookingId; status: BookingStatus }
  >({
    mutationFn: async ({ bookingId, status }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminUpdateBookingStatus(bookingId, status);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useAdminAddVehicle() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<Vehicle, Error, VehicleInput>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminAddVehicle(data);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useAdminUpdateVehicle() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<Vehicle, Error, { id: VehicleId; data: VehicleInput }>({
    mutationFn: async ({ id, data }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminUpdateVehicle(id, data);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useAdminDeleteVehicle() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, VehicleId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminDeleteVehicle(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useAdminSetVehiclePhoto() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: VehicleId; imageUrl: string }>({
    mutationFn: async ({ id, imageUrl }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSetVehiclePhoto(id, imageUrl);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useAdminListUsers() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<UserProfile[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !isFetching,
  });
}

export function useAnalytics() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    activeUserCount: bigint;
    bookingCountByVehicle: Array<[string, bigint]>;
    fleetUtilizationPercent: number;
    totalRevenue: number;
  }>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor)
        return {
          activeUserCount: 0n,
          bookingCountByVehicle: [],
          fleetUtilizationPercent: 0,
          totalRevenue: 0,
        };
      return actor.getAnalytics();
    },
    enabled: !isFetching,
  });
}

export function useIsAdmin(principal: Principal | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<boolean>({
    queryKey: ["isAdmin", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isAdmin(principal);
    },
    enabled: !isFetching && principal !== null,
  });
}

export function useAddAdmin() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, Principal>({
    mutationFn: async (principal) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.addAdmin(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "adminsWithRoles"] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, Principal>({
    mutationFn: async (principal) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.removeAdmin(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "adminsWithRoles"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { principal: string; role: AdminRole }>({
    mutationFn: async ({ principal: p, role }) => {
      if (!actor) throw new Error("Not connected");
      const parsed = Principal.fromText(p.trim());
      const result = await actor.assignRole(parsed, role);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "adminsWithRoles"] });
    },
  });
}

export function useGetAdminRole(principal: Principal | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AdminRole | null>({
    queryKey: ["admin", "role", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getAdminRole(principal);
    },
    enabled: !isFetching && principal !== null,
  });
}

export function useTransferOwnership() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (newOwnerText) => {
      if (!actor) throw new Error("Not connected");
      const parsed = Principal.fromText(newOwnerText.trim());
      const result = await actor.transferOwnership(parsed);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "adminsWithRoles"] });
    },
  });
}

export function useGetAuditLog() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AuditLog[]>({
    queryKey: ["admin", "auditLog"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAuditLog();
      // Backend returns a discriminated union: { __kind__: "ok", ok: AuditLog[] } | { __kind__: "err", err: string }
      if (!result || typeof result !== "object") return [];
      if ("__kind__" in result) {
        if (result.__kind__ === "ok" && Array.isArray(result.ok))
          return result.ok;
        return [];
      }
      // Fallback: if backend returns plain array (future-proof)
      if (Array.isArray(result)) return result;
      return [];
    },
    enabled: !isFetching,
  });
}

export function useListAdminsWithRoles() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AdminEntry[]>({
    queryKey: ["admin", "adminsWithRoles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAdminsWithRoles();
    },
    enabled: !isFetching,
  });
}

export function useAdminSetOpenAIKey() {
  const { actor } = useActorInstance();
  return useMutation<void, Error, string>({
    mutationFn: async (key) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSetOpenAIKey(key);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
  });
}
// ─── Reviews ──────────────────────────────────────────────────────

export function useVehicleReviews(vehicleId: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Review[]>({
    queryKey: ["vehicleReviews", vehicleId?.toString()],
    queryFn: async () => {
      if (!actor || vehicleId === null) return [];
      return actor.getVehicleReviews(vehicleId);
    },
    enabled: !isFetching && vehicleId !== null,
  });
}

export function useAverageRating(vehicleId: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["averageRating", vehicleId?.toString()],
    queryFn: async () => {
      if (!actor || vehicleId === null) return 0n;
      return actor.getAverageRating(vehicleId);
    },
    enabled: !isFetching && vehicleId !== null,
  });
}

export function useSubmitReview() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    Review,
    Error,
    { vehicleId: bigint; bookingId: bigint; rating: bigint; comment: string }
  >({
    mutationFn: async ({ vehicleId, bookingId, rating, comment }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitReview(
        vehicleId,
        bookingId,
        rating,
        comment,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicleReviews", vars.vehicleId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["averageRating", vars.vehicleId.toString()],
      });
    },
  });
}

// ─── Messages ───────────────────────────────────────────────────────

export function useMessages(bookingId: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Message[]>({
    queryKey: ["messages", bookingId?.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return [];
      const result = await actor.getMessages(bookingId);
      if (!result || typeof result !== "object") return [];
      if ("__kind__" in result) {
        if (result.__kind__ === "ok" && Array.isArray(result.ok))
          return result.ok;
        return [];
      }
      if (Array.isArray(result)) return result;
      return [];
    },
    enabled: !isFetching && bookingId !== null,
    refetchInterval: 10000,
  });
}

export function useSendMessage() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<Message, Error, { bookingId: bigint; content: string }>({
    mutationFn: async ({ bookingId, content }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(bookingId, content);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", vars.bookingId.toString()],
      });
    },
  });
}

// ─── Trip Photos ────────────────────────────────────────────────────

export function useTripPhotos(bookingId: string | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<TripPhoto[]>({
    queryKey: ["tripPhotos", bookingId],
    queryFn: async () => {
      if (!actor || bookingId === null) return [];
      return actor.getTripPhotos(bookingId);
    },
    enabled: !isFetching && bookingId !== null,
  });
}

export function useAddTripPhoto() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    TripPhoto,
    Error,
    { bookingId: string; phase: string; photoId: string }
  >({
    mutationFn: async ({ bookingId, phase, photoId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.addTripPhoto(bookingId, phase, photoId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["tripPhotos", vars.bookingId],
      });
    },
  });
}

// ─── Chat / AI ─────────────────────────────────────────────────────

export function useAskChat() {
  const { actor } = useActorInstance();
  return useMutation<string, Error, { message: string; sessionId: string }>({
    mutationFn: async ({ message, sessionId }) => {
      if (!actor) throw new Error("Not connected");
      return actor.askChat(message, sessionId);
    },
  });
}

// ─── Blog ───────────────────────────────────────────────────────────

export function useBlogPosts() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedBlogPosts();
    },
    enabled: !isFetching,
  });
}

export function useBlogPost(slug: string) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      if (!actor || !slug) return null;
      return actor.getBlogPost(slug);
    },
    enabled: !isFetching && slug.length > 0,
  });
}

// ─── CEO Profile ──────────────────────────────────────────────────

export function useGetCeoProfile() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<CeoProfile>({
    queryKey: ["ceoProfile"],
    queryFn: async () => {
      if (!actor)
        return {
          name: "@_stannoodles",
          title: "CEO",
          instagramHandle: "_stannoodles",
          description:
            "Passionate about luxury automotive culture. Follow along for behind-the-scenes content, new arrivals, and exclusive member events.",
          photoUrl: "/assets/ceo-stan.jpeg",
        };
      return actor.getCeoProfile();
    },
    enabled: !isFetching,
  });
}

export function useSetCeoProfile() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, CeoProfile>({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Not connected");
      return actor.setCeoProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceoProfile"] });
    },
  });
}
// ─── Plan Configs ─────────────────────────────────────────────────

const DEFAULT_PLAN_CONFIGS: PlanConfigs = {
  monthly: {
    name: "Monthly Elite",
    description: "Full fleet access with no per-day charges. Cancel anytime.",
    price: 10000,
    features: [
      "Unlimited vehicle rentals",
      "Access to entire luxury fleet",
      "Priority booking guarantee",
      "24/7 concierge support",
      "Flexible cancellation",
    ],
  },
  annual: {
    name: "Annual Elite",
    description:
      "Best value. Unlimited year-round access with exclusive VIP perks.",
    price: 100000,
    features: [
      "Unlimited vehicle rentals",
      "Access to entire luxury fleet",
      "Priority booking & dedicated liaison",
      "White-glove 24/7 concierge",
      "Complimentary professional detailing",
      "Exclusive new arrival previews",
      "Two complimentary guest rentals",
    ],
  },
};

export function useGetPlanConfigs() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<PlanConfigs>({
    queryKey: ["planConfigs"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PLAN_CONFIGS;
      const result = (await actor.getPlanConfigs()) as unknown as PlanConfigs;
      return result;
    },
    enabled: !isFetching,
    placeholderData: DEFAULT_PLAN_CONFIGS,
  });
}

export function useSetPlanConfigs() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, PlanConfigs>({
    mutationFn: async (configs) => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          setPlanConfigs: (
            c: PlanConfigs,
          ) => Promise<{ __kind__: string; err?: string }>;
        }
      ).setPlanConfigs(configs);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["membershipPricing"] });
    },
  });
}
// ─── Comparison Rows ──────────────────────────────────────────────

const DEFAULT_COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Unlimited Vehicle Rentals", monthly: true, annual: true },
  { feature: "Full Fleet Access", monthly: true, annual: true },
  { feature: "Priority Booking", monthly: true, annual: true },
  { feature: "24/7 Concierge", monthly: true, annual: true },
  { feature: "Dedicated Personal Liaison", monthly: false, annual: true },
  { feature: "Complimentary Detailing", monthly: false, annual: true },
  { feature: "New Arrival Previews", monthly: false, annual: true },
  { feature: "Guest Rental Credits (×2)", monthly: false, annual: true },
];

export function useGetComparisonRows() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<ComparisonRow[]>({
    queryKey: ["comparisonRows"],
    queryFn: async () => {
      if (!actor) return DEFAULT_COMPARISON_ROWS;
      const result = await (
        actor as unknown as {
          getComparisonRows: () => Promise<
            Array<{ feature: string; monthly: boolean; annual: boolean }>
          >;
        }
      ).getComparisonRows();
      return result.map((r) => ({
        feature: r.feature,
        monthly: Boolean(r.monthly),
        annual: Boolean(r.annual),
      }));
    },
    enabled: !isFetching,
    placeholderData: DEFAULT_COMPARISON_ROWS,
  });
}

export function useSetComparisonRows() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, ComparisonRow[]>({
    mutationFn: async (rows) => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          setComparisonRows: (
            rows: ComparisonRow[],
          ) => Promise<{ __kind__: string; err?: string }>;
        }
      ).setComparisonRows(rows);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisonRows"] });
    },
  });
}

// ─── Site Stats ────────────────────────────────────────────────────

export interface SiteStats {
  eliteVehicles: bigint;
  satisfiedClients: string;
  conciergeSupport: string;
  fiveStarReviews: string;
}

export function useGetSiteStats() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<SiteStats>({
    queryKey: ["siteStats"],
    queryFn: async () => {
      if (!actor)
        return {
          eliteVehicles: 0n,
          satisfiedClients: "100+",
          conciergeSupport: "24/7",
          fiveStarReviews: "100%",
        };
      return actor.getSiteStats();
    },
    enabled: !isFetching,
    placeholderData: {
      eliteVehicles: 0n,
      satisfiedClients: "100+",
      conciergeSupport: "24/7",
      fiveStarReviews: "100%",
    },
  });
}

// ─── Admin: Policies ──────────────────────────────────────────────

export function useAdminUpdatePolicy() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { policyType: string; content: string }>({
    mutationFn: async ({ policyType, content }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminUpdatePolicy(policyType, content);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

export function usePolicies() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    cancellationPolicy: string;
    insuranceWaiverTerms: string;
    damagePolicy: string;
  }>({
    queryKey: ["policies"],
    queryFn: async () => {
      if (!actor)
        return {
          cancellationPolicy:
            "Cancellations made within 48 hours of pickup are non-refundable. Earlier cancellations receive a full refund minus a $250 processing fee.",
          insuranceWaiverTerms:
            "By signing below, you acknowledge that you are responsible for any damage caused by negligence, reckless driving, or violation of rental terms. Basic insurance is included; supplemental coverage is available upon request.",
          damagePolicy:
            "Any damage to the vehicle will be assessed by our team. Repair costs, loss of use, and administrative fees may be charged against your security deposit or billed to your payment method on file.",
        };
      return actor.getPolicies();
    },
    enabled: !isFetching,
    placeholderData: {
      cancellationPolicy:
        "Cancellations made within 48 hours of pickup are non-refundable. Earlier cancellations receive a full refund minus a $250 processing fee.",
      insuranceWaiverTerms:
        "By signing below, you acknowledge that you are responsible for any damage caused by negligence, reckless driving, or violation of rental terms. Basic insurance is included; supplemental coverage is available upon request.",
      damagePolicy:
        "Any damage to the vehicle will be assessed by our team. Repair costs, loss of use, and administrative fees may be charged against your security deposit or billed to your payment method on file.",
    },
  });
}

// ─── Admin: ID Verification ─────────────────────────────────────

export function useAdminGetPendingVerifications() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<IDVerification[]>({
    queryKey: ["admin", "pendingVerifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetPendingVerifications();
    },
    enabled: !isFetching,
  });
}

export function useAdminReviewVerification() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    IDVerification,
    Error,
    { bookingId: string; approved: boolean; notes: string }
  >({
    mutationFn: async ({ bookingId, approved, notes }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminReviewVerification(
        bookingId,
        approved,
        notes,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pendingVerifications"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
}

export function useSubmitIDVerification() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    IDVerification,
    Error,
    { bookingId: string; licensePhotoId: string; ssnLast4: string }
  >({
    mutationFn: async ({ bookingId, licensePhotoId, ssnLast4 }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitIDVerification(
        bookingId,
        licensePhotoId,
        ssnLast4,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ─── Error Logs ───────────────────────────────────────────────────

export function useErrorLogs() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<ErrorLogEntry[]>({
    queryKey: ["admin", "errorLogs"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getErrorLogs();
      if (!result || typeof result !== "object") return [];
      if ("__kind__" in result) {
        if (result.__kind__ === "ok" && Array.isArray(result.ok))
          return result.ok;
        return [];
      }
      if (Array.isArray(result)) return result;
      return [];
    },
    enabled: !isFetching,
  });
}

export function useClearErrorLogs() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.clearErrorLogs();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "errorLogs"] });
    },
  });
}

// ─── Blog Posts ────────────────────────────────────────────────────

export function useAdminListAllBlogPosts() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlogPost[]>({
    queryKey: ["admin", "blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListAllBlogPosts();
    },
    enabled: !isFetching,
  });
}

export function useAdminCreateBlogPost() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    { __kind__: "ok"; ok: BlogPost } | { __kind__: "err"; err: string },
    Error,
    {
      title: string;
      slug: string;
      author: string;
      excerpt: string;
      featuredImage: string;
      content: string;
      publishedDate: bigint;
      published: boolean;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminCreateBlogPost(
        data.title,
        data.slug,
        data.author,
        data.excerpt,
        data.featuredImage,
        data.content,
        data.publishedDate,
        data.published,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
    },
  });
}

export function useAdminUpdateBlogPost() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    { __kind__: "ok"; ok: BlogPost } | { __kind__: "err"; err: string },
    Error,
    {
      id: bigint;
      title: string;
      slug: string;
      author: string;
      excerpt: string;
      featuredImage: string;
      content: string;
      publishedDate: bigint;
      published: boolean;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUpdateBlogPost(
        data.id,
        data.title,
        data.slug,
        data.author,
        data.excerpt,
        data.featuredImage,
        data.content,
        data.publishedDate,
        data.published,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
    },
  });
}

export function useAdminDeleteBlogPost() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      await actor.adminDeleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
    },
  });
}

// ─── Analytics Settings ────────────────────────────────────────────

export function useAnalyticsSettings() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AnalyticsSettings>({
    queryKey: ["admin", "analyticsSettings"],
    queryFn: async () => {
      if (!actor) return { ga4Id: "", metaPixelId: "", tiktokPixelId: "" };
      return actor.getAnalyticsSettings();
    },
    enabled: !isFetching,
    placeholderData: { ga4Id: "", metaPixelId: "", tiktokPixelId: "" },
  });
}

export function useAdminSetAnalyticsSettings() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, AnalyticsSettings>({
    mutationFn: async (settings) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSetAnalyticsSettings(settings);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "analyticsSettings"],
      });
    },
  });
}

// ─── Favorites ─────────────────────────────────────────────────────

export function useFavorites() {
  const { actor, isFetching } = useActorInstance();
  const { isAuthenticated } = useAuth();
  return useQuery<string[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFavorites();
    },
    enabled: !isFetching && isAuthenticated,
  });
}

export function useAddFavorite() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (vehicleId) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFavorite(vehicleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (vehicleId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFavorite(vehicleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// ─── Referral ──────────────────────────────────────────────────────

export function useReferralCode() {
  const { actor, isFetching } = useActorInstance();
  const { isAuthenticated } = useAuth();
  return useQuery<string>({
    queryKey: ["referralCode"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getMyReferralCode();
    },
    enabled: !isFetching && isAuthenticated,
  });
}

export function useReferralStats() {
  const { actor, isFetching } = useActorInstance();
  const { isAuthenticated } = useAuth();
  return useQuery<{ code: string; referralCount: bigint }>({
    queryKey: ["referralStats"],
    queryFn: async () => {
      if (!actor) return { code: "", referralCount: 0n };
      return actor.getReferralStats();
    },
    enabled: !isFetching && isAuthenticated,
  });
}

// ─── Admin: Email List ────────────────────────────────────────────

export function useAdminGetEmailSubscribers() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<EmailSubscriber[]>({
    queryKey: ["admin", "emailSubscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetEmailSubscribers();
    },
    enabled: !isFetching,
  });
}

export function useAdminSendPromoEmail() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, { subject: string; htmlBody: string }>({
    mutationFn: async ({ subject, htmlBody }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSendPromoEmail(subject, htmlBody);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "emailSubscribers"],
      });
    },
  });
}

export function useAdminReportDamage() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, { bookingId: bigint; notes: string }>({
    mutationFn: async ({ bookingId, notes }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminReportDamage(bookingId, notes);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useSubscribeToEmailList() {
  const { actor } = useActorInstance();
  return useMutation<null, Error, string>({
    mutationFn: async (email) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.subscribeToEmailList(email);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

export function useAdminSetSiteStats() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      satisfiedClients: string;
      conciergeSupport: string;
      fiveStarReviews: string;
    }
  >({
    mutationFn: async ({
      satisfiedClients,
      conciergeSupport,
      fiveStarReviews,
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSetSiteStats(
        satisfiedClients,
        conciergeSupport,
        fiveStarReviews,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteStats"] });
    },
  });
}

// ─── Vehicle Sort Order ────────────────────────────────────────────

export function useGetVehicleSortOrders() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Array<[string, number]>>({
    queryKey: ["vehicleSortOrders"],
    queryFn: async () => {
      if (!actor) return [];
      const a = actor as unknown as {
        getVehicleSortOrders: () => Promise<Array<[bigint, bigint]>>;
      };
      const raw = await a.getVehicleSortOrders();
      return raw.map(
        ([id, pos]) => [id.toString(), Number(pos)] as [string, number],
      );
    },
    enabled: !isFetching,
  });
}

export function useAdminSetVehicleSortOrders() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  return useMutation<void, Error, Array<[string, number]>>({
    mutationFn: async (orders) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as {
        adminSetVehicleSortOrders: (
          orders: Array<[bigint, bigint]>,
        ) => Promise<void>;
      };
      const converted: Array<[bigint, bigint]> = orders.map(([id, pos]) => [
        BigInt(id),
        BigInt(pos),
      ]);
      await a.adminSetVehicleSortOrders(converted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleSortOrders"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
