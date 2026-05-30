module {
  public type VehicleId = Nat;

  public type Vehicle = {
    id : VehicleId;
    name : Text;
    year : Nat;
    color : Text;
    dailyRate : Nat;
    mileageLimit : Nat;
    deposit : Nat;
    imageUrl : Text;
    description : Text;
    rules : [Text];
    available : Bool;
    bookedRanges : [(Int, Int)];
    sortOrder : Nat;
  };

  public type VehicleInput = {
    name : Text;
    year : Nat;
    color : Text;
    dailyRate : Nat;
    mileageLimit : Nat;
    deposit : Nat;
    imageUrl : Text;
    description : Text;
    rules : [Text];
    available : Bool;
  };
};
