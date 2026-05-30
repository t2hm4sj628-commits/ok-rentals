import PolicyLib "../lib/policy";
import AdminLib "../lib/admin";
import Runtime "mo:core/Runtime";

mixin (
  policyState : PolicyLib.PolicyState,
  admins : AdminLib.AdminSet
) {
  public query func getPolicies() : async { cancellationPolicy : Text; insuranceWaiverTerms : Text; damagePolicy : Text } {
    PolicyLib.getPolicies(policyState);
  };

  public shared ({ caller }) func adminUpdatePolicy(
    policyType : Text,
    content : Text
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    if (PolicyLib.updatePolicy(policyState, policyType, content)) {
      #ok;
    } else {
      #err "Unknown policy type. Use: cancellation, insurance, or damage";
    };
  };
};
