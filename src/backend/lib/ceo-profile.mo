import Types "../types/ceo-profile";
import Set "mo:core/Set";
import Common "../types/common";

module {
  public let defaultProfile : Types.CeoProfile = {
    photoUrl = "/assets/ceo-stan.jpeg";
    instagramHandle = "@_stannoodles";
    name = "Stan";
    title = "Chief Executive Officer, OK Rentals";
    description = "Passionate about luxury automotive culture and delivering premium experiences.";
  };

  /// Get the current CEO profile.
  public func get(state : { var ceoProfile : Types.CeoProfile }) : Types.CeoProfile {
    state.ceoProfile;
  };

  /// Set the CEO profile (caller must be admin).
  public func set(
    state : { var ceoProfile : Types.CeoProfile },
    admins : Set.Set<Common.UserId>,
    caller : Common.UserId,
    newProfile : Types.CeoProfile
  ) : { #ok; #err : Text } {
    if (not admins.contains(caller)) {
      return #err("Unauthorized");
    };
    state.ceoProfile := newProfile;
    #ok;
  };
};
