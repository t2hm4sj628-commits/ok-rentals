module {
  public type ErrorLogEntry = {
    id : Nat;
    timestamp : Int;
    errorType : Text;
    message : Text;
    principalId : ?Text;
  };
};
