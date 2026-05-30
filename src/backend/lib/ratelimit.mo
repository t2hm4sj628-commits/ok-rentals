import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";

module {
  public type RateLimitMap = Map.Map<Text, (Nat, Int)>;

  public func checkRateLimit(
    rateLimitMap : RateLimitMap,
    key : Text,
    maxAttempts : Nat,
    windowSecs : Int
  ) : Bool {
    let now = Time.now();
    let windowNanos : Int = windowSecs * 1_000_000_000;
    switch (rateLimitMap.get(key)) {
      case null {
        rateLimitMap.add(key, (1, now));
        true;
      };
      case (?(count, windowStart)) {
        if (now - windowStart > windowNanos) {
          // Window expired — reset
          rateLimitMap.add(key, (1, now));
          true;
        } else if (count < maxAttempts) {
          rateLimitMap.add(key, (count + 1, windowStart));
          true;
        } else {
          false;
        };
      };
    };
  };
};
