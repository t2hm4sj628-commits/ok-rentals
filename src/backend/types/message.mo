import Common "common";

module {
  public type MessageId = Nat;

  public type Message = {
    id : MessageId;
    bookingId : Nat;
    senderId : Common.UserId;
    senderRole : Text;  // "renter" or "admin"
    content : Text;
    timestamp : Int;
  };
};
