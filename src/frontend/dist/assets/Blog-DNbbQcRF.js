import { aH as useBlogPosts, j as jsxRuntimeExports, C as Crown, L as Link, B as Button } from "./index-irnVJvcV.js";
import { S as SeoHead } from "./SeoHead-CsgYnFe0.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { U as User } from "./user-Bvdi27gZ.js";
import { C as Calendar } from "./calendar-BprvNXmT.js";
function formatDate(timestamp) {
  return new Date(Number(timestamp) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
function BlogCard({ post, index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/blog/$slug",
      params: { slug: post.slug },
      className: "block",
      "data-ocid": `blog.card.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.article,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: index * 0.1 },
          className: "group bg-card border border-border rounded-lg overflow-hidden hover-lift transition-luxury shadow-luxury-sm hover:shadow-luxury hover:border-primary/40 h-full flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[16/9] overflow-hidden bg-secondary", children: post.featuredImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: post.featuredImage,
                alt: post.title,
                loading: "lazy",
                width: 640,
                height: 360,
                className: "w-full h-full object-cover transition-luxury group-hover:scale-105"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-12 h-12 text-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 uppercase tracking-widest text-center px-4", children: post.title })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground group-hover:text-primary transition-luxury line-clamp-2 mb-3", children: post.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-primary/70" }),
                  post.author
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-primary/70" }),
                  formatDate(post.publishedDate)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-3 mb-4 flex-1", children: post.excerpt }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "w-full border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs font-semibold transition-luxury",
                  type: "button",
                  "data-ocid": `blog.read_more_button.${index + 1}`,
                  children: "Read More"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function BlogSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[16/9] w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3 flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full mt-auto" })
    ] })
  ] });
}
function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();
  const jsonLd = posts && posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: post.title,
      url: `${getOrigin()}/blog/${post.slug}`
    }))
  } : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "blog.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: "Blog | OK Rentals",
        description: "Luxury automotive insights and rental tips from OK Rentals.",
        ogType: "website",
        noIndex: false,
        jsonLd
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3", children: "OK RENTALS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl sm:text-6xl font-bold text-foreground mb-4 relative inline-block", children: [
            "OK Rentals Blog",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "absolute bottom-0 left-0 h-[3px] w-full bg-primary",
                style: { bottom: "-6px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl mt-6 text-base leading-relaxed", children: "Luxury automotive insights, rental tips, and company news" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
        "data-ocid": "blog.loading_state",
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BlogSkeleton, {}, i))
      }
    ) : posts && posts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
        "data-ocid": "blog.list",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BlogCard, { post, index: i }, post.id.toString()))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "text-center py-24 bg-card border border-border rounded-lg",
        "data-ocid": "blog.empty_state",
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-12 h-12 text-primary/30 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold text-foreground mb-2", children: "No posts yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mx-auto", children: "Check back soon for luxury automotive insights and rental tips." })
        ]
      }
    ) }) })
  ] });
}
export {
  BlogPage
};
