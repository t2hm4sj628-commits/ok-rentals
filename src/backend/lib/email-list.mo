import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type EmailSubscriber = {
    email : Text;
    subscribedAt : Int;
  };

  public type EmailListState = List.List<EmailSubscriber>;

  public func newState() : EmailListState {
    List.empty<EmailSubscriber>();
  };

  public func subscribe(state : EmailListState, email : Text) : Bool {
    // Reject duplicates
    let exists = state.find(func(s) { s.email == email }) != null;
    if (exists) { return false };
    state.add({ email; subscribedAt = Time.now() });
    true;
  };

  public func getAll(state : EmailListState) : [EmailSubscriber] {
    state.toArray();
  };
};
