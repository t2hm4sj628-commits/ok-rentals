import Types "../types/booking";
import Common "../types/common";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Map "mo:core/Map";

module {
  public type BookingMap = Map.Map<Types.BookingId, Types.Booking>;

  public func createBooking(
    bookings : BookingMap,
    state : { var nextId : Nat },
    vehicleId : Nat,
    userId : Common.UserId,
    startDate : Common.Timestamp,
    endDate : Common.Timestamp,
    totalCost : Nat,
    paymentMethod : Types.PaymentMethod
  ) : Types.Booking {
    let id = state.nextId;
    state.nextId += 1;
    let booking : Types.Booking = {
      id;
      vehicleId;
      userId;
      startDate;
      endDate;
      totalCost;
      status = #pending;
      paymentMethod;
      paymentStatus = #pending;
      stripeSessionId = null;
      cryptoTxRef = null;
      createdAt = Time.now();
      damageClaimFlag = false;
      damageNotes = "";
    };
    bookings.add(id, booking);
    booking;
  };

  public func getBookingsByUser(bookings : BookingMap, userId : Common.UserId) : [Types.Booking] {
    bookings.values().filter(func(b) { Principal.equal(b.userId, userId) }).toArray();
  };

  public func getBookingById(bookings : BookingMap, id : Types.BookingId) : ?Types.Booking {
    bookings.get(id);
  };

  public func getAllBookings(bookings : BookingMap) : [Types.Booking] {
    bookings.values().toArray();
  };

  public func adminUpdateBookingStatus(
    bookings : BookingMap,
    id : Types.BookingId,
    status : Types.BookingStatus
  ) : ?Types.Booking {
    switch (bookings.get(id)) {
      case null { null };
      case (?b) {
        // Validate allowed transitions
        let allowed = switch (b.status) {
          case (#pending) { status == #approved or status == #cancelled };
          case (#approved) { status == #active or status == #cancelled };
          case (#active) { status == #completed };
          case (#completed) { status == #returned };
          case (#returned) { false };
          case (#cancelled) { false };
        };
        if (not allowed) { return null };
        let updated : Types.Booking = { b with status };
        bookings.add(id, updated);
        ?updated;
      };
    };
  };

  public func adminReportDamage(
    bookings : BookingMap,
    id : Types.BookingId
,    notes : Text
  ) : ?Types.Booking {
    switch (bookings.get(id)) {
      case null { null };
      case (?b) {
        let updated : Types.Booking = { b with damageClaimFlag = true; damageNotes = notes };
        bookings.add(id, updated);
        ?updated;
      };
    };
  };

  public func cancelBooking(bookings : BookingMap, id : Types.BookingId, caller : Common.UserId) : Bool {
    switch (bookings.get(id)) {
      case null { false };
      case (?b) {
        if (not Principal.equal(b.userId, caller)) {
          return false;
        };
        if (b.status == #cancelled) {
          return false;
        };
        bookings.add(id, { b with status = #cancelled });
        true;
      };
    };
  };
};
