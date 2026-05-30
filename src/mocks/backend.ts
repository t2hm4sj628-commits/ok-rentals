// Mock backend for development/testing — stubs all actor methods
import type {
  AdminEntry,
  AdminRole,
  AuditLog,
  Booking,
  BookingId,
  BookingStatus,
  CeoProfile,
  ComparisonRow,
  MembershipPlan,
  MembershipPlanConfig,
  MembershipStatus,
  PaymentMethod,
  PlanConfigs,
  UserMembership,
  UserProfile,
  Vehicle,
  VehicleId,
  VehicleInput,
} from "../frontend/src/backend";
import type { Principal } from "@dfinity/principal";

type OkErr<T = null> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: string };

const ok = <T>(val: T): OkErr<T> => ({ __kind__: "ok", ok: val });

export const actor = {
  // Vehicle
  listVehicles: (): Promise<Vehicle[]> => Promise.resolve([]),
  getVehicle: (_id: VehicleId): Promise<Vehicle | null> => Promise.resolve(null),
  checkVehicleAvailability: (
    _vehicleId: VehicleId,
    _startDate: bigint,
    _endDate: bigint,
  ): Promise<boolean> => Promise.resolve(true),

  // Bookings
  createBooking: (
    _vehicleId: bigint,
    _startDate: bigint,
    _endDate: bigint,
    _paymentMethod: PaymentMethod,
  ): Promise<Booking> => Promise.reject(new Error("Mock: not implemented")),
  getMyBookings: (): Promise<Booking[]> => Promise.resolve([]),
  cancelBooking: (_id: BookingId): Promise<boolean> => Promise.resolve(false),
  getBookingById: (_id: BookingId): Promise<Booking | null> =>
    Promise.resolve(null),

  // Membership
  getMyMembership: (): Promise<UserMembership | null> => Promise.resolve(null),
  subscribeMembership: (_plan: MembershipPlan): Promise<UserMembership> =>
    Promise.reject(new Error("Mock: not implemented")),
  cancelMembership: (): Promise<boolean> => Promise.resolve(false),
  getMembershipPricing: (): Promise<{ monthly: number; annual: number }> =>
    Promise.resolve({ monthly: 299, annual: 2999 }),
  updateMembershipStatus: (
    _userId: Principal,
    _status: MembershipStatus,
  ): Promise<OkErr> => Promise.resolve(ok(null)),

  // Profile
  getMyProfile: (): Promise<UserProfile | null> => Promise.resolve(null),
  registerProfile: (
    _displayName: string,
    _email: string,
  ): Promise<UserProfile> => Promise.reject(new Error("Mock: not implemented")),
  updateProfile: (
    _displayName: string,
    _email: string,
  ): Promise<UserProfile | null> => Promise.resolve(null),
  getProfile: (_principal: Principal): Promise<UserProfile | null> =>
    Promise.resolve(null),

  // Admin — vehicles
  adminAddVehicle: (_data: VehicleInput): Promise<OkErr<Vehicle>> =>
    Promise.resolve(ok({} as Vehicle)),
  adminUpdateVehicle: (
    _id: VehicleId,
    _data: VehicleInput,
  ): Promise<OkErr<Vehicle>> => Promise.resolve(ok({} as Vehicle)),
  adminDeleteVehicle: (_id: VehicleId): Promise<OkErr> =>
    Promise.resolve(ok(null)),
  adminSetVehiclePhoto: (
    _id: VehicleId,
    _imageUrl: string,
  ): Promise<OkErr> => Promise.resolve(ok(null)),

  // Admin — bookings & users
  adminGetAllBookings: (): Promise<Booking[]> => Promise.resolve([]),
  adminUpdateBookingStatus: (
    _bookingId: BookingId,
    _status: BookingStatus,
  ): Promise<OkErr<Booking>> =>
    Promise.resolve(ok({} as Booking)),
  adminListUsers: (): Promise<UserProfile[]> => Promise.resolve([]),

  // Admin — membership pricing
  adminSetMembershipPricing: (
    _monthly: number,
    _annual: number,
  ): Promise<OkErr> => Promise.resolve(ok(null)),

  // Admin — access control
  isAdmin: (_principal: Principal): Promise<boolean> => Promise.resolve(false),
  addAdmin: (_principal: Principal): Promise<OkErr> =>
    Promise.resolve(ok(null)),
  removeAdmin: (_principal: Principal): Promise<OkErr> =>
    Promise.resolve(ok(null)),

  // Analytics
  getAnalytics: (): Promise<{
    activeUserCount: bigint;
    bookingCountByVehicle: Array<[string, bigint]>;
    fleetUtilizationPercent: number;
    totalRevenue: number;
  }> =>
    Promise.resolve({
      activeUserCount: 0n,
      bookingCountByVehicle: [],
      fleetUtilizationPercent: 0,
      totalRevenue: 0,
    }),

  // ─── New methods ───────────────────────────────────────────────
  askChat: (_message: string, _sessionId: string): Promise<string> =>
    Promise.resolve(
      "Hello! I'm the OK Rentals AI concierge. How can I assist you today?",
    ),

  adminSetOpenAIKey: (_key: string): Promise<OkErr> =>
    Promise.resolve(ok(null)),

  assignRole: (_principal: Principal, _role: AdminRole): Promise<OkErr> =>
    Promise.resolve(ok(null)),

  getAdminRole: (_principal: Principal): Promise<AdminRole | null> =>
    Promise.resolve(null),

  transferOwnership: (_newOwner: Principal): Promise<OkErr> =>
    Promise.resolve(ok(null)),

  getAuditLog: (): Promise<{ __kind__: "ok"; ok: AuditLog[] } | { __kind__: "err"; err: string }> => Promise.resolve({ __kind__: "ok", ok: [] }),

  listAdminsWithRoles: (): Promise<AdminEntry[]> => Promise.resolve([]),

  getPlanConfigs: (): Promise<PlanConfigs> =>
    Promise.resolve({
      monthly: {
        name: "Monthly Elite",
        description: "Full access to our luxury fleet on a month-to-month basis.",
        price: 5000,
        features: [
          "Unlimited vehicle rentals",
          "Access to entire luxury fleet",
          "Priority booking guarantee",
          "24/7 concierge support",
          "Flexible cancellation policy",
        ],
      } as MembershipPlanConfig,
      annual: {
        name: "Annual Elite",
        description: "Premium year-round access with exclusive member benefits and maximum savings.",
        price: 50000,
        features: [
          "Everything in Monthly Elite",
          "2 months free (save $10,000)",
          "Exclusive VIP events access",
          "Dedicated account manager",
          "Complimentary airport transfers",
          "First access to new fleet additions",
        ],
      } as MembershipPlanConfig,
    }),

  setPlanConfigs: (_configs: PlanConfigs): Promise<OkErr> =>
    Promise.resolve(ok(null)),

  getCeoProfile: (): Promise<CeoProfile> =>
    Promise.resolve({
      name: "CEO",
      title: "CEO & Founder",
      instagramHandle: "_stannoodles",
      description: "",
      photoUrl: "",
    }),

  setCeoProfile: (_profile: CeoProfile): Promise<void> =>
    Promise.resolve(),

  getComparisonRows: (): Promise<ComparisonRow[]> => Promise.resolve([]),

  setComparisonRows: (_rows: ComparisonRow[]): Promise<OkErr> =>
    Promise.resolve(ok(null)),
};
