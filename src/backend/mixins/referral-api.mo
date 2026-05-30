import ReferralLib "../lib/referral";

mixin (
  referralState : ReferralLib.ReferralState
) {
  public shared ({ caller }) func getMyReferralCode() : async Text {
    ReferralLib.getOrCreateCode(referralState, caller);
  };

  public shared ({ caller }) func getReferralStats() : async { code : Text; referralCount : Nat } {
    ReferralLib.getStats(referralState, caller);
  };
};
