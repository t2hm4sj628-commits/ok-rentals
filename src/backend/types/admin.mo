import Common "./common";

module {
  public type AdminRole = {
    #owner;
    #manager;
    #support;
    #viewer;
  };

  public type AdminEntry = {
    principal : Principal;
    role : AdminRole;
    assignedAt : Common.Timestamp;
  };

  public type AuditLog = {
    id : Nat;
    performer : Principal;
    action : Text;
    target : ?Text;
    timestamp : Common.Timestamp;
  };
};
