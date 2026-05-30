import Types "../types/id-verification";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type IDVerifications = Map.Map<Text, Types.IDVerification>;

  public func newState() : IDVerifications {
    Map.empty<Text, Types.IDVerification>();
  };

  public func submitVerification(
    state : IDVerifications,
    userId : Principal,
    bookingId : Text,
    licensePhotoId : Text,
    ssnLast4 : Text
  ) : Types.IDVerification {
    let entry : Types.IDVerification = {
      userId;
      bookingId;
      licensePhotoId;
      ssnLast4;
      status = #pending;
      adminNotes = "";
      submittedAt = Time.now();
      reviewedAt = 0;
    };
    state.add(bookingId, entry);
    entry;
  };

  public func getVerification(state : IDVerifications, bookingId : Text) : ?Types.IDVerification {
    state.get(bookingId);
  };

  public func adminGetAllPending(state : IDVerifications) : [Types.IDVerification] {
    state.values().filter(func(v) { v.status == #pending }).toArray();
  };

  public func adminReview(
    state : IDVerifications,
    bookingId : Text,
    status : Types.IDVerificationStatus,
    notes : Text
  ) : ?Types.IDVerification {
    switch (state.get(bookingId)) {
      case null { null };
      case (?v) {
        let updated : Types.IDVerification = { v with status; adminNotes = notes; reviewedAt = Time.now() };
        state.add(bookingId, updated);
        ?updated;
      };
    };
  };
};
