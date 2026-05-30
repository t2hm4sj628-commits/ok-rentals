module {
  public type BlogPost = {
    id : Nat;
    title : Text;
    slug : Text;
    author : Text;
    excerpt : Text;
    featuredImage : Text;
    content : Text;
    publishedDate : Int;
    published : Bool;
    createdAt : Int;
    updatedAt : Int;
  };
};
