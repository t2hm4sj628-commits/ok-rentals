import Common "common";
import Vehicle "vehicle";

module {
  public type BookingId = Nat;

  public type PaymentMethod = {
    #applePay;
    #creditCard;
    #crypto;
  };

  public type BookingStatus = {
    #pending;
    #approved;
    #active;
    #completed;
    #returned;
    #cancelled;
  };

  public type PaymentStatus = {
    #pending;
    #paid;
    #failed;
  };

  public type Booking = {
    id : BookingId;
    vehicleId : Vehicle.VehicleId;
    userId : Common.UserId;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    totalCost : Nat;
    status : BookingStatus;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
    stripeSessionId : ?Text;
    cryptoTxRef : ?Text;
    createdAt : Common.Timestamp;
    damageClaimFlag : Bool;
    damageNotes : Text;
  };
};
