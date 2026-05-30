import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  // userId -> invite code
  public type CodeMap = Map.Map<Principal, Text>;
  // code -> List of referred userIds
  public type ReferralMap = Map.Map<Text, Nat>;

  public type ReferralState = {
    codes : CodeMap;
    counts : ReferralMap;
    var nextCode : Nat;
  };

  public func newState() : ReferralState {
    {
      codes = Map.empty<Principal, Text>();
      counts = Map.empty<Text, Nat>();
      var nextCode = 1;
    };
  };

  func generateCode(userId : Principal, seq : Nat) : Text {
    // Short deterministic code: first 6 chars of principal + sequence
    let p = userId.toText();
    let prefix = if (p.size() >= 6) { Text.fromIter(p.chars().take(6)) } else { p };
    prefix # "-" # seq.toText();
  };

  public func getOrCreateCode(state : ReferralState, userId : Principal) : Text {
    switch (state.codes.get(userId)) {
      case (?code) { code };
      case null {
        let code = generateCode(userId, state.nextCode);
        state.nextCode += 1;
        state.codes.add(userId, code);
        state.counts.add(code, 0);
        code;
      };
    };
  };

  public func trackReferral(state : ReferralState, code : Text, _newUserId : Principal) : Bool {
    switch (state.counts.get(code)) {
      case null { false };
      case (?n) {
        state.counts.add(code, n + 1);
        true;
      };
    };
  };

  public func getStats(state : ReferralState, userId : Principal) : { code : Text; referralCount : Nat } {
    let code = getOrCreateCode(state, userId);
    let referralCount = switch (state.counts.get(code)) {
      case null { 0 };
      case (?n) { n };
    };
    { code; referralCount };
  };
};
