import Common "../types/common";
import AdminTypes "../types/admin";
import Set "mo:core/Set";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  // Legacy set kept for backward compatibility during transition
  public type AdminSet = Set.Set<Common.UserId>;

  public type AdminRoleMap = Map.Map<Common.UserId, AdminTypes.AdminEntry>;
  public type AuditList = List.List<AdminTypes.AuditLog>;

  public func isAdmin(admins : AdminSet, principal : Common.UserId) : Bool {
    admins.contains(principal);
  };

  public func addAdmin(admins : AdminSet, caller : Common.UserId, principal : Common.UserId, controller : Common.UserId, roleMap : AdminRoleMap, now : Common.Timestamp) : Bool {
    if (not isAdmin(admins, caller) and not Principal.equal(caller, controller)) {
      return false;
    };
    admins.add(principal);
    // Also ensure an entry in roleMap so listAdminsWithRoles reflects this admin
    if (roleMap.get(principal) == null) {
      roleMap.add(principal, { principal = principal; role = #viewer; assignedAt = now });
    };
    true;
  };

  public func removeAdmin(admins : AdminSet, caller : Common.UserId, principal : Common.UserId, roleMap : AdminRoleMap) : Bool {
    if (not isAdmin(admins, caller)) {
      return false;
    };
    admins.remove(principal);
    // Also remove from roleMap so listAdminsWithRoles no longer shows this admin
    roleMap.remove(principal);
    true;
  };

  // Role-based helpers
  public func getRole(roleMap : AdminRoleMap, principal : Common.UserId) : ?AdminTypes.AdminRole {
    switch (roleMap.get(principal)) {
      case (?entry) { ?entry.role };
      case null { null };
    };
  };

  public func isOwner(roleMap : AdminRoleMap, principal : Common.UserId) : Bool {
    switch (getRole(roleMap, principal)) {
      case (?#owner) { true };
      case _ { false };
    };
  };

  public func isManagerOrOwner(roleMap : AdminRoleMap, principal : Common.UserId) : Bool {
    switch (getRole(roleMap, principal)) {
      case (?#owner) { true };
      case (?#manager) { true };
      case _ { false };
    };
  };

  public func assignRole(
    admins : AdminSet,
    roleMap : AdminRoleMap,
    auditLog : AuditList,
    auditState : { var nextAuditId : Nat },
    caller : Common.UserId,
    target : Common.UserId,
    role : AdminTypes.AdminRole,
    now : Common.Timestamp
  ) : { #ok; #err : Text } {
    if (not isOwner(roleMap, caller)) { return #err("Not authorized: caller is not owner") };
    let entry : AdminTypes.AdminEntry = { principal = target; role = role; assignedAt = now };
    roleMap.add(target, entry);
    admins.add(target);
    appendAuditLog(auditLog, auditState, caller, "assignRole", ?(target.toText()), now);
    #ok;
  };

  public func transferOwnership(
    admins : AdminSet,
    roleMap : AdminRoleMap,
    auditLog : AuditList,
    auditState : { var nextAuditId : Nat },
    caller : Common.UserId,
    newOwner : Common.UserId,
    now : Common.Timestamp
  ) : { #ok; #err : Text } {
    if (not isOwner(roleMap, caller)) { return #err("Not authorized") };
    roleMap.add(newOwner, { principal = newOwner; role = #owner; assignedAt = now });
    admins.add(newOwner);
    roleMap.add(caller, { principal = caller; role = #manager; assignedAt = now });
    appendAuditLog(auditLog, auditState, caller, "transferOwnership", ?(newOwner.toText()), now);
    #ok;
  };

  public func listAdminsWithRoles(roleMap : AdminRoleMap) : [AdminTypes.AdminEntry] {
    let buf = List.empty<AdminTypes.AdminEntry>();
    for ((_, entry) in roleMap.entries()) { buf.add(entry) };
    buf.toArray();
  };

  public func appendAuditLog(
    auditLog : AuditList,
    auditState : { var nextAuditId : Nat },
    performer : Common.UserId,
    action : Text,
    target : ?Text,
    now : Common.Timestamp
  ) : () {
    let entry : AdminTypes.AuditLog = { id = auditState.nextAuditId; performer = performer; action = action; target = target; timestamp = now };
    auditState.nextAuditId += 1;
    auditLog.add(entry);
  };

  public func getAuditLog(auditLog : AuditList) : [AdminTypes.AuditLog] {
    auditLog.toArray();
  };
};
