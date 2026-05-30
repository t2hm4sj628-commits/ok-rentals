module {
  public type PolicyState = {
    var cancellationPolicy : Text;
    var insuranceWaiverTerms : Text;
    var damagePolicy : Text;
  };

  public let defaultCancellationPolicy : Text = "Cancellations made 48 hours or more before the rental start date will receive a full refund minus a $150 administrative fee. Cancellations made within 48 hours of the rental start are non-refundable. No-shows forfeit the full rental amount and deposit. All cancellations must be submitted in writing via email to support@okrentals.com.";

  public let defaultInsuranceWaiverTerms : Text = "Renter acknowledges that OK Rentals does not provide vehicle insurance. Renter must present valid personal auto insurance or a credit card with rental car coverage prior to vehicle delivery. An optional collision damage waiver (CDW) is available for purchase at $150/day. The CDW reduces renter liability for accidental damage to $1,500. It does not cover theft, vandalism, tire damage, or negligence. Renter is fully liable for all damages not covered by their personal policy or the CDW.";

  public let defaultDamagePolicy : Text = "The renter is responsible for any and all damage to the vehicle during the rental period, including but not limited to: body damage, interior damage, tire damage, glass breakage, and mechanical damage caused by misuse. Damage must be reported immediately upon discovery. A full inspection will be conducted at return. Any damage found at return will be assessed and the renter's security deposit may be applied toward repairs. Repair costs exceeding the deposit will be charged to the renter's payment method on file. OK Rentals reserves the right to pursue further legal action for damages exceeding insurance coverage.";

  public func newState() : PolicyState {
    {
      var cancellationPolicy = defaultCancellationPolicy;
      var insuranceWaiverTerms = defaultInsuranceWaiverTerms;
      var damagePolicy = defaultDamagePolicy;
    };
  };

  public func getPolicies(state : PolicyState) : { cancellationPolicy : Text; insuranceWaiverTerms : Text; damagePolicy : Text } {
    {
      cancellationPolicy = state.cancellationPolicy;
      insuranceWaiverTerms = state.insuranceWaiverTerms;
      damagePolicy = state.damagePolicy;
    };
  };

  public func updatePolicy(state : PolicyState, policyType : Text, content : Text) : Bool {
    switch (policyType) {
      case "cancellation" { state.cancellationPolicy := content; true };
      case "insurance" { state.insuranceWaiverTerms := content; true };
      case "damage" { state.damagePolicy := content; true };
      case _ { false };
    };
  };
};
