import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface AuditLog {
    id: bigint;
    action: string;
    performer: Principal;
    target?: string;
    timestamp: Timestamp;
}
export interface TripPhoto {
    id: bigint;
    bookingId: string;
    phase: TripPhotoPhase;
    uploadedAt: bigint;
    uploaderId: Principal;
    photoId: string;
}
export interface Vehicle {
    id: VehicleId;
    mileageLimit: bigint;
    dailyRate: bigint;
    sortOrder: bigint;
    name: string;
    color: string;
    year: bigint;
    bookedRanges: Array<[bigint, bigint]>;
    description: string;
    deposit: bigint;
    available: boolean;
    imageUrl: string;
    rules: Array<string>;
}
export interface Booking {
    id: BookingId;
    damageNotes: string;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    cryptoTxRef?: string;
    paymentMethod: PaymentMethod;
    endDate: Timestamp;
    userId: UserId;
    createdAt: Timestamp;
    damageClaimFlag: boolean;
    totalCost: bigint;
    stripeSessionId?: string;
    vehicleId: VehicleId;
    startDate: Timestamp;
}
export type ReviewId = bigint;
export interface EmailSubscriber {
    subscribedAt: bigint;
    email: string;
}
export interface ComparisonRow {
    feature: string;
    annual: boolean;
    monthly: boolean;
}
export interface IDVerification {
    status: IDVerificationStatus;
    bookingId: string;
    userId: Principal;
    ssnLast4: string;
    submittedAt: bigint;
    reviewedAt: bigint;
    licensePhotoId: string;
    adminNotes: string;
}
export interface Review {
    id: ReviewId;
    bookingId: bigint;
    reviewerId: UserId;
    comment: string;
    timestamp: bigint;
    rating: bigint;
    vehicleId: bigint;
}
export type BookingId = bigint;
export interface UserMembership {
    status: MembershipStatus;
    endDate: Timestamp;
    userId: UserId;
    plan: MembershipPlan;
    startDate: Timestamp;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    publishedDate: bigint;
    featuredImage: string;
    published: boolean;
    createdAt: bigint;
    slug: string;
    author: string;
    updatedAt: bigint;
    excerpt: string;
}
export type VehicleId = bigint;
export interface VehicleInput {
    mileageLimit: bigint;
    dailyRate: bigint;
    name: string;
    color: string;
    year: bigint;
    description: string;
    deposit: bigint;
    available: boolean;
    imageUrl: string;
    rules: Array<string>;
}
export interface AnalyticsSettings {
    tiktokPixelId: string;
    metaPixelId: string;
    ga4Id: string;
}
export interface AdminEntry {
    principal: Principal;
    assignedAt: Timestamp;
    role: AdminRole;
}
export interface ErrorLogEntry {
    id: bigint;
    errorType: string;
    message: string;
    timestamp: bigint;
    principalId?: string;
}
export type UserId = Principal;
export interface PlanConfigs {
    annual: MembershipPlanConfig;
    monthly: MembershipPlanConfig;
}
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    bookingId: bigint;
    timestamp: bigint;
    senderRole: string;
    senderId: UserId;
}
export interface CeoProfile {
    title: string;
    name: string;
    instagramHandle: string;
    description: string;
    photoUrl: string;
}
export interface MembershipPlanConfig {
    features: Array<string>;
    name: string;
    description: string;
    price: number;
}
export interface UserProfile {
    principal: UserId;
    displayName: string;
    createdAt: Timestamp;
    email: string;
    membershipStatus?: MembershipStatus;
}
export enum AdminRole {
    manager = "manager",
    owner = "owner",
    support = "support",
    viewer = "viewer"
}
export enum BookingStatus {
    active = "active",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    approved = "approved",
    returned = "returned"
}
export enum IDVerificationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum MembershipPlan {
    annual = "annual",
    monthly = "monthly"
}
export enum MembershipStatus {
    active = "active",
    cancelled = "cancelled",
    expired = "expired",
    pending = "pending",
    failed = "failed"
}
export enum PaymentMethod {
    creditCard = "creditCard",
    applePay = "applePay",
    crypto = "crypto"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum TripPhotoPhase {
    after = "after",
    before = "before"
}
export interface backendInterface {
    addAdmin(principal: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addFavorite(vehicleId: string): Promise<void>;
    addTripPhoto(bookingId: string, phase: string, photoId: string): Promise<{
        __kind__: "ok";
        ok: TripPhoto;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminAddVehicle(data: VehicleInput): Promise<{
        __kind__: "ok";
        ok: Vehicle;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminCreateBlogPost(title: string, slug: string, author: string, excerpt: string, featuredImage: string, content: string, publishedDate: bigint, published: boolean): Promise<{
        __kind__: "ok";
        ok: BlogPost;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteBlogPost(id: bigint): Promise<boolean>;
    adminDeleteVehicle(id: VehicleId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllBookings(): Promise<Array<Booking>>;
    adminGetEmailSubscribers(): Promise<Array<EmailSubscriber>>;
    adminGetPendingVerifications(): Promise<Array<IDVerification>>;
    adminListAllBlogPosts(): Promise<Array<BlogPost>>;
    adminListUsers(): Promise<Array<UserProfile>>;
    adminReportDamage(bookingId: BookingId, notes: string): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminReviewVerification(bookingId: string, approved: boolean, notes: string): Promise<{
        __kind__: "ok";
        ok: IDVerification;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSendPromoEmail(subject: string, htmlBody: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetAnalyticsSettings(settings: AnalyticsSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetMembershipPricing(monthly: number, annual: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetOpenAIKey(key: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetSiteStats(satisfiedClients: string, conciergeSupport: string, fiveStarReviews: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetVehiclePhoto(id: VehicleId, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetVehicleSortOrders(orders: Array<[VehicleId, bigint]>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateBlogPost(id: bigint, title: string | null, slug: string | null, author: string | null, excerpt: string | null, featuredImage: string | null, content: string | null, publishedDate: bigint | null, published: boolean | null): Promise<{
        __kind__: "ok";
        ok: BlogPost;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateBookingStatus(bookingId: BookingId, status: BookingStatus): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdatePolicy(policyType: string, content: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateVehicle(id: VehicleId, data: VehicleInput): Promise<{
        __kind__: "ok";
        ok: Vehicle;
    } | {
        __kind__: "err";
        err: string;
    }>;
    askChat(message: string, sessionId: string): Promise<string>;
    assignRole(principal: Principal, role: AdminRole): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelBooking(id: BookingId): Promise<boolean>;
    cancelMembership(): Promise<boolean>;
    checkVehicleAvailability(vehicleId: VehicleId, startDate: bigint, endDate: bigint): Promise<boolean>;
    clearErrorLogs(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBooking(vehicleId: bigint, startDate: bigint, endDate: bigint, paymentMethod: PaymentMethod): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAdminRole(principal: Principal): Promise<AdminRole | null>;
    getAnalytics(): Promise<{
        activeUserCount: bigint;
        bookingCountByVehicle: Array<[string, bigint]>;
        fleetUtilizationPercent: number;
        totalRevenue: number;
    }>;
    getAnalyticsSettings(): Promise<AnalyticsSettings>;
    getAuditLog(): Promise<{
        __kind__: "ok";
        ok: Array<AuditLog>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAverageRating(vehicleId: bigint): Promise<bigint>;
    getBlogPost(slug: string): Promise<BlogPost | null>;
    getBookingById(id: BookingId): Promise<Booking | null>;
    getCeoProfile(): Promise<CeoProfile>;
    getComparisonRows(): Promise<Array<ComparisonRow>>;
    getErrorLogs(): Promise<{
        __kind__: "ok";
        ok: Array<ErrorLogEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMembershipPricing(): Promise<{
        annual: number;
        monthly: number;
    }>;
    getMessages(bookingId: bigint): Promise<{
        __kind__: "ok";
        ok: Array<Message>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyBookings(): Promise<Array<Booking>>;
    getMyFavorites(): Promise<Array<string>>;
    getMyMembership(): Promise<UserMembership | null>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyReferralCode(): Promise<string>;
    getPlanConfigs(): Promise<PlanConfigs>;
    getPolicies(): Promise<{
        insuranceWaiverTerms: string;
        cancellationPolicy: string;
        damagePolicy: string;
    }>;
    getProfile(principal: UserId): Promise<UserProfile | null>;
    getReferralStats(): Promise<{
        code: string;
        referralCount: bigint;
    }>;
    getSiteStats(): Promise<{
        conciergeSupport: string;
        eliteVehicles: bigint;
        fiveStarReviews: string;
        satisfiedClients: string;
    }>;
    getTripPhotos(bookingId: string): Promise<Array<TripPhoto>>;
    getVehicle(id: VehicleId): Promise<Vehicle | null>;
    getVehicleReviews(vehicleId: bigint): Promise<Array<Review>>;
    getVehicleSortOrders(): Promise<Array<[VehicleId, bigint]>>;
    isAdmin(principal: Principal): Promise<boolean>;
    listAdminsWithRoles(): Promise<Array<AdminEntry>>;
    listPublishedBlogPosts(): Promise<Array<BlogPost>>;
    listVehicles(): Promise<Array<Vehicle>>;
    registerProfile(displayName: string, email: string): Promise<UserProfile>;
    removeAdmin(principal: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeFavorite(vehicleId: string): Promise<void>;
    sendMessage(bookingId: bigint, content: string): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setCeoProfile(profile: CeoProfile): Promise<void>;
    setComparisonRows(rows: Array<ComparisonRow>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setPlanConfigs(configs: PlanConfigs): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitIDVerification(bookingId: string, licensePhotoId: string, ssnLast4: string): Promise<{
        __kind__: "ok";
        ok: IDVerification;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitReview(vehicleId: bigint, bookingId: bigint, rating: bigint, comment: string): Promise<{
        __kind__: "ok";
        ok: Review;
    } | {
        __kind__: "err";
        err: string;
    }>;
    subscribeMembership(plan: MembershipPlan): Promise<{
        __kind__: "ok";
        ok: UserMembership;
    } | {
        __kind__: "err";
        err: string;
    }>;
    subscribeToEmailList(email: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transferOwnership(newOwner: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMembershipStatus(userId: UserId, status: MembershipStatus): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProfile(displayName: string, email: string): Promise<UserProfile | null>;
}
