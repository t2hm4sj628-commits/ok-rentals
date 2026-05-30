import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Link, B as Button, X, u as useListVehicles, a as useGetPlanConfigs, b as useGetSiteStats, d as useFavorites, e as useGetVehicleSortOrders, C as Crown, f as ChevronDown, g as useGetCeoProfile, h as useSubscribeToEmailList, i as ue } from "./index-irnVJvcV.js";
import { S as SeoHead } from "./SeoHead-CsgYnFe0.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { C as Calendar } from "./calendar-BprvNXmT.js";
import { V as VehicleCard } from "./VehicleCard-CPa8eIsT.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { U as Users, M as Mail } from "./users-CjLBGKNZ.js";
import { S as Star } from "./star-YZWh37Zs.js";
import { S as Shield } from "./shield-v2tpAXVL.js";
import { S as Smartphone } from "./smartphone-Bwz3yTh-.js";
import { C as CreditCard } from "./credit-card-DkWzIIts.js";
import { B as Bitcoin } from "./bitcoin-DMFPQ8NC.js";
import "./gauge-C3Rv6Xb0.js";
import "./heart-DqkVX7dQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const STORAGE_KEY = "cta_dismissed";
function isDismissed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const expiry = Number(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1e3));
  } catch {
  }
}
function StickyBookNowCTA() {
  const [visible, setVisible] = reactExports.useState(false);
  const [dismissed, setDismissed] = reactExports.useState(isDismissed());
  reactExports.useEffect(() => {
    if (dismissed) return;
    const hero = document.querySelector("[data-ocid='home.hero_section']");
    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);
  if (dismissed || !visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: "fixed z-50 bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto",
      "data-ocid": "sticky_cta",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/40 rounded-xl shadow-luxury p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cars", className: "flex-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground uppercase tracking-widest", children: "Reserve Today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 shrink-0",
            onClick: () => {
              dismiss();
              setDismissed(true);
            },
            "aria-label": "Dismiss",
            "data-ocid": "sticky_cta.dismiss_button",
            type: "button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
          }
        )
      ] })
    }
  );
}
const WHY_US = [
  {
    icon: Crown,
    title: "Exclusive Fleet",
    desc: "Hand-curated hyper-luxury and exotic vehicles — each maintained to concours-level condition."
  },
  {
    icon: Shield,
    title: "White-Glove Service",
    desc: "From booking to return, your dedicated concierge handles every detail with discretion."
  },
  {
    icon: Star,
    title: "Flexible Membership",
    desc: "Monthly and annual plans that give you unlimited access to our growing fleet."
  }
];
const PAYMENT_METHODS = [
  { icon: Smartphone, label: "Apple Pay", desc: "Touch ID / Face ID" },
  {
    icon: CreditCard,
    label: "Credit / Debit Card",
    desc: "Visa • Mastercard • Amex — Powered by Stripe"
  },
  { icon: Bitcoin, label: "Cryptocurrency", desc: "BTC • ETH • USDC • USDT" }
];
const MEMBERSHIP_PLAN_STATIC = [
  {
    name: "Monthly",
    period: "/mo",
    badge: "Flexible",
    features: [
      "Unlimited vehicle swaps",
      "Priority booking access",
      "24/7 concierge support",
      "Complimentary delivery",
      "No mileage caps"
    ],
    cta: "Start Monthly",
    highlight: false
  },
  {
    name: "Annual",
    period: "/yr",
    badge: "Best Value",
    features: [
      "Everything in Monthly",
      "Save vs monthly billing",
      "Exclusive member events",
      "First access to new arrivals",
      "Dedicated account manager"
    ],
    cta: "Start Annual",
    highlight: true
  }
];
function formatMembershipPrice(value) {
  return `${value.toLocaleString("en-US")}`;
}
function CeoSpotlightSection() {
  const { data: ceo } = useGetCeoProfile();
  function extractHandle(raw) {
    if (!raw) return "_stannoodles";
    if (raw.startsWith("https://")) {
      try {
        const url = new URL(raw);
        const path = url.pathname.replace(/^\/+/, "");
        const h = path.split("/")[0];
        return h || "_stannoodles";
      } catch {
        return "_stannoodles";
      }
    }
    return raw.replace(/^@/, "");
  }
  const handle = extractHandle(ceo == null ? void 0 : ceo.instagramHandle);
  const displayHandle = `@${handle}`;
  const instagramUrl = `https://www.instagram.com/${handle}`;
  const photoUrl = (ceo == null ? void 0 : ceo.photoUrl) || "/assets/ceo-stan.jpeg";
  const name = (ceo == null ? void 0 : ceo.name) || displayHandle;
  const title = (ceo == null ? void 0 : ceo.title) || "CEO";
  const description = (ceo == null ? void 0 : ceo.description) || "Passionate about luxury automotive culture. Follow along for behind-the-scenes content, new arrivals, and exclusive member events.";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-muted/20", "data-ocid": "home.ceo_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      className: "bg-card border border-border rounded-2xl overflow-hidden",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-stretch gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-1 h-1 sm:h-auto bg-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-luxury", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: photoUrl,
                alt: `${name} — OK RENTALS ${title}`,
                className: "w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-3.5 h-3.5 text-primary-foreground" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-1", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-0.5", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-4", children: [
              title,
              ", OK RENTALS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm", children: description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: instagramUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                "data-ocid": "home.ceo_instagram_link",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold transition-luxury gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-4 h-4" }),
                      "Follow on Instagram"
                    ]
                  }
                )
              }
            )
          ] })
        ] })
      ] })
    }
  ) }) });
}
function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OK Rentals",
    url: "https://okrentals.com",
    logo: "https://okrentals.com/assets/urus-white.jpeg",
    description: "Premium luxury vehicle rentals featuring Lamborghini, Rolls-Royce, and Mercedes.",
    sameAs: ["https://www.instagram.com/_stannoodles"]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: "OK Rentals — Luxury Car Rental",
        description: "Rent luxury vehicles including Lamborghini Urus, Rolls-Royce Ghost, and Mercedes-Benz Maybach. Premium fleet, flexible memberships, online booking.",
        ogTitle: "OK Rentals — Luxury Car Rental",
        ogDescription: "Rent luxury vehicles including Lamborghini Urus, Rolls-Royce Ghost, and Mercedes-Benz Maybach. Premium fleet, flexible memberships, online booking.",
        ogType: "website",
        ogImage: "/assets/urus-white.jpeg",
        canonical: "https://okrentals.com/",
        jsonLd
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HomePageContent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickyBookNowCTA, {})
  ] });
}
function VipEmailSection() {
  const [email, setEmail] = reactExports.useState("");
  const { mutate: subscribe, isPending } = useSubscribeToEmailList();
  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      ue.error("Please enter a valid email address.");
      return;
    }
    subscribe(email, {
      onSuccess: () => {
        ue.success("You're on the list!");
        setEmail("");
      },
      onError: (err) => {
        ue.error(err.message || "Something went wrong. Please try again.");
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "py-24 bg-muted/20 border-t border-border",
      "data-ocid": "home.vip_section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3", children: "Exclusive Access" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground mb-4", children: "Join the VIP List" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed", children: "Be the first to know about new fleet arrivals, exclusive member events, and limited-time offers reserved for our inner circle." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubmit,
                className: "flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "your@email.com",
                        className: "w-full pl-10 pr-4 py-3 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors",
                        required: true,
                        "data-ocid": "home.vip_email_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isPending,
                      className: "w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold transition-luxury px-8 py-3",
                      "data-ocid": "home.vip_submit_button",
                      children: isPending ? "Joining..." : "Join Now"
                    }
                  )
                ]
              }
            )
          ]
        }
      ) })
    }
  );
}
function HomePageContent() {
  const { data: backendVehicles, isLoading } = useListVehicles();
  const { data: planConfigs, isLoading: membershipLoading } = useGetPlanConfigs();
  const { data: siteStats } = useGetSiteStats();
  const { data: favoriteIds } = useFavorites();
  const { data: sortOrders = [] } = useGetVehicleSortOrders();
  const stats = [
    {
      value: backendVehicles ? backendVehicles.length.toString() : siteStats ? siteStats.eliteVehicles.toString() : "--",
      label: "Elite Vehicles",
      icon: Crown
    },
    {
      value: (siteStats == null ? void 0 : siteStats.satisfiedClients) ?? "--",
      label: "Satisfied Clients",
      icon: Users
    },
    {
      value: (siteStats == null ? void 0 : siteStats.conciergeSupport) ?? "--",
      label: "Concierge Support",
      icon: Sparkles
    },
    {
      value: (siteStats == null ? void 0 : siteStats.fiveStarReviews) ?? "--",
      label: "5-Star Reviews",
      icon: Star
    }
  ];
  const FEATURED_FALLBACK = [
    {
      id: 0n,
      name: "White Lamborghini Urus 2026",
      color: "White",
      year: 2026n,
      dailyRate: 3000n,
      deposit: 3000n,
      mileageLimit: 150n,
      available: true,
      bookedRanges: [],
      sortOrder: 0n,
      imageUrl: "/assets/urus-white.jpeg",
      description: "",
      rules: []
    },
    {
      id: 1n,
      name: "White Rolls-Royce Ghost 2026",
      color: "White",
      year: 2026n,
      dailyRate: 3000n,
      deposit: 3000n,
      mileageLimit: 100n,
      available: true,
      bookedRanges: [],
      sortOrder: 0n,
      imageUrl: "/assets/rollsroyce-white.webp",
      description: "",
      rules: []
    },
    {
      id: 2n,
      name: "Black Lamborghini Urus 2026",
      color: "Black",
      year: 2026n,
      dailyRate: 3000n,
      deposit: 3000n,
      mileageLimit: 150n,
      available: true,
      bookedRanges: [],
      sortOrder: 0n,
      imageUrl: "/assets/urus-black.jpeg",
      description: "",
      rules: []
    },
    {
      id: 3n,
      name: "Mercedes-Benz S-Class 2026",
      color: "Black",
      year: 2026n,
      dailyRate: 2500n,
      deposit: 2500n,
      mileageLimit: 200n,
      available: true,
      bookedRanges: [],
      sortOrder: 0n,
      imageUrl: "/assets/maybach-black.jpeg",
      description: "",
      rules: []
    }
  ];
  const vehicles = backendVehicles && backendVehicles.length > 0 ? backendVehicles : FEATURED_FALLBACK;
  const featured = (() => {
    if (sortOrders.length > 0) {
      const orderMap = new Map(sortOrders);
      return [...vehicles].sort((a, b) => {
        const posA = orderMap.get(a.id.toString()) ?? 9999;
        const posB = orderMap.get(b.id.toString()) ?? 9999;
        return posA - posB;
      }).slice(0, 4);
    }
    return vehicles.slice(0, 4);
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-ocid": "home.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative min-h-screen flex items-center justify-center overflow-hidden",
        "data-ocid": "home.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-cover bg-center bg-no-repeat scale-105",
              style: {
                backgroundImage: "url('/assets/generated/hero-lamborghini.dim_1400x700.jpg')"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
                className: "text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-5",
                children: "Premium Luxury Rentals"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.h1,
              {
                initial: { opacity: 0, x: -40 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.7, delay: 0.1 },
                className: "font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "OK" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "RENTALS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-foreground/80 text-4xl sm:text-5xl", children: "Drive the Extraordinary" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.25 },
                className: "text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg",
                children: "The most exclusive automotive collection in the city — curated for those who demand only the finest."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.4 },
                className: "flex flex-wrap gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      className: "bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold shadow-luxury transition-luxury px-8",
                      "data-ocid": "home.hero_browse_button",
                      children: "Browse Our Fleet"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/membership", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      variant: "outline",
                      className: "border-primary/50 text-primary hover:bg-primary/10 uppercase tracking-widest font-semibold transition-luxury px-8",
                      "data-ocid": "home.hero_membership_button",
                      children: "View Membership"
                    }
                  ) })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/60",
              animate: { y: [0, 8, 0] },
              transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-6 h-6" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-card border-y border-border",
        "data-ocid": "home.stats_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 divide-x divide-border", children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.4, delay: i * 0.08 },
            className: "flex flex-col items-center py-8 px-4 gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "w-5 h-5 text-primary mb-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-primary", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: stat.label })
            ]
          },
          stat.label
        )) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-24 bg-background",
        "data-ocid": "home.featured_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2", children: "Our Collection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: "Featured Fleet" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "border-primary/50 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs transition-luxury shrink-0",
                    "data-ocid": "home.view_all_button",
                    children: "View Full Fleet"
                  }
                ) })
              ]
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
              "data-ocid": "home.featured_loading_state",
              children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-card border border-border rounded-lg overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" })
                    ] })
                  ]
                },
                i
              ))
            }
          ) : featured.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
              "data-ocid": "home.featured_list",
              children: featured.map((vehicle, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                VehicleCard,
                {
                  vehicle,
                  index: i,
                  favoriteIds
                },
                vehicle.id.toString()
              ))
            }
          ) : null
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 bg-muted/20", "data-ocid": "home.why_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "text-center mb-14",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2", children: "The Difference" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: "Why OK RENTALS" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: WHY_US.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: i * 0.12 },
          className: "bg-card border border-border rounded-xl p-8 flex flex-col gap-4 group hover:border-primary/50 transition-luxury",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-luxury", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: item.desc })
          ]
        },
        item.title
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-16 bg-card border-y border-border",
        "data-ocid": "home.payments_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-8", children: "Accepted Payment Methods" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2", children: PAYMENT_METHODS.map((method, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.1 },
              className: "flex items-center gap-4 bg-background border border-border rounded-xl p-5 group hover:border-primary/50 transition-luxury hover:shadow-luxury-sm",
              "data-ocid": `home.payment_method.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-luxury", children: /* @__PURE__ */ jsxRuntimeExports.jsx(method.icon, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: method.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: method.desc })
                ] })
              ]
            },
            method.label
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-24 bg-background",
        "data-ocid": "home.membership_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-14",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2", children: "Membership" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: "Drive Without Limits" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-lg mx-auto", children: "Choose a plan and get unrestricted access to every vehicle in our collection." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: MEMBERSHIP_PLAN_STATIC.map((plan, i) => {
            var _a, _b;
            const rawPrice = i === 0 ? (_a = planConfigs == null ? void 0 : planConfigs.monthly) == null ? void 0 : _a.price : (_b = planConfigs == null ? void 0 : planConfigs.annual) == null ? void 0 : _b.price;
            const displayPrice = rawPrice !== void 0 ? formatMembershipPrice(rawPrice) : null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.5, delay: i * 0.15 },
                className: `relative rounded-2xl border p-8 flex flex-col gap-6 transition-luxury ${plan.highlight ? "bg-card border-primary/60 shadow-luxury" : "bg-card border-border hover:border-primary/30"}`,
                "data-ocid": `home.membership_plan.${i + 1}`,
                children: [
                  plan.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4", children: "Most Popular" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: plan.badge }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold text-foreground", children: plan.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: membershipLoading || displayPrice === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-24 ml-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-primary", children: displayPrice }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: plan.period })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-3", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-center gap-3 text-sm text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0" }),
                        f
                      ]
                    },
                    f
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/membership", className: "mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      className: `w-full uppercase tracking-widest font-semibold transition-luxury ${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border"}`,
                      "data-ocid": `home.membership_cta.${i + 1}`,
                      children: plan.cta
                    }
                  ) })
                ]
              },
              plan.name
            );
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CeoSpotlightSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "py-28 bg-card border-t border-border relative overflow-hidden",
        "data-ocid": "home.cta_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.15_45/0.06),transparent_70%)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-4", children: "OK RENTALS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight", children: [
                  "Ready to Drive the",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary italic", children: "Extraordinary?" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-10 text-lg", children: "Reserve your vehicle today. White-glove pickup & drop-off explained at booking." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "lg",
                    className: "bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold shadow-luxury transition-luxury px-12 py-6 text-base",
                    "data-ocid": "home.final_cta_button",
                    children: "Book Now"
                  }
                ) })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VipEmailSection, {})
  ] });
}
export {
  HomePage
};
