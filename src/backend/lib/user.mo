import Types "../types/user";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type UserMap = Map.Map<Common.UserId, Types.UserProfile>;

  public func registerProfile(
    users : UserMap,
    principal : Common.UserId,
    displayName : Text,
    email : Text
  ) : Types.UserProfile {
    let profile : Types.UserProfile = {
      principal;
      displayName;
      email;
      createdAt = Time.now();
      membershipStatus = null;
    };
    users.add(principal, profile);
    profile;
  };

  public func updateProfile(
    users : UserMap,
    principal : Common.UserId,
    displayName : Text,
    email : Text
  ) : ?Types.UserProfile {
    switch (users.get(principal)) {
      case null { null };
      case (?existing) {
        let updated : Types.UserProfile = { existing with displayName; email };
        users.add(principal, updated);
        ?updated;
      };
    };
  };

  public func getProfile(users : UserMap, principal : Common.UserId) : ?Types.UserProfile {
    users.get(principal);
  };
};
