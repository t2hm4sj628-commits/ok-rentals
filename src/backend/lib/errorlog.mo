import ErrorLogTypes "../types/errorlog";
import Time "mo:core/Time";

module {
  public let MAX_ENTRIES : Nat = 100;

  public type ErrorBuffer = [var ErrorLogEntry];
  public type ErrorLogEntry = ErrorLogTypes.ErrorLogEntry;

  public type ErrorLogState = {
    var nextId : Nat;
    var head : Nat;
    var count : Nat;
  };

  let emptyEntry : ErrorLogEntry = { id = 0; timestamp = 0; errorType = ""; message = ""; principalId = null };

  public func newBuffer() : ErrorBuffer {
    [var emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry,
         emptyEntry, emptyEntry, emptyEntry, emptyEntry, emptyEntry];
  };

  public func logError(
    buf : ErrorBuffer,
    state : ErrorLogState,
    errorType : Text,
    message : Text,
    principalId : ?Text
  ) : () {
    let entry : ErrorLogEntry = {
      id = state.nextId;
      timestamp = Time.now();
      errorType;
      message;
      principalId;
    };
    let idx = state.head % MAX_ENTRIES;
    buf[idx] := entry;
    state.nextId += 1;
    if (state.count < MAX_ENTRIES) {
      state.count += 1;
    };
    state.head := (state.head + 1) % MAX_ENTRIES;
  };

  public func getErrorLogs(buf : ErrorBuffer, state : ErrorLogState) : [ErrorLogEntry] {
    let count = state.count;
    if (count == 0) { return [] };
    // Collect in reverse-chronological order
    var result : [ErrorLogEntry] = [];
    var i = 0;
    while (i < count) {
      let slot = (MAX_ENTRIES + state.head - 1 - i) % MAX_ENTRIES;
      result := [buf[slot]].concat(result);
      i += 1;
    };
    result;
  };

  public func clearErrorLogs(buf : ErrorBuffer, state : ErrorLogState) : () {
    var i = 0;
    while (i < MAX_ENTRIES) {
      buf[i] := emptyEntry;
      i += 1;
    };
    state.nextId := 0;
    state.head := 0;
    state.count := 0;
  };
};
