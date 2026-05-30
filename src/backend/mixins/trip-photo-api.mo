import TripPhotoLib "../lib/trip-photo";
import TripPhotoTypes "../types/trip-photo";
import BookingLib "../lib/booking";
import AdminLib "../lib/admin";
import Principal "mo:core/Principal";

mixin (
  tripPhotos : TripPhotoLib.TripPhotos,
  tripPhotoState : TripPhotoLib.TripPhotoState,
  bookings : BookingLib.BookingMap,
  admins : AdminLib.AdminSet
) {
  public shared ({ caller }) func addTripPhoto(
    bookingId : Text,
    phase : Text,
    photoId : Text
  ) : async { #ok : TripPhotoTypes.TripPhoto; #err : Text } {
    // Parse bookingId as Nat to look up booking
    let bookingIdNat : ?Nat = do {
      var n : Nat = 0;
      var valid = true;
      for (c in bookingId.chars()) {
        switch (c) {
          case '0' { n := n * 10 + 0 };
          case '1' { n := n * 10 + 1 };
          case '2' { n := n * 10 + 2 };
          case '3' { n := n * 10 + 3 };
          case '4' { n := n * 10 + 4 };
          case '5' { n := n * 10 + 5 };
          case '6' { n := n * 10 + 6 };
          case '7' { n := n * 10 + 7 };
          case '8' { n := n * 10 + 8 };
          case '9' { n := n * 10 + 9 };
          case _ { valid := false };
        };
      };
      if (valid) { ?n } else { null };
    };
    let isAdmin = AdminLib.isAdmin(admins, caller);
    // Check booking ownership if not admin
    switch (bookingIdNat) {
      case null {
        if (not isAdmin) { return #err "Invalid bookingId" };
      };
      case (?bid) {
        switch (bookings.get(bid)) {
          case null {
            if (not isAdmin) { return #err "Booking not found" };
          };
          case (?b) {
            if (not isAdmin and not Principal.equal(b.userId, caller)) {
              return #err "Not authorized";
            };
          };
        };
      };
    };
    let tripPhase : TripPhotoTypes.TripPhotoPhase = if (phase == "after") { #after } else { #before };
    let photo = TripPhotoLib.addPhoto(tripPhotos, tripPhotoState, bookingId, caller, tripPhase, photoId);
    #ok photo;
  };

  public shared ({ caller }) func getTripPhotos(bookingId : Text) : async [TripPhotoTypes.TripPhoto] {
    TripPhotoLib.getPhotos(tripPhotos, bookingId);
  };
};
