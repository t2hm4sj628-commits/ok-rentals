import Types "../types/membership";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type MembershipMap = Map.Map<Common.UserId, Types.UserMembership>;

  public let defaultComparisonRows : [Types.ComparisonRow] = [
    { feature = "Unlimited Vehicle Rentals"; monthly = true; annual = true },
    { feature = "Full Fleet Access"; monthly = true; annual = true },
    { feature = "Priority Booking"; monthly = true; annual = true },
    { feature = "24/7 Concierge"; monthly = true; annual = true },
    { feature = "Dedicated Personal Liaison"; monthly = false; annual = true },
    { feature = "Complimentary Detailing"; monthly = false; annual = true },
    { feature = "New Arrival Previews"; monthly = false; annual = true },
    { feature = "Guest Rental Credits x2"; monthly = false; annual = true },
  ];

  public let defaultPlanConfigs : Types.PlanConfigs = {
    monthly = {
      name = "Monthly Elite";
      description = "Full access to our luxury fleet on a month-to-month basis.";
      price = 10000.0;
      features = [
        "Unlimited vehicle rentals",
        "Access to entire luxury fleet",
        "Priority booking guarantee",
        "24/7 concierge support",
        "Flexible cancellation policy"
      ];
    };
    annual = {
      name = "Annual Elite";
      description = "Premium year-round access with exclusive member benefits and maximum savings.";
      price = 100000.0;
      features = [
        "Everything in Monthly Elite",
        "2 months free (save $10,000)",
        "Exclusive VIP events access",
        "Dedicated account manager",
        "Complimentary airport transfers",
        "First access to new fleet additions"
      ];
    };
  };

  public func getComparisonRows(
    state : { var rows : [Types.ComparisonRow] }
  ) : [Types.ComparisonRow] {
    state.rows;
  };

  public func setComparisonRows(
    state : { var rows : [Types.ComparisonRow] },
    rows : [Types.ComparisonRow]
  ) {
    state.rows := rows;
  };

  public func getPlanConfigs(
    planConfigs : { var monthly : Types.MembershipPlanConfig; var annual : Types.MembershipPlanConfig }
  ) : Types.PlanConfigs {
    { monthly = planConfigs.monthly; annual = planConfigs.annual };
  };

  public func setPlanConfigs(
    planConfigs : { var monthly : Types.MembershipPlanConfig; var annual : Types.MembershipPlanConfig },
    configs : Types.PlanConfigs
  ) {
    planConfigs.monthly := configs.monthly;
    planConfigs.annual := configs.annual;
  };

  public func setMembershipPricing(
    pricingState : { var monthly : Float; var annual : Float },
    monthly : Float,
    annual : Float
  ) {
    pricingState.monthly := monthly;
    pricingState.annual := annual;
  };

  public func getMembershipPricing(
    pricingState : { var monthly : Float; var annual : Float }
  ) : { monthly : Float; annual : Float } {
    { monthly = pricingState.monthly; annual = pricingState.annual };
  };

  public func subscribe(
    memberships : MembershipMap,
    userId : Common.UserId,
    plan : Types.MembershipPlan
  ) : Types.UserMembership {
    let now = Time.now();
    // 30 days or 365 days in nanoseconds
    let duration : Int = switch (plan) {
      case (#monthly) { 30 * 24 * 60 * 60 * 1_000_000_000 };
      case (#annual) { 365 * 24 * 60 * 60 * 1_000_000_000 };
    };
    let membership : Types.UserMembership = {
      userId;
      plan;
      startDate = now;
      endDate = now + duration;
      status = #pending;
    };
    memberships.add(userId, membership);
    membership;
  };

  public func updateMembershipStatus(
    memberships : MembershipMap,
    userId : Common.UserId,
    status : Types.MembershipStatus
  ) : Bool {
    switch (memberships.get(userId)) {
      case null { false };
      case (?m) {
        memberships.add(userId, { m with status });
        true;
      };
    };
  };

  public func getMembership(memberships : MembershipMap, userId : Common.UserId) : ?Types.UserMembership {
    memberships.get(userId);
  };

  public func cancelMembership(memberships : MembershipMap, userId : Common.UserId) : Bool {
    switch (memberships.get(userId)) {
      case null { false };
      case (?m) {
        if (m.status == #cancelled) {
          return false;
        };
        memberships.add(userId, { m with status = #cancelled });
        true;
      };
    };
  };
};
