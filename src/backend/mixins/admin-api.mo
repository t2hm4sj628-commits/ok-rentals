import AdminLib "../lib/admin";
import AdminTypes "../types/admin";
import Common "../types/common";
import Time "mo:core/Time";

mixin (
  admins : AdminLib.AdminSet,
  adminState : { var controller : ?Common.UserId },
  roleMap : AdminLib.AdminRoleMap,
  auditLog : AdminLib.AuditList,
  auditState : { var nextAuditId : Nat },
  openAiState : { var openAiKey : Text }
) {
  public shared ({ caller }) func addAdmin(principal : Principal) : async { #ok; #err : Text } {
    let controller = adminState.controller;
    let controllerPrincipal : Common.UserId = switch (controller) {
      case (?c) { c };
      case null { caller };
    };
    if (AdminLib.addAdmin(admins, caller, principal, controllerPrincipal, roleMap, Time.now())) {
      #ok;
    } else {
      #err "Not authorized to add admins";
    };
  };

  public shared ({ caller }) func removeAdmin(principal : Principal) : async { #ok; #err : Text } {
    if (AdminLib.removeAdmin(admins, caller, principal, roleMap)) {
      #ok;
    } else {
      #err "Not authorized to remove admins";
    };
  };

  public query func isAdmin(principal : Principal) : async Bool {
    AdminLib.isAdmin(admins, principal);
  };

  public shared ({ caller }) func assignRole(
    principal : Principal,
    role : AdminTypes.AdminRole
  ) : async { #ok; #err : Text } {
    AdminLib.assignRole(admins, roleMap, auditLog, auditState, caller, principal, role, Time.now());
  };

  public query func getAdminRole(principal : Principal) : async ?AdminTypes.AdminRole {
    AdminLib.getRole(roleMap, principal);
  };

  public shared ({ caller }) func transferOwnership(
    newOwner : Principal
  ) : async { #ok; #err : Text } {
    AdminLib.transferOwnership(admins, roleMap, auditLog, auditState, caller, newOwner, Time.now());
  };

  public query ({ caller }) func getAuditLog() : async { #ok : [AdminTypes.AuditLog]; #err : Text } {
    if (not AdminLib.isManagerOrOwner(roleMap, caller)) { return #err("Not authorized") };
    #ok(AdminLib.getAuditLog(auditLog));
  };

  public query func listAdminsWithRoles() : async [AdminTypes.AdminEntry] {
    AdminLib.listAdminsWithRoles(roleMap);
  };

  public shared ({ caller }) func adminSetOpenAIKey(key : Text) : async { #ok; #err : Text } {
    if (not AdminLib.isOwner(roleMap, caller)) { return #err("Not authorized") };
    openAiState.openAiKey := key;
    #ok;
  };
};
