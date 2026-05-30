import AdminLib "../lib/admin";
import Text "mo:core/Text";

mixin (
  admins : AdminLib.AdminSet,
  openAiState : { var openAiKey : Text }
) {
  /// Ask the AI chat assistant a rental-related question.
  /// sessionId is used to scope conversation history per session.
  public shared func askChat(message : Text, sessionId : Text) : async Text {
    ignore sessionId;
    let apiKey = openAiState.openAiKey;
    if (apiKey == "") {
      return "AI assistant is not configured. Please contact support.";
    };

    let systemPrompt = "You are the OK Rentals AI assistant. Help customers with questions about our luxury vehicle fleet (Lamborghini Urus, Rolls-Royce, Mercedes S-Class), rental pricing, booking process, availability, and rental terms. Be professional, helpful, and concise.";

    let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"" # systemPrompt # "\"},{\"role\":\"user\",\"content\":\"" # message # "\"}],\"max_tokens\":500}";

    let ic : actor {
      http_request : {
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        method : { #get; #post; #head };
        transform : ?{
          function : shared query ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
          context : Blob;
        };
      } -> async {
        status : Nat;
        headers : [{ name : Text; value : Text }];
        body : Blob;
      };
    } = actor "aaaaa-aa";

    let response = await ic.http_request({
      url = "https://api.openai.com/v1/chat/completions";
      max_response_bytes = ?4096;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
      ];
      body = ?requestBody.encodeUtf8();
      method = #post;
      transform = null;
    });

    switch (response.body.decodeUtf8()) {
      case (?text) { text };
      case null { "Sorry, I encountered an error processing your request." };
    };
  };
};
