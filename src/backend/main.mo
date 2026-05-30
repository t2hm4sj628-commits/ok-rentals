import Map "mo:core/Map";
import VehicleTypes "types/vehicle";
import BookingTypes "types/booking";
import MembershipTypes "types/membership";
import UserTypes "types/user";
import AdminTypes "types/admin";
import Common "types/common";
import VehicleLib "lib/vehicle";
import BookingLib "lib/booking";
import MembershipLib "lib/membership";
import UserLib "lib/user";
import VehicleApi "mixins/vehicle-api";
import BookingApi "mixins/booking-api";
import MembershipApi "mixins/membership-api";
import UserApi "mixins/user-api";
import AdminLib "lib/admin";
import AdminApi "mixins/admin-api";
import AnalyticsApi "mixins/analytics-api";
import ChatApi "mixins/chat-api";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import List "mo:core/List";
import CeoProfileTypes "types/ceo-profile";
import CeoProfileLib "lib/ceo-profile";
import CeoProfileApi "mixins/ceo-profile-api";
import SiteStatsApi "mixins/site-stats-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import BlogTypes "types/blog";
import BlogLib "lib/blog";
import BlogApi "mixins/blog-api";
import ErrorLogTypes "types/errorlog";
import ErrorLogLib "lib/errorlog";
import ErrorLogApi "mixins/errorlog-api";
import AnalyticsSettingsTypes "types/analytics-settings";
import AnalyticsSettingsLib "lib/analytics-settings";
import AnalyticsSettingsApi "mixins/analytics-settings-api";
import RateLimitLib "lib/ratelimit";
import ReviewTypes "types/review";
import MessageTypes "types/message";
import ReviewLib "lib/review";
import MessagingLib "lib/messaging";
import PolicyLib "lib/policy";
import ReviewApi "mixins/review-api";
import MessagingApi "mixins/messaging-api";
import PolicyApi "mixins/policy-api";
import IDVerTypes "types/id-verification";
import IDVerLib "lib/id-verification";
import TripPhotoLib "lib/trip-photo";
import ReferralLib "lib/referral";
import FavoritesLib "lib/favorites";
import EmailListLib "lib/email-list";
import IDVerApi "mixins/id-verification-api";
import TripPhotoApi "mixins/trip-photo-api";
import ReferralApi "mixins/referral-api";
import FavoritesApi "mixins/favorites-api";
import EmailListApi "mixins/email-list-api";
import TripPhotoTypes "types/trip-photo";









actor {
  let vehicles : VehicleLib.VehicleMap = Map.empty<VehicleTypes.VehicleId, VehicleTypes.Vehicle>();
  // Separate map persisting admin-uploaded photo URLs — keyed by vehicleId.
  // These are re-applied after seedVehicles() so admin photos always win over seed defaults.
  let vehiclePhotoOverrides : VehicleLib.PhotoOverrideMap = Map.empty<VehicleTypes.VehicleId, Text>();
  let bookings : BookingLib.BookingMap = Map.empty<BookingTypes.BookingId, BookingTypes.Booking>();
  let memberships : MembershipLib.MembershipMap = Map.empty<Common.UserId, MembershipTypes.UserMembership>();
  let users : UserLib.UserMap = Map.empty<Common.UserId, UserTypes.UserProfile>();
  let admins : AdminLib.AdminSet = Set.empty<Common.UserId>();
  let roleMap : AdminLib.AdminRoleMap = Map.empty<Common.UserId, AdminTypes.AdminEntry>();
  let auditLog : AdminLib.AuditList = List.empty<AdminTypes.AuditLog>();
  let bookingState = { var nextId : Nat = 0 };
  let vehicleState = { var nextVehicleId : Nat = 4 };
  let sortOrdersState = { var orders : [(VehicleTypes.VehicleId, Nat)] = [] };
  let adminState = { var controller : ?Common.UserId = null };
  let pricingState = { var monthly : Float = 10000.0; var annual : Float = 100000.0 };
  let planConfigs = { var monthly : MembershipTypes.MembershipPlanConfig = MembershipLib.defaultPlanConfigs.monthly; var annual : MembershipTypes.MembershipPlanConfig = MembershipLib.defaultPlanConfigs.annual };
  let comparisonRowsState = { var rows : [MembershipTypes.ComparisonRow] = MembershipLib.defaultComparisonRows };
  let auditState = { var nextAuditId : Nat = 0 };
  let openAiState = { var openAiKey : Text = "" };
  let ceoProfileState = { var ceoProfile : CeoProfileTypes.CeoProfile = CeoProfileLib.defaultProfile };
  let siteStatsState = { var satisfiedClients : Text = "100+"; var conciergeSupport : Text = "24/7"; var fiveStarReviews : Text = "100%" };

  // Blog state
  let blogPosts : BlogLib.BlogMap = Map.empty<Nat, BlogTypes.BlogPost>();
  let blogState : BlogLib.BlogState = { var nextBlogId : Nat = 0 };
  // Initialize-once flag for blog
  let blogInitialized = { var value : Bool = false };

  // Error log state — circular buffer max 100 entries
  let errorBuf : ErrorLogLib.ErrorBuffer = ErrorLogLib.newBuffer();
  let errorLogState : ErrorLogLib.ErrorLogState = { var nextId : Nat = 0; var head : Nat = 0; var count : Nat = 0 };

  // Analytics settings state
  let analyticsSettingsState : AnalyticsSettingsLib.AnalyticsSettingsState = { var settings : AnalyticsSettingsTypes.AnalyticsSettings = AnalyticsSettingsLib.defaultSettings };
  let analyticsSettingsInitialized = { var value : Bool = false };

  // Review state
  let reviews : ReviewLib.ReviewMap = Map.empty<ReviewTypes.ReviewId, ReviewTypes.Review>();
  let reviewState : ReviewLib.ReviewState = { var nextId : Nat = 0 };
  let reviewInitialized = { var value : Bool = false };

  // Messaging state
  let messages : MessagingLib.MessageMap = Map.empty<MessageTypes.MessageId, MessageTypes.Message>();
  let messageState : MessagingLib.MessageState = { var nextId : Nat = 0 };

  // Policy state — initialize once, then admin-controlled
  let policyState : PolicyLib.PolicyState = PolicyLib.newState();
  let policyInitialized = { var value : Bool = false };

  // Rate limit map
  let rateLimitMap : RateLimitLib.RateLimitMap = Map.empty<Text, (Nat, Int)>();

  // ID verification state
  let idVerifications : IDVerLib.IDVerifications = IDVerLib.newState();

  // Trip photo state
  let tripPhotos : TripPhotoLib.TripPhotos = Map.empty<Text, List.List<TripPhotoTypes.TripPhoto>>();
  let tripPhotoStateRec : TripPhotoLib.TripPhotoState = { var nextId = 0 };

  // Referral state — initialize once
  let referralState : ReferralLib.ReferralState = ReferralLib.newState();

  // Favorites state
  let favorites : FavoritesLib.Favorites = FavoritesLib.newState();

  // Email list state — initialize once
  let emailListState : EmailListLib.EmailListState = EmailListLib.newState();

  // Initialize-once flags — survive upgrades under enhanced orthogonal persistence
  let initFlags = {
    var pricingInitialized : Bool = false;
    var ceoProfileInitialized : Bool = false;
    var siteStatsInitialized : Bool = false;
    var planConfigsInitialized : Bool = false;
    var comparisonRowsInitialized : Bool = false;
    var vehiclePhotoOverridesInitialized : Bool = false;
    var vehicleStateInitialized : Bool = false;
  };

  // Only seed on first deploy — skip if state already has data (EOP preserves state across upgrades)
  if (vehicles.size() == 0) {
    VehicleLib.seedVehicles(vehicles);
  };

  // Ensure nextVehicleId is at least 4 (covers seeds 0-3) so admin-added vehicles
  // never get IDs that collide with seeded ones after an upgrade.
  if (not initFlags.vehicleStateInitialized) {
    if (vehicleState.nextVehicleId < 4) {
      vehicleState.nextVehicleId := 4;
    };
    initFlags.vehicleStateInitialized := true;
  };

  // Seed photo overrides with correct asset paths the first time this flag is unset.
  // This covers existing deployments where vehiclePhotoOverrides was previously empty.
  // Admin-saved photos stored after this point always win because adminSetVehiclePhoto
  // and adminUpdateVehicle both call photoOverrides.add(), overwriting these defaults.
  if (not initFlags.vehiclePhotoOverridesInitialized) {
    if (vehiclePhotoOverrides.get(0) == null) {
      vehiclePhotoOverrides.add(0, "/assets/urus-white.jpeg");
    };
    if (vehiclePhotoOverrides.get(1) == null) {
      vehiclePhotoOverrides.add(1, "/assets/rollsroyce-white.webp");
    };
    if (vehiclePhotoOverrides.get(2) == null) {
      vehiclePhotoOverrides.add(2, "/assets/urus-black.jpeg");
    };
    if (vehiclePhotoOverrides.get(3) == null) {
      vehiclePhotoOverrides.add(3, "/assets/maybach-black.jpeg");
    };
    initFlags.vehiclePhotoOverridesInitialized := true;
  };

  // NOTE: Do NOT call applyPhotoOverrides() on every startup.
  // Under enhanced orthogonal persistence, the vehicles map already contains
  // the correct photos saved by the admin — no re-application is needed or safe.
  // applyPhotoOverrides() was causing photos for vehicles 1 and 3 to be overwritten
  // with stale values from vehiclePhotoOverrides on every deployment.
  // It is only called once explicitly inside adminSetVehiclePhoto / adminUpdateVehicle.
  let ownerPrincipal = Principal.fromText("sqglp-tewq6-jqngz-lgjbk-qj2rb-tllpz-5lyng-gdghn-x2r5o-yd5cs-6ae");
  if (admins.size() == 0) {
    admins.add(ownerPrincipal);
    roleMap.add(
      ownerPrincipal,
      {
        principal = ownerPrincipal;
        role = #owner;
        assignedAt = 0;
      }
    );
  };

  // Initialize admin-editable state only on first deploy; preserve any admin changes across upgrades
  if (not initFlags.pricingInitialized) {
    pricingState.monthly := 10000.0;
    pricingState.annual := 100000.0;
    initFlags.pricingInitialized := true;
  };
  if (not initFlags.ceoProfileInitialized) {
    ceoProfileState.ceoProfile := CeoProfileLib.defaultProfile;
    initFlags.ceoProfileInitialized := true;
  };
  if (not initFlags.siteStatsInitialized) {
    siteStatsState.satisfiedClients := "100+";
    siteStatsState.conciergeSupport := "24/7";
    siteStatsState.fiveStarReviews := "100%";
    initFlags.siteStatsInitialized := true;
  };
  if (not initFlags.planConfigsInitialized) {
    planConfigs.monthly := MembershipLib.defaultPlanConfigs.monthly;
    planConfigs.annual := MembershipLib.defaultPlanConfigs.annual;
    initFlags.planConfigsInitialized := true;
  };
  if (not initFlags.comparisonRowsInitialized) {
    comparisonRowsState.rows := MembershipLib.defaultComparisonRows;
    initFlags.comparisonRowsInitialized := true;
  };

  if (not policyInitialized.value) {
    policyState.cancellationPolicy := PolicyLib.defaultCancellationPolicy;
    policyState.insuranceWaiverTerms := PolicyLib.defaultInsuranceWaiverTerms;
    policyState.damagePolicy := PolicyLib.defaultDamagePolicy;
    policyInitialized.value := true;
  };

  include VehicleApi(vehicles, vehiclePhotoOverrides, bookings, admins, vehicleState, sortOrdersState);
  include BookingApi(bookings, vehicles, bookingState, admins, rateLimitMap, errorBuf, errorLogState);
  include MembershipApi(memberships, admins, pricingState, planConfigs, comparisonRowsState, rateLimitMap, errorBuf, errorLogState);
  include UserApi(users, admins);
  include AdminApi(admins, adminState, roleMap, auditLog, auditState, openAiState);
  include AnalyticsApi(bookings, vehicles, users, admins, memberships);
  include ChatApi(admins, openAiState);
  include CeoProfileApi(ceoProfileState, admins);
  include SiteStatsApi(vehicles, admins, siteStatsState, auditLog, auditState);
  include BlogApi(blogPosts, blogState, admins, roleMap, auditLog, auditState);
  include ErrorLogApi(errorBuf, errorLogState, admins, roleMap);
  include AnalyticsSettingsApi(analyticsSettingsState, admins);
  include ReviewApi(reviews, reviewState, bookings);
  include MessagingApi(messages, messageState, bookings, admins);
  include PolicyApi(policyState, admins);
    include MixinObjectStorage();
    include IDVerApi(idVerifications, admins);
    include TripPhotoApi(tripPhotos, tripPhotoStateRec, bookings, admins);
    include ReferralApi(referralState);
    include FavoritesApi(favorites);
    include EmailListApi(emailListState, admins);
};
