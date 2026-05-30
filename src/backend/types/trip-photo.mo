module {
  public type TripPhotoPhase = {
    #before;
    #after;
  };

  public type TripPhoto = {
    id : Nat;
    bookingId : Text;
    uploaderId : Principal;
    phase : TripPhotoPhase;
    photoId : Text;
    uploadedAt : Int;
  };
};
