import { SeoHead } from "@/components/SeoHead";
import { StickyBookNowCTA } from "@/components/StickyBookNowCTA";
import { VehicleCard } from "@/components/VehicleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFavorites,
  useGetCeoProfile,
  useGetPlanConfigs,
  useGetSiteStats,
  useGetVehicleSortOrders,
  useListVehicles,
  useSubscribeToEmailList,
} from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import {
  Bitcoin,
  ChevronDown,
  CreditCard,
  Crown,
  Heart,
  Instagram,
  Mail,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const WHY_US = [
  {
    icon: Crown,
    title: "Exclusive Fleet",
    desc: "Hand-curated hyper-luxury and exotic vehicles — each maintained to concours-level condition.",
  },
  {
    icon: Shield,
    title: "White-Glove Service",
    desc: "From booking to return, your dedicated concierge handles every detail with discretion.",
  },
  {
    icon: Star,
    title: "Flexible Membership",
    desc: "Monthly and annual plans that give you unlimited access to our growing fleet.",
  },
];

const PAYMENT_METHODS = [
  { icon: Smartphone, label: "Apple Pay", desc: "Touch ID / Face ID" },
  {
    icon: CreditCard,
    label: "Credit / Debit Card",
    desc: "Visa • Mastercard • Amex — Powered by Stripe",
  },
  { icon: Bitcoin, label: "Cryptocurrency", desc: "BTC • ETH • USDC • USDT" },
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
      "No mileage caps",
    ],
    cta: "Start Monthly",
    highlight: false,
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
      "Dedicated account manager",
    ],
    cta: "Start Annual",
    highlight: true,
  },
];

function formatMembershipPrice(value: number): string {
  return `${value.toLocaleString("en-US")}`;
}

function CeoSpotlightSection() {
  const { data: ceo } = useGetCeoProfile();

  function extractHandle(raw: string | undefined): string {
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

  const handle = extractHandle(ceo?.instagramHandle);
  const displayHandle = `@${handle}`;
  const instagramUrl = `https://www.instagram.com/${handle}`;
  const photoUrl = ceo?.photoUrl || "/assets/ceo-stan.jpeg";
  const name = ceo?.name || displayHandle;
  const title = ceo?.title || "CEO";
  const description =
    ceo?.description ||
    "Passionate about luxury automotive culture. Follow along for behind-the-scenes content, new arrivals, and exclusive member events.";

  return (
    <section className="py-20 bg-muted/20" data-ocid="home.ceo_section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
            <div className="w-full sm:w-1 h-1 sm:h-auto bg-primary shrink-0" />
            <div className="flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10 w-full">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-luxury">
                  <img
                    src={photoUrl}
                    alt={`${name} — OK RENTALS ${title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-1">
                  {title}
                </p>
                <h3 className="font-display text-2xl font-bold text-foreground mb-0.5">
                  {name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {title}, OK RENTALS
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                  {description}
                </p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="home.ceo_instagram_link"
                >
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold transition-luxury gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Follow on Instagram
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OK Rentals",
    url: "https://okrentals.com",
    logo: "https://okrentals.com/assets/urus-white.jpeg",
    description:
      "Premium luxury vehicle rentals featuring Lamborghini, Rolls-Royce, and Mercedes.",
    sameAs: ["https://www.instagram.com/_stannoodles"],
  };

  return (
    <>
      <SeoHead
        title="OK Rentals — Luxury Car Rental"
        description="Rent luxury vehicles including Lamborghini Urus, Rolls-Royce Ghost, and Mercedes-Benz Maybach. Premium fleet, flexible memberships, online booking."
        ogTitle="OK Rentals — Luxury Car Rental"
        ogDescription="Rent luxury vehicles including Lamborghini Urus, Rolls-Royce Ghost, and Mercedes-Benz Maybach. Premium fleet, flexible memberships, online booking."
        ogType="website"
        ogImage="/assets/urus-white.jpeg"
        canonical="https://okrentals.com/"
        jsonLd={jsonLd}
      />
      <HomePageContent />
      <StickyBookNowCTA />
    </>
  );
}

function VipEmailSection() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useSubscribeToEmailList();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribe(email, {
      onSuccess: () => {
        toast.success("You're on the list!");
        setEmail("");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong. Please try again.");
      },
    });
  }

  return (
    <section
      className="py-24 bg-muted/20 border-t border-border"
      data-ocid="home.vip_section"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Exclusive Access
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Join the VIP List
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            Be the first to know about new fleet arrivals, exclusive member
            events, and limited-time offers reserved for our inner circle.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required
                data-ocid="home.vip_email_input"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold transition-luxury px-8 py-3"
              data-ocid="home.vip_submit_button"
            >
              {isPending ? "Joining..." : "Join Now"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function HomePageContent() {
  const { data: backendVehicles, isLoading } = useListVehicles();
  const { data: planConfigs, isLoading: membershipLoading } =
    useGetPlanConfigs();
  const { data: siteStats } = useGetSiteStats();
  const { data: favoriteIds } = useFavorites();
  const { data: sortOrders = [] } = useGetVehicleSortOrders();

  const stats = [
    {
      value: backendVehicles
        ? backendVehicles.length.toString()
        : siteStats
          ? siteStats.eliteVehicles.toString()
          : "--",
      label: "Elite Vehicles",
      icon: Crown,
    },
    {
      value: siteStats?.satisfiedClients ?? "--",
      label: "Satisfied Clients",
      icon: Users,
    },
    {
      value: siteStats?.conciergeSupport ?? "--",
      label: "Concierge Support",
      icon: Sparkles,
    },
    {
      value: siteStats?.fiveStarReviews ?? "--",
      label: "5-Star Reviews",
      icon: Star,
    },
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
      bookedRanges: [] as Array<[bigint, bigint]>,
      sortOrder: 0n,
      imageUrl: "/assets/urus-white.jpeg",
      description: "",
      rules: [],
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
      bookedRanges: [] as Array<[bigint, bigint]>,
      sortOrder: 0n,
      imageUrl: "/assets/rollsroyce-white.webp",
      description: "",
      rules: [],
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
      bookedRanges: [] as Array<[bigint, bigint]>,
      sortOrder: 0n,
      imageUrl: "/assets/urus-black.jpeg",
      description: "",
      rules: [],
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
      bookedRanges: [] as Array<[bigint, bigint]>,
      sortOrder: 0n,
      imageUrl: "/assets/maybach-black.jpeg",
      description: "",
      rules: [],
    },
  ];

  const vehicles =
    backendVehicles && backendVehicles.length > 0
      ? backendVehicles
      : FEATURED_FALLBACK;

  // Apply saved sort order from backend; fall back to natural slice if none saved
  const featured = (() => {
    if (sortOrders.length > 0) {
      const orderMap = new Map<string, number>(sortOrders);
      return [...vehicles]
        .sort((a, b) => {
          const posA = orderMap.get(a.id.toString()) ?? 9999;
          const posB = orderMap.get(b.id.toString()) ?? 9999;
          return posA - posB;
        })
        .slice(0, 4);
    }
    return vehicles.slice(0, 4);
  })();

  return (
    <div className="flex flex-col" data-ocid="home.page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-ocid="home.hero_section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-lamborghini.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-32">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-5"
            >
              Premium Luxury Rentals
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-6"
            >
              <span className="text-primary">OK</span> <span>RENTALS</span>
              <br />
              <span className="italic text-foreground/80 text-4xl sm:text-5xl">
                Drive the Extraordinary
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg"
            >
              The most exclusive automotive collection in the city — curated for
              those who demand only the finest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/cars">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold shadow-luxury transition-luxury px-8"
                  data-ocid="home.hero_browse_button"
                >
                  Browse Our Fleet
                </Button>
              </Link>
              <Link to="/membership">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 uppercase tracking-widest font-semibold transition-luxury px-8"
                  data-ocid="home.hero_membership_button"
                >
                  View Membership
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────── */}
      <section
        className="bg-card border-y border-border"
        data-ocid="home.stats_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center py-8 px-4 gap-1"
              >
                <stat.icon className="w-5 h-5 text-primary mb-1" />
                <span className="font-display text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Fleet ───────────────────────────────────── */}
      <section
        className="py-24 bg-background"
        data-ocid="home.featured_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2">
                Our Collection
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Featured Fleet
              </h2>
            </div>
            <Link to="/cars">
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs transition-luxury shrink-0"
                data-ocid="home.view_all_button"
              >
                View Full Fleet
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-ocid="home.featured_loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-ocid="home.featured_list"
            >
              {featured.map((vehicle, i) => (
                <VehicleCard
                  key={vehicle.id.toString()}
                  vehicle={vehicle}
                  index={i}
                  favoriteIds={favoriteIds}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Why OK RENTALS ───────────────────────────────────── */}
      <section className="py-24 bg-muted/20" data-ocid="home.why_section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2">
              The Difference
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Why OK RENTALS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-card border border-border rounded-xl p-8 flex flex-col gap-4 group hover:border-primary/50 transition-luxury"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-luxury">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Methods ──────────────────────────────────── */}
      <section
        className="py-16 bg-card border-y border-border"
        data-ocid="home.payments_section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-8">
            Accepted Payment Methods
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {PAYMENT_METHODS.map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 bg-background border border-border rounded-xl p-5 group hover:border-primary/50 transition-luxury hover:shadow-luxury-sm"
                data-ocid={`home.payment_method.${i + 1}`}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-luxury">
                  <method.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">
                    {method.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership Plans ─────────────────────────────────── */}
      <section
        className="py-24 bg-background"
        data-ocid="home.membership_section"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2">
              Membership
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Drive Without Limits
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Choose a plan and get unrestricted access to every vehicle in our
              collection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MEMBERSHIP_PLAN_STATIC.map((plan, i) => {
              const rawPrice =
                i === 0
                  ? planConfigs?.monthly?.price
                  : planConfigs?.annual?.price;
              const displayPrice =
                rawPrice !== undefined ? formatMembershipPrice(rawPrice) : null;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-luxury ${
                    plan.highlight
                      ? "bg-card border-primary/60 shadow-luxury"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                  data-ocid={`home.membership_plan.${i + 1}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        {plan.badge}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      {membershipLoading || displayPrice === null ? (
                        <Skeleton className="h-9 w-24 ml-auto" />
                      ) : (
                        <>
                          <span className="font-display text-3xl font-bold text-primary">
                            {displayPrice}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {plan.period}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/membership" className="mt-auto">
                    <Button
                      className={`w-full uppercase tracking-widest font-semibold transition-luxury ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border"
                      }`}
                      data-ocid={`home.membership_cta.${i + 1}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CEO Spotlight ────────────────────────────────────── */}
      <CeoSpotlightSection />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section
        className="py-28 bg-card border-t border-border relative overflow-hidden"
        data-ocid="home.cta_section"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.15_45/0.06),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-4">
              OK RENTALS
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              Ready to Drive the
              <br />
              <span className="text-primary italic">Extraordinary?</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Reserve your vehicle today. White-glove pickup & drop-off
              explained at booking.
            </p>
            <Link to="/cars">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-semibold shadow-luxury transition-luxury px-12 py-6 text-base"
                data-ocid="home.final_cta_button"
              >
                Book Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── VIP Email List ───────────────────────────────────── */}
      <VipEmailSection />
    </div>
  );
}
