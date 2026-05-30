import VehicleTypes "../types/vehicle";
import BookingTypes "../types/booking";
import VehicleLib "../lib/vehicle";
import Map "mo:core/Map";
import AdminLib "../lib/admin";
import Runtime "mo:core/Runtime";

mixin (
  vehicles : VehicleLib.VehicleMap,
  photoOverrides : VehicleLib.PhotoOverrideMap,
  bookings : Map.Map<BookingTypes.BookingId, BookingTypes.Booking>,
  admins : AdminLib.AdminSet,
  vehicleState : { var nextVehicleId : Nat },
  sortOrdersState : { var orders : [(VehicleTypes.VehicleId, Nat)] }
) {
  public query func listVehicles() : async [VehicleTypes.Vehicle] {
    VehicleLib.listVehicles(vehicles, sortOrdersState.orders);
  };

  public query func getVehicleSortOrders() : async [(VehicleTypes.VehicleId, Nat)] {
    sortOrdersState.orders;
  };

  public shared ({ caller }) func adminSetVehicleSortOrders(
    orders : [(VehicleTypes.VehicleId, Nat)]
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    sortOrdersState.orders := orders;
    #ok;
  };

  public query func getVehicle(id : VehicleTypes.VehicleId) : async ?VehicleTypes.Vehicle {
    VehicleLib.getVehicle(vehicles, id);
  };

  public query func checkVehicleAvailability(
    vehicleId : VehicleTypes.VehicleId,
    startDate : Int,
    endDate : Int
  ) : async Bool {
    VehicleLib.checkAvailability(vehicles, bookings, vehicleId, startDate, endDate);
  };

  public shared ({ caller }) func adminAddVehicle(
    data : VehicleTypes.VehicleInput
  ) : async { #ok : VehicleTypes.Vehicle; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    #ok (VehicleLib.adminAddVehicle(vehicles, vehicleState, data));
  };

  public shared ({ caller }) func adminUpdateVehicle(
    id : VehicleTypes.VehicleId,
    data : VehicleTypes.VehicleInput
  ) : async { #ok : VehicleTypes.Vehicle; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    switch (VehicleLib.adminUpdateVehicle(vehicles, photoOverrides, id, data)) {
      case null { #err "Vehicle not found" };
      case (?v) { #ok v };
    };
  };

  public shared ({ caller }) func adminDeleteVehicle(
    id : VehicleTypes.VehicleId
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    if (VehicleLib.adminDeleteVehicle(vehicles, id)) {
      #ok;
    } else {
      #err "Vehicle not found";
    };
  };

  public shared ({ caller }) func adminSetVehiclePhoto(
    id : VehicleTypes.VehicleId,
    imageUrl : Text
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    if (VehicleLib.adminSetVehiclePhoto(vehicles, photoOverrides, id, imageUrl)) {
      #ok;
    } else {
      #err "Vehicle not found";
    };
  };
};
