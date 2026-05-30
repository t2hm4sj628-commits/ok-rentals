import UserTypes "../types/user";
import UserLib "../lib/user";
import Common "../types/common";
import AdminLib "../lib/admin";
import Runtime "mo:core/Runtime";

mixin (
  users : UserLib.UserMap,
  admins : AdminLib.AdminSet
) {
  public shared ({ caller }) func registerProfile(
    displayName : Text,
    email : Text
  ) : async UserTypes.UserProfile {
    UserLib.registerProfile(users, caller, displayName, email);
  };

  public shared ({ caller }) func updateProfile(
    displayName : Text,
    email : Text
  ) : async ?UserTypes.UserProfile {
    UserLib.updateProfile(users, caller, displayName, email);
  };

  public query func getProfile(principal : Common.UserId) : async ?UserTypes.UserProfile {
    UserLib.getProfile(users, principal);
  };

  public query ({ caller }) func getMyProfile() : async ?UserTypes.UserProfile {
    UserLib.getProfile(users, caller);
  };

  public shared ({ caller }) func adminListUsers() : async [UserTypes.UserProfile] {
    if (not AdminLib.isAdmin(admins, caller)) {
      Runtime.trap("Not authorized");
    };
    users.values().toArray();
  };
};
