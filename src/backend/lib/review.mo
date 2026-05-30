import Types "../types/review";
import BookingTypes "../types/booking";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type ReviewMap = Map.Map<Types.ReviewId, Types.Review>;
  public type ReviewState = { var nextId : Nat };

  // Returns true if caller has a completed booking for the given vehicle
  public func hasCompletedBooking(
    bookings : Map.Map<BookingTypes.BookingId, BookingTypes.Booking>,
    vehicleId : Nat,
    caller : Common.UserId,
    bookingId : Nat
  ) : Bool {
    switch (bookings.get(bookingId)) {
      case null { false };
      case (?b) {
        b.vehicleId == vehicleId
        and Principal.equal(b.userId, caller)
        and b.status == #completed;
      };
    };
  };

  // Returns true if the user already reviewed this booking
  public func alreadyReviewed(reviews : ReviewMap, bookingId : Nat, caller : Common.UserId) : Bool {
    reviews.values().find(func(r) {
      r.bookingId == bookingId and Principal.equal(r.reviewerId, caller)
    }) != null;
  };

  public func submitReview(
    reviews : ReviewMap,
    state : ReviewState,
    vehicleId : Nat,
    bookingId : Nat,
    caller : Common.UserId,
    rating : Nat,
    comment : Text
  ) : Types.Review {
    let id = state.nextId;
    state.nextId += 1;
    let review : Types.Review = {
      id;
      vehicleId;
      reviewerId = caller;
      rating;
      comment;
      timestamp = Time.now();
      bookingId;
    };
    reviews.add(id, review);
    review;
  };

  public func getVehicleReviews(reviews : ReviewMap, vehicleId : Nat) : [Types.Review] {
    reviews.values().filter(func(r) { r.vehicleId == vehicleId }).toArray();
  };

  public func getAverageRating(reviews : ReviewMap, vehicleId : Nat) : Nat {
    let list = List.empty<Nat>();
    for (r in reviews.values()) {
      if (r.vehicleId == vehicleId) { list.add(r.rating) };
    };
    if (list.size() == 0) { return 0 };
    let total = list.foldLeft(0, func(acc, r) { acc + r });
    total / list.size();
  };
};
