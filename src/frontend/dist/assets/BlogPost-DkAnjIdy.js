import { p as useParams, aI as useBlogPost, j as jsxRuntimeExports, C as Crown, L as Link, B as Button } from "./index-irnVJvcV.js";
import { S as SeoHead } from "./SeoHead-CsgYnFe0.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { A as ArrowLeft } from "./arrow-left-CfdV0Pwi.js";
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
function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post, isLoading } = useBlogPost(slug);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", "data-ocid": "blogpost.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[21/9] w-full rounded-lg mb-8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5" })
      ] })
    ] }) });
  }
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "blogpost.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SeoHead,
        {
          title: "Post Not Found | OK Rentals Blog",
          description: "The blog post you are looking for could not be found.",
          noIndex: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-12 h-12 text-primary/30 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-4", children: "Post Not Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-sm mx-auto", children: "The blog post you are looking for does not exist or has been removed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs",
            type: "button",
            "data-ocid": "blogpost.back_to_blog_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
              "Back to Blog"
            ]
          }
        ) })
      ] })
    ] });
  }
  const canonical = `${getOrigin()}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: new Date(
      Number(post.publishedDate) / 1e6
    ).toISOString(),
    author: {
      "@type": "Person",
      name: post.author
    },
    description: post.excerpt,
    url: canonical
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "blogpost.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: `${post.title} | OK Rentals Blog`,
        description: post.excerpt,
        ogType: "article",
        ogImage: post.featuredImage || void 0,
        canonical,
        noIndex: false,
        jsonLd
      }
    ),
    post.featuredImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-h-[500px] overflow-hidden bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: post.featuredImage,
        alt: post.title,
        loading: "lazy",
        width: 1200,
        height: 500,
        className: "w-full h-full object-cover max-h-[500px]"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/blog",
              className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-luxury mb-6",
              "data-ocid": "blogpost.back_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back to Blog"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground mb-6", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary/70" }),
              post.author
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary/70" }),
              formatDate(post.publishedDate)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "prose-content space-y-4 text-foreground/90 leading-relaxed\n              [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4\n              [&_h3]:text-xl [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3\n              [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground/90\n              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2\n              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2\n              [&_li]:text-foreground/90\n              [&_strong]:text-foreground [&_strong]:font-semibold\n              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4\n              [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground\n              [&_img]:rounded-lg [&_img]:w-full [&_img]:max-h-[400px] [&_img]:object-cover\n            ",
              dangerouslySetInnerHTML: { __html: post.content },
              "data-ocid": "blogpost.content"
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  BlogPostPage
};
