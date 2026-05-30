import MembershipTypes "../types/membership";
import MembershipLib "../lib/membership";
import AdminLib "../lib/admin";
import Common "../types/common";
import Principal "mo:core/Principal";
import RateLimitLib "../lib/ratelimit";
import ErrorLogLib "../lib/errorlog";

mixin (
  memberships : MembershipLib.MembershipMap,
  admins : AdminLib.AdminSet,
  pricingState : { var monthly : Float; var annual : Float },
  planConfigs : { var monthly : MembershipTypes.MembershipPlanConfig; var annual : MembershipTypes.MembershipPlanConfig },
  comparisonRowsState : { var rows : [MembershipTypes.ComparisonRow] },
  rateLimitMap : RateLimitLib.RateLimitMap,
  errorBuf : ErrorLogLib.ErrorBuffer,
  errorLogState : ErrorLogLib.ErrorLogState
) {
  public shared ({ caller }) func subscribeMembership(
    plan : MembershipTypes.MembershipPlan
  ) : async { #ok : MembershipTypes.UserMembership; #err : Text } {
    if (not RateLimitLib.checkRateLimit(rateLimitMap, "membership:" # caller.toText(), 3, 3600)) {
      return #err "Rate limit exceeded.";
    };
    let membership = MembershipLib.subscribe(memberships, caller, plan);
    #ok membership;
  };

  public shared ({ caller }) func updateMembershipStatus(
    userId : Common.UserId,
    status : MembershipTypes.MembershipStatus
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    if (MembershipLib.updateMembershipStatus(memberships, userId, status)) {
      #ok;
    } else {
      #err "Membership not found";
    };
  };

  public query ({ caller }) func getMyMembership() : async ?MembershipTypes.UserMembership {
    MembershipLib.getMembership(memberships, caller);
  };

  public shared ({ caller }) func cancelMembership() : async Bool {
    MembershipLib.cancelMembership(memberships, caller);
  };

  public shared ({ caller }) func adminSetMembershipPricing(
    monthly : Float,
    annual : Float
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    MembershipLib.setMembershipPricing(pricingState, monthly, annual);
    #ok;
  };

  public query func getMembershipPricing() : async { monthly : Float; annual : Float } {
    MembershipLib.getMembershipPricing(pricingState);
  };

  public query func getPlanConfigs() : async MembershipTypes.PlanConfigs {
    MembershipLib.getPlanConfigs(planConfigs);
  };

  public shared ({ caller }) func setPlanConfigs(
    configs : MembershipTypes.PlanConfigs
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    MembershipLib.setPlanConfigs(planConfigs, configs);
    #ok;
  };
  public query func getComparisonRows() : async [MembershipTypes.ComparisonRow] {
    MembershipLib.getComparisonRows(comparisonRowsState);
  };

  public shared ({ caller }) func setComparisonRows(
    rows : [MembershipTypes.ComparisonRow]
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    MembershipLib.setComparisonRows(comparisonRowsState, rows);
    #ok;
  };
};
