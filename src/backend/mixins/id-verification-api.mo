import IDVerLib "../lib/id-verification";
import IDVerTypes "../types/id-verification";
import AdminLib "../lib/admin";

mixin (
  idVerifications : IDVerLib.IDVerifications,
  admins : AdminLib.AdminSet
) {
  public shared ({ caller }) func submitIDVerification(
    bookingId : Text,
    licensePhotoId : Text,
    ssnLast4 : Text
  ) : async { #ok : IDVerTypes.IDVerification; #err : Text } {
    if (bookingId == "") { return #err "bookingId required" };
    if (licensePhotoId == "") { return #err "licensePhotoId required" };
    if (ssnLast4.size() != 4) { return #err "ssnLast4 must be exactly 4 digits" };
    let entry = IDVerLib.submitVerification(idVerifications, caller, bookingId, licensePhotoId, ssnLast4);
    #ok entry;
  };

  public shared ({ caller }) func adminGetPendingVerifications() : async [IDVerTypes.IDVerification] {
    if (not AdminLib.isAdmin(admins, caller)) { return [] };
    IDVerLib.adminGetAllPending(idVerifications);
  };

  public shared ({ caller }) func adminReviewVerification(
    bookingId : Text,
    approved : Bool,
    notes : Text
  ) : async { #ok : IDVerTypes.IDVerification; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    let status : IDVerTypes.IDVerificationStatus = if (approved) { #approved } else { #rejected };
    switch (IDVerLib.adminReview(idVerifications, bookingId, status, notes)) {
      case null { #err "Verification not found" };
      case (?v) { #ok v };
    };
  };
};
