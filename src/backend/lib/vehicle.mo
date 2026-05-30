import Types "../types/vehicle";
import BookingTypes "../types/booking";
import Map "mo:core/Map";
import Array "mo:core/Array";

module {
  public type VehicleMap = Map.Map<Types.VehicleId, Types.Vehicle>;
  public type PhotoOverrideMap = Map.Map<Types.VehicleId, Text>;

  public func listVehicles(vehicles : VehicleMap, sortOrders : [(Types.VehicleId, Nat)]) : [Types.Vehicle] {
    let all = vehicles.values().toArray();
    if (sortOrders.size() == 0) {
      return all;
    };
    // Build a position map from vehicleId -> position
    let posMap = Map.empty<Types.VehicleId, Nat>();
    for ((vid, pos) in sortOrders.vals()) {
      posMap.add(vid, pos);
    };
    // Sort: vehicles with a position come first (by position), then the rest
    all.sort<Types.Vehicle>(
      func(a, b) {
        let pa = posMap.get(a.id);
        let pb = posMap.get(b.id);
        switch (pa, pb) {
          case (?posA, ?posB) {
            if (posA < posB) #less
            else if (posA > posB) #greater
            else #equal
          };
          case (?_, null) { #less };
          case (null, ?_) { #greater };
          case (null, null) {
            if (a.id < b.id) #less
            else if (a.id > b.id) #greater
            else #equal
          };
        };
      }
    );
  };

  public func getVehicle(vehicles : VehicleMap, id : Types.VehicleId) : ?Types.Vehicle {
    vehicles.get(id);
  };

  public func checkAvailability(
    vehicles : VehicleMap,
    bookings : Map.Map<BookingTypes.BookingId, BookingTypes.Booking>,
    vehicleId : Types.VehicleId,
    startDate : Int,
    endDate : Int
  ) : Bool {
    switch (vehicles.get(vehicleId)) {
      case null { return false };
      case (?v) {
        let rangeConflict = v.bookedRanges.find(
          func((s, e)) {
            startDate < e and s < endDate
          }
        );
        if (rangeConflict != null) { return false };
      };
    };
    // Only #approved, #active, and #completed block dates
    let conflict = bookings.values().find(
      func(b) {
        b.vehicleId == vehicleId
        and (b.status == #approved or b.status == #active or b.status == #completed)
        and b.startDate < endDate
        and b.endDate > startDate
      }
    );
    conflict == null;
  };

  public func addBookedRange(
    vehicles : VehicleMap,
    vehicleId : Types.VehicleId,
    startDate : Int,
    endDate : Int
  ) {
    switch (vehicles.get(vehicleId)) {
      case null {};
      case (?v) {
        let newRanges = v.bookedRanges.concat([(startDate, endDate)]);
        vehicles.add(vehicleId, { v with bookedRanges = newRanges });
      };
    };
  };

  // Remove booked range when a booking is returned
  public func removeBookedRange(
    vehicles : VehicleMap,
    vehicleId : Types.VehicleId,
    startDate : Int,
    endDate : Int
  ) {
    switch (vehicles.get(vehicleId)) {
      case null {};
      case (?v) {
        let filtered = v.bookedRanges.filter(func((s, e)) {
          not (s == startDate and e == endDate)
        });
        vehicles.add(vehicleId, { v with bookedRanges = filtered });
      };
    };
  };

  public func adminAddVehicle(
    vehicles : VehicleMap,
    state : { var nextVehicleId : Nat },
    data : Types.VehicleInput
  ) : Types.Vehicle {
    let id = state.nextVehicleId;
    state.nextVehicleId += 1;
    let vehicle : Types.Vehicle = {
      id;
      name = data.name;
      year = data.year;
      color = data.color;
      dailyRate = data.dailyRate;
      mileageLimit = data.mileageLimit;
      deposit = data.deposit;
      imageUrl = data.imageUrl;
      description = data.description;
      rules = data.rules;
      available = data.available;
      bookedRanges = [];
      sortOrder = 0;
    };
    vehicles.add(id, vehicle);
    vehicle;
  };

  public func adminUpdateVehicle(
    vehicles : VehicleMap,
    photoOverrides : PhotoOverrideMap,
    id : Types.VehicleId,
    data : Types.VehicleInput
  ) : ?Types.Vehicle {
    switch (vehicles.get(id)) {
      case null { null };
      case (?v) {
        // Determine the effective imageUrl: prefer a non-empty value from the form,
        // fall back to the stored override, then the existing vehicle imageUrl.
        // This prevents a blank imageUrl in the update form from wiping a photo
        // that was previously uploaded via adminSetVehiclePhoto.
        let effectiveImageUrl : Text = if (data.imageUrl != "") {
          data.imageUrl;
        } else {
          switch (photoOverrides.get(id)) {
            case (?overrideUrl) { overrideUrl };
            case null { v.imageUrl };
          };
        };
        let updated : Types.Vehicle = {
          v with
          name = data.name;
          year = data.year;
          color = data.color;
          dailyRate = data.dailyRate;
          mileageLimit = data.mileageLimit;
          deposit = data.deposit;
          imageUrl = effectiveImageUrl;
          description = data.description;
          rules = data.rules;
          available = data.available;
        };
        vehicles.add(id, updated);
        // Only persist a photo override if the form explicitly supplied a non-empty URL.
        // Never overwrite an existing override with an empty string.
        if (data.imageUrl != "") {
          photoOverrides.add(id, data.imageUrl);
        };
        ?updated;
      };
    };
  };

  public func adminDeleteVehicle(vehicles : VehicleMap, id : Types.VehicleId) : Bool {
    switch (vehicles.get(id)) {
      case null { false };
      case (?_) {
        vehicles.remove(id);
        true;
      };
    };
  };

  public func adminSetVehiclePhoto(
    vehicles : VehicleMap,
    photoOverrides : PhotoOverrideMap,
    id : Types.VehicleId,
    imageUrl : Text
  ) : Bool {
    switch (vehicles.get(id)) {
      case null { false };
      case (?v) {
        vehicles.add(id, { v with imageUrl });
        // Persist admin-uploaded photo URL so it survives future seed re-runs
        photoOverrides.add(id, imageUrl);
        true;
      };
    };
  };

  // Re-applies any admin-saved photo overrides on top of seeded defaults.
  // Call this immediately after seedVehicles() and on every canister start.
  // Re-applies any admin-saved photo overrides on top of seeded defaults.
  // Call this immediately after seedVehicles() and on every canister start.
  public func applyPhotoOverrides(
    vehicles : VehicleMap,
    photoOverrides : PhotoOverrideMap
  ) {
    // Apply all entries from the override map — admin uploads always win
    for ((id, url) in photoOverrides.entries()) {
      switch (vehicles.get(id)) {
        case null {};
        case (?v) { vehicles.add(id, { v with imageUrl = url }) };
      };
    };
  };

  public func seedVehicles(vehicles : VehicleMap) {
    let standardRules : [Text] = [
      "No smoking inside the vehicle at any time.",
      "No off-road or unpaved surface driving.",
      "Return with a full tank of fuel — fuel charges apply otherwise.",
      "Driver must be 25+ years of age with a valid driver's license.",
      "A security deposit is held and released upon damage-free return.",
      "Renter is liable for all traffic violations and tolls incurred during rental.",
      "Pets are not permitted inside the vehicle.",
      "No subletting — only the registered driver may operate the vehicle.",
      "Vehicle must be returned in the same clean condition as received.",
      "Any damage, regardless of cause, must be reported immediately.",
      "Mileage overages are billed at $3.50 per mile beyond the daily allowance.",
      "Late returns beyond 1 hour are subject to an additional day charge.",
    ];
    vehicles.add(
      0,
      {
        id = 0;
        name = "Lamborghini Urus";
        year = 2026;
        color = "White";
        dailyRate = 3000;
        mileageLimit = 150;
        deposit = 3000;
        imageUrl = "/assets/urus-white.jpeg";
        description = "Experience raw power and elegance in the 2026 Lamborghini Urus in Pearl White. This ultra-luxury SUV combines supercar performance with everyday usability, featuring a twin-turbocharged V8 engine and a stunning white exterior.";
        rules = standardRules;
        available = true;
        bookedRanges = [];
        sortOrder = 0;
      },
    );
    vehicles.add(
      1,
      {
        id = 1;
        name = "Rolls-Royce Ghost";
        year = 2026;
        color = "White";
        dailyRate = 3000;
        mileageLimit = 150;
        deposit = 3000;
        imageUrl = "/assets/rollsroyce-white.webp";
        description = "The 2026 Rolls-Royce Ghost in Arctic White is the pinnacle of automotive luxury. With its handcrafted interior, whisper-quiet cabin, and effortless power delivery, every journey becomes an unforgettable experience.";
        rules = standardRules;
        available = true;
        bookedRanges = [];
        sortOrder = 0;
      },
    );
    vehicles.add(
      2,
      {
        id = 2;
        name = "Lamborghini Urus";
        year = 2026;
        color = "Black";
        dailyRate = 3000;
        mileageLimit = 150;
        deposit = 3000;
        imageUrl = "/assets/urus-black.jpeg";
        description = "The 2026 Lamborghini Urus in Nero Nemesis Black exudes menacing power and uncompromising performance. This blacked-out super SUV is a statement of dominance on any road.";
        rules = standardRules;
        available = true;
        bookedRanges = [];
        sortOrder = 0;
      },
    );
    vehicles.add(
      3,
      {
        id = 3;
        name = "Mercedes-Benz S-Class Maybach";
        year = 2026;
        color = "Black";
        dailyRate = 2500;
        mileageLimit = 150;
        deposit = 2500;
        imageUrl = "/assets/maybach-black.jpeg";
        description = "The 2026 Mercedes-Maybach S-Class in Onyx Black redefines executive luxury. With its extended wheelbase, massaging rear seats, and advanced technology suite, this vehicle offers unparalleled comfort and prestige.";
        rules = standardRules;
        available = true;
        bookedRanges = [];
        sortOrder = 0;
      },
    );
  };
};
