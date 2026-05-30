import BlogLib "../lib/blog";
import BlogTypes "../types/blog";
import AdminLib "../lib/admin";
import AdminTypes "../types/admin";
import Common "../types/common";
import Time "mo:core/Time";

mixin (
  blogPosts : BlogLib.BlogMap,
  blogState : BlogLib.BlogState,
  admins : AdminLib.AdminSet,
  roleMap : AdminLib.AdminRoleMap,
  auditLog : AdminLib.AuditList,
  auditState : { var nextAuditId : Nat }
) {
  public shared ({ caller }) func adminCreateBlogPost(
    title : Text,
    slug : Text,
    author : Text,
    excerpt : Text,
    featuredImage : Text,
    content : Text,
    publishedDate : Int,
    published : Bool
  ) : async { #ok : BlogTypes.BlogPost; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    let post = BlogLib.createBlogPost(blogPosts, blogState, title, slug, author, excerpt, featuredImage, content, publishedDate, published);
    AdminLib.appendAuditLog(auditLog, auditState, caller, "createBlogPost", ?title, Time.now());
    #ok post;
  };

  public shared ({ caller }) func adminUpdateBlogPost(
    id : Nat,
    title : ?Text,
    slug : ?Text,
    author : ?Text,
    excerpt : ?Text,
    featuredImage : ?Text,
    content : ?Text,
    publishedDate : ?Int,
    published : ?Bool
  ) : async { #ok : BlogTypes.BlogPost; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    switch (BlogLib.updateBlogPost(blogPosts, id, title, slug, author, excerpt, featuredImage, content, publishedDate, published)) {
      case null { #err "Blog post not found" };
      case (?post) {
        AdminLib.appendAuditLog(auditLog, auditState, caller, "updateBlogPost", ?(id.toText()), Time.now());
        #ok post;
      };
    };
  };

  public shared ({ caller }) func adminDeleteBlogPost(id : Nat) : async Bool {
    if (not AdminLib.isAdmin(admins, caller)) {
      return false;
    };
    let result = BlogLib.deleteBlogPost(blogPosts, id);
    if (result) {
      AdminLib.appendAuditLog(auditLog, auditState, caller, "deleteBlogPost", ?(id.toText()), Time.now());
    };
    result;
  };

  public query func getBlogPost(slug : Text) : async ?BlogTypes.BlogPost {
    BlogLib.getBlogPostBySlug(blogPosts, slug);
  };

  public query func listPublishedBlogPosts() : async [BlogTypes.BlogPost] {
    BlogLib.listBlogPosts(blogPosts, true);
  };

  public shared ({ caller }) func adminListAllBlogPosts() : async [BlogTypes.BlogPost] {
    if (not AdminLib.isAdmin(admins, caller)) {
      return [];
    };
    BlogLib.listBlogPosts(blogPosts, false);
  };
};
