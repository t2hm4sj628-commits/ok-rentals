import EmailListLib "../lib/email-list";
import AdminLib "../lib/admin";
import Array "mo:core/Array";

mixin (
  emailListState : EmailListLib.EmailListState,
  admins : AdminLib.AdminSet
) {
  public shared ({ caller }) func subscribeToEmailList(email : Text) : async { #ok; #err : Text } {
    if (email == "") { return #err "Email required" };
    let added = EmailListLib.subscribe(emailListState, email);
    if (added) { #ok } else { #err "Already subscribed" };
  };

  public shared ({ caller }) func adminGetEmailSubscribers() : async [EmailListLib.EmailSubscriber] {
    if (not AdminLib.isAdmin(admins, caller)) { return [] };
    EmailListLib.getAll(emailListState);
  };

  public shared ({ caller }) func adminSendPromoEmail(subject : Text, htmlBody : Text) : async { #ok : Nat; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    let subscribers = EmailListLib.getAll(emailListState);
    if (subscribers.size() == 0) {
      return #ok 0;
    };
    // Bulk send is handled externally via admin tooling; return subscriber count
    #ok (subscribers.size());
  };
};
