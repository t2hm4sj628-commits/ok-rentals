import Common "common";

module {
  public type MembershipPlanConfig = {
    name : Text;
    description : Text;
    price : Float;
    features : [Text];
  };

  public type PlanConfigs = {
    monthly : MembershipPlanConfig;
    annual : MembershipPlanConfig;
  };

  public type ComparisonRow = {
    feature : Text;
    monthly : Bool;
    annual : Bool;
  };

  public type MembershipPlan = {
    #monthly;
    #annual;
  };

  public type MembershipStatus = {
    #active;
    #pending;
    #failed;
    #cancelled;
    #expired;
  };

  public type UserMembership = {
    userId : Common.UserId;
    plan : MembershipPlan;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    status : MembershipStatus;
  };
};
