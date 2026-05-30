import BlogTypes "../types/blog";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type BlogMap = Map.Map<Nat, BlogTypes.BlogPost>;

  public type BlogState = { var nextBlogId : Nat };

  public func createBlogPost(
    blogPosts : BlogMap,
    blogState : BlogState,
    title : Text,
    slug : Text,
    author : Text,
    excerpt : Text,
    featuredImage : Text,
    content : Text,
    publishedDate : Int,
    published : Bool
  ) : BlogTypes.BlogPost {
    let now = Time.now();
    let id = blogState.nextBlogId;
    blogState.nextBlogId += 1;
    let post : BlogTypes.BlogPost = {
      id;
      title;
      slug;
      author;
      excerpt;
      featuredImage;
      content;
      publishedDate;
      published;
      createdAt = now;
      updatedAt = now;
    };
    blogPosts.add(id, post);
    post;
  };

  public func updateBlogPost(
    blogPosts : BlogMap,
    id : Nat,
    title : ?Text,
    slug : ?Text,
    author : ?Text,
    excerpt : ?Text,
    featuredImage : ?Text,
    content : ?Text,
    publishedDate : ?Int,
    published : ?Bool
  ) : ?BlogTypes.BlogPost {
    switch (blogPosts.get(id)) {
      case null { null };
      case (?existing) {
        let updated : BlogTypes.BlogPost = {
          existing with
          title = switch (title) { case (?t) t; case null existing.title };
          slug = switch (slug) { case (?s) s; case null existing.slug };
          author = switch (author) { case (?a) a; case null existing.author };
          excerpt = switch (excerpt) { case (?e) e; case null existing.excerpt };
          featuredImage = switch (featuredImage) { case (?f) f; case null existing.featuredImage };
          content = switch (content) { case (?c) c; case null existing.content };
          publishedDate = switch (publishedDate) { case (?d) d; case null existing.publishedDate };
          published = switch (published) { case (?p) p; case null existing.published };
          updatedAt = Time.now();
        };
        blogPosts.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteBlogPost(blogPosts : BlogMap, id : Nat) : Bool {
    switch (blogPosts.get(id)) {
      case null { false };
      case (?_) {
        blogPosts.remove(id);
        true;
      };
    };
  };

  public func getBlogPostBySlug(blogPosts : BlogMap, slug : Text) : ?BlogTypes.BlogPost {
    var found : ?BlogTypes.BlogPost = null;
    for ((_, post) in blogPosts.entries()) {
      if (post.slug == slug) { found := ?post };
    };
    found;
  };

  public func listBlogPosts(blogPosts : BlogMap, publishedOnly : Bool) : [BlogTypes.BlogPost] {
    let buf = List.empty<BlogTypes.BlogPost>();
    for ((_, post) in blogPosts.entries()) {
      if (not publishedOnly or post.published) {
        buf.add(post);
      };
    };
    buf.toArray();
  };
};
