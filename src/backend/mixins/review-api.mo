import ReviewTypes "../types/review";
import BookingTypes "../types/booking";
import ReviewLib "../lib/review";
import BookingLib "../lib/booking";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

mixin (
  reviews : ReviewLib.ReviewMap,
  reviewState : ReviewLib.ReviewState,
  bookings : BookingLib.BookingMap
) {
  public shared ({ caller }) func submitReview(
    vehicleId : Nat,
    bookingId : Nat,
    rating : Nat,
    comment : Text
  ) : async { #ok : ReviewTypes.Review; #err : Text } {
    if (rating < 1 or rating > 5) {
      return #err "Rating must be between 1 and 5";
    };
    if (not ReviewLib.hasCompletedBooking(bookings, vehicleId, caller, bookingId)) {
      return #err "You can only review vehicles from completed bookings";
    };
    if (ReviewLib.alreadyReviewed(reviews, bookingId, caller)) {
      return #err "You have already submitted a review for this booking";
    };
    let review = ReviewLib.submitReview(reviews, reviewState, vehicleId, bookingId, caller, rating, comment);
    #ok review;
  };

  public query func getVehicleReviews(vehicleId : Nat) : async [ReviewTypes.Review] {
    ReviewLib.getVehicleReviews(reviews, vehicleId);
  };

  public query func getAverageRating(vehicleId : Nat) : async Nat {
    ReviewLib.getAverageRating(reviews, vehicleId);
  };
};
