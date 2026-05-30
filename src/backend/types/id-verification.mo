module {
  public type IDVerificationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type IDVerification = {
    userId : Principal;
    bookingId : Text;
    licensePhotoId : Text;
    ssnLast4 : Text;
    status : IDVerificationStatus;
    adminNotes : Text;
    submittedAt : Int;
    reviewedAt : Int;
  };
};
