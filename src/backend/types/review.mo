import Common "common";

module {
  public type ReviewId = Nat;

  public type Review = {
    id : ReviewId;
    vehicleId : Nat;
    reviewerId : Common.UserId;
    rating : Nat;   // 1–5
    comment : Text;
    timestamp : Int;
    bookingId : Nat;
  };
};
