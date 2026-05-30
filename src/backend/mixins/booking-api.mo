import BookingTypes "../types/booking";
import VehicleLib "../lib/vehicle";
import BookingLib "../lib/booking";
import Int "mo:core/Int";
import AdminLib "../lib/admin";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import RateLimitLib "../lib/ratelimit";
import ErrorLogLib "../lib/errorlog";

mixin (
  bookings : BookingLib.BookingMap,
  vehicles : VehicleLib.VehicleMap,
  bookingState : { var nextId : Nat },
  admins : AdminLib.AdminSet,
  rateLimitMap : RateLimitLib.RateLimitMap,
  errorBuf : ErrorLogLib.ErrorBuffer,
  errorLogState : ErrorLogLib.ErrorLogState
) {
  public shared ({ caller }) func createBooking(
    vehicleId : Nat,
    startDate : Int,
    endDate : Int,
    paymentMethod : BookingTypes.PaymentMethod
  ) : async { #ok : BookingTypes.Booking; #err : Text } {
    if (not RateLimitLib.checkRateLimit(rateLimitMap, "booking:" # caller.toText(), 5, 3600)) {
      return #err "Rate limit exceeded. Please wait before submitting another booking.";
    };
    if (endDate <= startDate) {
      ErrorLogLib.logError(errorBuf, errorLogState, "BookingValidation", "Invalid date range for booking", ?(caller.toText()));
      return #err "End date must be after start date";
    };
    let isAvailable = VehicleLib.checkAvailability(vehicles, bookings, vehicleId, startDate, endDate);
    if (not isAvailable) {
      ErrorLogLib.logError(errorBuf, errorLogState, "BookingUnavailable", "Vehicle " # vehicleId.toText() # " not available for requested dates", ?(caller.toText()));
      return #err "Vehicle is not available for the selected dates";
    };
    let vehicle = switch (VehicleLib.getVehicle(vehicles, vehicleId)) {
      case (?v) { v };
      case null {
        ErrorLogLib.logError(errorBuf, errorLogState, "BookingVehicleNotFound", "Vehicle " # vehicleId.toText() # " not found", ?(caller.toText()));
        return #err "Vehicle not found";
      };
    };
    let nanosPerDay : Int = 24 * 60 * 60 * 1_000_000_000;
    let days : Nat = Int.abs((endDate - startDate) / nanosPerDay);
    let totalCost : Nat = vehicle.dailyRate * (if (days == 0) 1 else days);
    let booking = BookingLib.createBooking(bookings, bookingState, vehicleId, caller, startDate, endDate, totalCost, paymentMethod);
    #ok booking;
  };

  public query ({ caller }) func getMyBookings() : async [BookingTypes.Booking] {
    BookingLib.getBookingsByUser(bookings, caller);
  };

  public query func getBookingById(id : BookingTypes.BookingId) : async ?BookingTypes.Booking {
    BookingLib.getBookingById(bookings, id);
  };

  public shared ({ caller }) func cancelBooking(id : BookingTypes.BookingId) : async Bool {
    BookingLib.cancelBooking(bookings, id, caller);
  };

  public shared ({ caller }) func adminGetAllBookings() : async [BookingTypes.Booking] {
    if (not AdminLib.isAdmin(admins, caller)) {
      Runtime.trap("Not authorized");
    };
    BookingLib.getAllBookings(bookings);
  };

  public shared ({ caller }) func adminUpdateBookingStatus(
    bookingId : BookingTypes.BookingId,
    status : BookingTypes.BookingStatus
  ) : async { #ok : BookingTypes.Booking; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    // When transitioning to #approved or #active, lock the dates on the vehicle
    let lockDates = status == #approved;
    // When transitioning to #returned, free the vehicle's booked dates
    let freeDates = status == #returned;
    switch (BookingLib.adminUpdateBookingStatus(bookings, bookingId, status)) {
      case null { #err "Booking not found or transition not allowed" };
      case (?b) {
        if (lockDates) {
          VehicleLib.addBookedRange(vehicles, b.vehicleId, b.startDate, b.endDate);
        };
        if (freeDates) {
          VehicleLib.removeBookedRange(vehicles, b.vehicleId, b.startDate, b.endDate);
        };
        #ok b;
      };
    };
  };

  public shared ({ caller }) func adminReportDamage(
    bookingId : BookingTypes.BookingId,
    notes : Text
  ) : async { #ok : BookingTypes.Booking; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    switch (BookingLib.adminReportDamage(bookings, bookingId, notes)) {
      case null { #err "Booking not found" };
      case (?b) { #ok b };
    };
  };
};
