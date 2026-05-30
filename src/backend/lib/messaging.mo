import Types "../types/message";
import BookingTypes "../types/booking";
import Common "../types/common";
import AdminLib "../lib/admin";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type MessageMap = Map.Map<Types.MessageId, Types.Message>;
  public type MessageState = { var nextId : Nat };

  // Check if caller is the booking owner
  public func isBookingOwner(
    bookings : Map.Map<BookingTypes.BookingId, BookingTypes.Booking>,
    bookingId : Nat,
    caller : Common.UserId
  ) : Bool {
    switch (bookings.get(bookingId)) {
      case null { false };
      case (?b) { Principal.equal(b.userId, caller) };
    };
  };

  public func sendMessage(
    messages : MessageMap,
    state : MessageState,
    bookingId : Nat,
    senderId : Common.UserId,
    senderRole : Text,
    content : Text
  ) : Types.Message {
    let id = state.nextId;
    state.nextId += 1;
    let msg : Types.Message = {
      id;
      bookingId;
      senderId;
      senderRole;
      content;
      timestamp = Time.now();
    };
    messages.add(id, msg);
    msg;
  };

  public func getMessages(
    messages : MessageMap,
    bookingId : Nat
  ) : [Types.Message] {
    messages.values().filter(func(m) { m.bookingId == bookingId }).toArray();
  };
};
