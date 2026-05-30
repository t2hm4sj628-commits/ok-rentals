import MessageTypes "../types/message";
import BookingTypes "../types/booking";
import MessagingLib "../lib/messaging";
import BookingLib "../lib/booking";
import AdminLib "../lib/admin";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

mixin (
  messages : MessagingLib.MessageMap,
  messageState : MessagingLib.MessageState,
  bookings : BookingLib.BookingMap,
  admins : AdminLib.AdminSet
) {
  public shared ({ caller }) func sendMessage(
    bookingId : Nat,
    content : Text
  ) : async { #ok : MessageTypes.Message; #err : Text } {
    let isAdmin = AdminLib.isAdmin(admins, caller);
    let isOwner = MessagingLib.isBookingOwner(bookings, bookingId, caller);
    if (not isAdmin and not isOwner) {
      return #err "Not authorized to send messages for this booking";
    };
    let role : Text = if (isAdmin) "admin" else "renter";
    let msg = MessagingLib.sendMessage(messages, messageState, bookingId, caller, role, content);
    #ok msg;
  };

  public shared ({ caller }) func getMessages(bookingId : Nat) : async { #ok : [MessageTypes.Message]; #err : Text } {
    let isAdmin = AdminLib.isAdmin(admins, caller);
    let isOwner = MessagingLib.isBookingOwner(bookings, bookingId, caller);
    if (not isAdmin and not isOwner) {
      return #err "Not authorized to view messages for this booking";
    };
    #ok (MessagingLib.getMessages(messages, bookingId));
  };
};
