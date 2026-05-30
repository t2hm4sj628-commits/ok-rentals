import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // userId -> List of vehicleIds
  public type Favorites = Map.Map<Principal, List.List<Text>>;

  public func newState() : Favorites {
    Map.empty<Principal, List.List<Text>>();
  };

  public func add(state : Favorites, userId : Principal, vehicleId : Text) {
    let lst = switch (state.get(userId)) {
      case null {
        let l = List.empty<Text>();
        state.add(userId, l);
        l;
      };
      case (?l) { l };
    };
    // Avoid duplicates
    if (not lst.contains(vehicleId)) {
      lst.add(vehicleId);
    };
  };

  public func remove(state : Favorites, userId : Principal, vehicleId : Text) {
    switch (state.get(userId)) {
      case null {};
      case (?lst) {
        let kept = lst.filter(func(v) { v != vehicleId });
        state.add(userId, kept);
      };
    };
  };

  public func get(state : Favorites, userId : Principal) : [Text] {
    switch (state.get(userId)) {
      case null { [] };
      case (?lst) { lst.toArray() };
    };
  };
};
