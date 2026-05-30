import CeoProfileTypes "../types/ceo-profile";
import Set "mo:core/Set";
import Common "../types/common";
import CeoProfileLib "../lib/ceo-profile";
import Runtime "mo:core/Runtime";

mixin (
  ceoProfileState : { var ceoProfile : CeoProfileTypes.CeoProfile },
  admins : Set.Set<Common.UserId>
) {
  /// Returns the current CEO profile.
  public query func getCeoProfile() : async CeoProfileTypes.CeoProfile {
    CeoProfileLib.get(ceoProfileState);
  };

  /// Admin-only: update the CEO profile.
  public shared ({ caller }) func setCeoProfile(profile : CeoProfileTypes.CeoProfile) : async () {
    switch (CeoProfileLib.set(ceoProfileState, admins, caller, profile)) {
      case (#ok) {};
      case (#err msg) { Runtime.trap(msg) };
    };
  };
};
