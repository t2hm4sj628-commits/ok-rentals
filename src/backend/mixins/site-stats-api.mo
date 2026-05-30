import VehicleLib "../lib/vehicle";
import AdminLib "../lib/admin";
import AdminTypes "../types/admin";
import Common "../types/common";
import Time "mo:core/Time";

mixin (
  vehicles : VehicleLib.VehicleMap,
  admins : AdminLib.AdminSet,
  siteStatsState : {
    var satisfiedClients : Text;
    var conciergeSupport : Text;
    var fiveStarReviews : Text;
  },
  auditLog : AdminLib.AuditList,
  auditState : { var nextAuditId : Nat }
) {
  public query func getSiteStats() : async {
    eliteVehicles : Nat;
    satisfiedClients : Text;
    conciergeSupport : Text;
    fiveStarReviews : Text;
  } {
    {
      eliteVehicles = VehicleLib.listVehicles(vehicles, []).size();
      satisfiedClients = siteStatsState.satisfiedClients;
      conciergeSupport = siteStatsState.conciergeSupport;
      fiveStarReviews = siteStatsState.fiveStarReviews;
    };
  };

  public shared ({ caller }) func adminSetSiteStats(
    satisfiedClients : Text,
    conciergeSupport : Text,
    fiveStarReviews : Text
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    siteStatsState.satisfiedClients := satisfiedClients;
    siteStatsState.conciergeSupport := conciergeSupport;
    siteStatsState.fiveStarReviews := fiveStarReviews;
    let id = auditState.nextAuditId;
    auditState.nextAuditId += 1;
    auditLog.add({
      id;
      performer = caller;
      action = "adminSetSiteStats";
      target = ?"site-stats";
      timestamp = Time.now();
    });
    #ok;
  };
};
