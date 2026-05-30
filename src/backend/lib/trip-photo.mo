import Types "../types/trip-photo";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // bookingId -> List of TripPhoto
  public type TripPhotos = Map.Map<Text, List.List<Types.TripPhoto>>;
  public type TripPhotoState = { var nextId : Nat };

  public func newState() : (TripPhotos, TripPhotoState) {
    (Map.empty<Text, List.List<Types.TripPhoto>>(), { var nextId = 0 });
  };

  public func addPhoto(
    state : TripPhotos,
    photoState : TripPhotoState,
    bookingId : Text,
    uploaderId : Principal,
    phase : Types.TripPhotoPhase,
    photoId : Text
  ) : Types.TripPhoto {
    let id = photoState.nextId;
    photoState.nextId += 1;
    let photo : Types.TripPhoto = {
      id;
      bookingId;
      uploaderId;
      phase;
      photoId;
      uploadedAt = Time.now();
    };
    let existing = switch (state.get(bookingId)) {
      case null { List.empty<Types.TripPhoto>() };
      case (?lst) { lst };
    };
    existing.add(photo);
    state.add(bookingId, existing);
    photo;
  };

  public func getPhotos(state : TripPhotos, bookingId : Text) : [Types.TripPhoto] {
    switch (state.get(bookingId)) {
      case null { [] };
      case (?lst) { lst.toArray() };
    };
  };
};
