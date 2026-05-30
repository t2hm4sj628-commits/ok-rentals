import BookingLib "../lib/booking";
import UserLib "../lib/user";
import VehicleLib "../lib/vehicle";
import AdminLib "../lib/admin";
import Common "../types/common";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MembershipLib "../lib/membership";

mixin (
  bookings : BookingLib.BookingMap,
  vehicles : VehicleLib.VehicleMap,
  users : UserLib.UserMap,
  admins : AdminLib.AdminSet,
  memberships : MembershipLib.MembershipMap
) {
  public shared ({ caller }) func getAnalytics() : async {
    totalRevenue : Float;
    bookingCountByVehicle : [(Text, Nat)];
    fleetUtilizationPercent : Float;
    activeUserCount : Nat;
  } {
    if (not AdminLib.isAdmin(admins, caller)) {
      Runtime.trap("Not authorized");
    };

    // Total revenue: sum confirmed booking costs + active membership prices
    var bookingRevenue : Nat = 0;
    let vehicleCountMap = Map.empty<Nat, Nat>();
    var totalBookedDays : Int = 0;
    let nanosPerDay : Int = 24 * 60 * 60 * 1_000_000_000;
    let activeUserSet = Set.empty<Common.UserId>();

    bookings.values().forEach(func(b) {
      if (b.status == #approved or b.status == #active or b.status == #completed) {
        bookingRevenue += b.totalCost;
        // Count by vehicle
        let prev = switch (vehicleCountMap.get(b.vehicleId)) {
          case (?n) { n };
          case null { 0 };
        };
        vehicleCountMap.add(b.vehicleId, prev + 1);
        // Booked days
        let days : Int = (b.endDate - b.startDate) / nanosPerDay;
        totalBookedDays += if (days < 1) 1 else days;
        // Active users
        activeUserSet.add(b.userId);
      };
    });

    var membershipRevenue : Float = 0.0;
    users.keys().forEach(func(userId) {
      switch (memberships.get(userId)) {
        case (?m) {
          if (m.status == #active) {
            let price : Float = switch (m.plan) {
              case (#monthly) { 299.0 };
              case (#annual) { 2999.0 };
            };
            membershipRevenue += price;
            activeUserSet.add(userId);
          };
        };
        case null {};
      };
    });

    let totalRevenue : Float = bookingRevenue.toFloat() + membershipRevenue;

    // bookingCountByVehicle: map vehicleId to vehicle name + count
    let vehicleCountArr : [(Text, Nat)] = vehicleCountMap.entries().map<(Nat, Nat), (Text, Nat)>(
      func((vid, cnt)) {
        let name = switch (vehicles.get(vid)) {
          case (?v) { v.name };
          case null { vid.toText() };
        };
        (name, cnt);
      }
    ).toArray();

    // Fleet utilization: total booked days / (vehicleCount * 30) * 100
    let vehicleCount = vehicles.size();
    let fleetUtilizationPercent : Float = if (vehicleCount == 0) {
      0.0;
    } else {
      let maxDays : Float = (vehicleCount * 30).toFloat();
      totalBookedDays.toFloat() / maxDays * 100.0;
    };

    {
      totalRevenue;
      bookingCountByVehicle = vehicleCountArr;
      fleetUtilizationPercent;
      activeUserCount = activeUserSet.size();
    };
  };
};
