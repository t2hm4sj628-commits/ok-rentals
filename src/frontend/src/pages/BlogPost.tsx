import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/hooks/useBackend";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Crown, User } from "lucide-react";
import { motion } from "motion/react";

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-ocid="blogpost.page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="aspect-[21/9] w-full rounded-lg mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background" data-ocid="blogpost.page">
        <SeoHead
          title="Post Not Found | OK Rentals Blog"
          description="The blog post you are looking for could not be found."
          noIndex={true}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Crown className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            The blog post you are looking for does not exist or has been
            removed.
          </p>
          <Link to="/blog">
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs"
              type="button"
              data-ocid="blogpost.back_to_blog_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canonical = `${getOrigin()}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: new Date(
      Number(post.publishedDate) / 1_000_000,
    ).toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
    },
    description: post.excerpt,
    url: canonical,
  };

  return (
    <div className="min-h-screen bg-background" data-ocid="blogpost.page">
      <SeoHead
        title={`${post.title} | OK Rentals Blog`}
        description={post.excerpt}
        ogType="article"
        ogImage={post.featuredImage || undefined}
        canonical={canonical}
        noIndex={false}
        jsonLd={jsonLd}
      />

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full max-h-[500px] overflow-hidden bg-secondary">
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            width={1200}
            height={500}
            className="w-full h-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-luxury mb-6"
            data-ocid="blogpost.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary/70" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary/70" />
              {formatDate(post.publishedDate)}
            </span>
          </div>

          {/* Content */}
          <div
            className="prose-content space-y-4 text-foreground/90 leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground/90
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
              [&_li]:text-foreground/90
              [&_strong]:text-foreground [&_strong]:font-semibold
              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
              [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
              [&_img]:rounded-lg [&_img]:w-full [&_img]:max-h-[400px] [&_img]:object-cover
            "
            // biome-ignore lint/security/noDangerouslySetInnerHtml: blog content is admin-controlled
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-ocid="blogpost.content"
          />
        </motion.div>
      </article>
    </div>
  );
}
