import FavoritesLib "../lib/favorites";

mixin (
  favorites : FavoritesLib.Favorites
) {
  public shared ({ caller }) func addFavorite(vehicleId : Text) : async () {
    FavoritesLib.add(favorites, caller, vehicleId);
  };

  public shared ({ caller }) func removeFavorite(vehicleId : Text) : async () {
    FavoritesLib.remove(favorites, caller, vehicleId);
  };

  public shared ({ caller }) func getMyFavorites() : async [Text] {
    FavoritesLib.get(favorites, caller);
  };
};
