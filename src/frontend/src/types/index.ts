import type { Principal } from "@dfinity/principal";

export type { BookingId, VehicleId, Timestamp, UserId } from "@/backend";
export {
  BookingStatus,
  MembershipPlan,
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/backend";
export type {
  Booking,
  Vehicle,
  VehicleInput,
  UserProfile,
  UserMembership,
} from "@/backend";

export interface BookingFormData {
  vehicleId: bigint;
  startDate: Date;
  endDate: Date;
  paymentMethod: import("@/backend").PaymentMethod;
}

export interface VehicleFilter {
  available?: boolean;
  minRate?: number;
  maxRate?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  isLoading: boolean;
}

export interface AnalyticsResult {
  totalRevenue: number;
  bookingCountByVehicle: Array<[string, number]>;
  fleetUtilizationPercent: number;
  activeUserCount: number;
}

export interface MembershipPricing {
  monthly: number;
  annual: number;
}

export interface MembershipPlanConfig {
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface PlanConfigs {
  monthly: MembershipPlanConfig;
  annual: MembershipPlanConfig;
}
export interface ComparisonRow {
  feature: string;
  monthly: boolean;
  annual: boolean;
}
