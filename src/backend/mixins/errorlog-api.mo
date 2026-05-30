import ErrorLogLib "../lib/errorlog";
import ErrorLogTypes "../types/errorlog";
import AdminLib "../lib/admin";

mixin (
  errorBuf : ErrorLogLib.ErrorBuffer,
  errorLogState : ErrorLogLib.ErrorLogState,
  admins : AdminLib.AdminSet,
  roleMap : AdminLib.AdminRoleMap
) {
  public shared ({ caller }) func getErrorLogs() : async { #ok : [ErrorLogTypes.ErrorLogEntry]; #err : Text } {
    if (not AdminLib.isManagerOrOwner(roleMap, caller)) {
      return #err "Not authorized";
    };
    #ok(ErrorLogLib.getErrorLogs(errorBuf, errorLogState));
  };

  public shared ({ caller }) func clearErrorLogs() : async { #ok; #err : Text } {
    if (not AdminLib.isOwner(roleMap, caller)) {
      return #err "Not authorized";
    };
    ErrorLogLib.clearErrorLogs(errorBuf, errorLogState);
    #ok;
  };
};
