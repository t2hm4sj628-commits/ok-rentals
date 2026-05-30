import Common "common";
import Membership "membership";

module {
  public type UserProfile = {
    principal : Common.UserId;
    displayName : Text;
    email : Text;
    createdAt : Common.Timestamp;
    membershipStatus : ?Membership.MembershipStatus;
  };
};
