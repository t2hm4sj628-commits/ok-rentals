import type { BlogPost } from "@/backend";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import { Calendar, Crown, User } from "lucide-react";
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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="block"
      data-ocid={`blog.card.${index + 1}`}
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group bg-card border border-border rounded-lg overflow-hidden hover-lift transition-luxury shadow-luxury-sm hover:shadow-luxury hover:border-primary/40 h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              loading="lazy"
              width={640}
              height={360}
              className="w-full h-full object-cover transition-luxury group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Crown className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/60 uppercase tracking-widest text-center px-4">
                {post.title}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-luxury line-clamp-2 mb-3">
            {post.title}
          </h2>

          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary/70" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              {formatDate(post.publishedDate)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>

          <Button
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs font-semibold transition-luxury"
            type="button"
            data-ocid={`blog.read_more_button.${index + 1}`}
          >
            Read More
          </Button>
        </div>
      </motion.article>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  );
}

export function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  const jsonLd =
    posts && posts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: post.title,
            url: `${getOrigin()}/blog/${post.slug}`,
          })),
        }
      : undefined;

  return (
    <div className="min-h-screen bg-background" data-ocid="blog.page">
      <SeoHead
        title="Blog | OK Rentals"
        description="Luxury automotive insights and rental tips from OK Rentals."
        ogType="website"
        noIndex={false}
        jsonLd={jsonLd}
      />

      {/* Page Header */}
      <section className="bg-card border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3">
              OK RENTALS
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-4 relative inline-block">
              OK Rentals Blog
              <span
                className="absolute bottom-0 left-0 h-[3px] w-full bg-primary"
                style={{ bottom: "-6px" }}
              />
            </h1>
            <p className="text-muted-foreground max-w-xl mt-6 text-base leading-relaxed">
              Luxury automotive insights, rental tips, and company news
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-ocid="blog.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-ocid="blog.list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {posts.map((post, i) => (
                <BlogCard key={post.id.toString()} post={post} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-24 bg-card border border-border rounded-lg"
              data-ocid="blog.empty_state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Crown className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Check back soon for luxury automotive insights and rental tips.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
