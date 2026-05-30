import { c as createLucideIcon, k as useAuth, I as useMyMembership, $ as useSubscribeMembership, a0 as useCancelMembership, a1 as useUpdateMembershipStatus, a as useGetPlanConfigs, a2 as useGetComparisonRows, r as reactExports, N as MembershipPlan, M as MembershipStatus, i as ue, j as jsxRuntimeExports, C as Crown, B as Button, P as PaymentMethod, X } from "./index-irnVJvcV.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { a as CircleCheckBig, C as CircleAlert } from "./circle-check-big-DOMqNcZN.js";
import { C as CreditCard } from "./credit-card-DkWzIIts.js";
import { S as Smartphone } from "./smartphone-Bwz3yTh-.js";
import { B as Bitcoin } from "./bitcoin-DMFPQ8NC.js";
import { P as Phone } from "./phone-ChmEem51.js";
import { C as CircleX } from "./circle-x-IvkZDk8J.js";
import { C as Clock } from "./clock-DZwx_36_.js";
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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const STRIPE_LINK_MONTHLY = "#";
const STRIPE_LINK_ANNUAL = "#";
const STATIC_PLAN_META = [
  {
    plan: MembershipPlan.monthly,
    savings: null,
    period: "/ month",
    badge: null,
    highlight: false
  },
  {
    plan: MembershipPlan.annual,
    savings: "Best Value",
    period: "/ year",
    badge: "Best Value",
    highlight: true
  }
];
const PAYMENT_METHODS = [
  { icon: Smartphone, label: "Apple Pay", method: PaymentMethod.applePay },
  { icon: CreditCard, label: "Credit Card", method: PaymentMethod.creditCard },
  { icon: Bitcoin, label: "Crypto", method: PaymentMethod.crypto }
];
function CheckIcon({ active }) {
  if (active)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary flex-shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground/40 flex-shrink-0" });
}
const STATUS_CONFIG = {
  [MembershipStatus.active]: {
    label: "Active",
    color: "text-emerald-600 dark:text-emerald-400",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
    bg: "bg-emerald-500/10 border-emerald-500/30"
  },
  [MembershipStatus.pending]: {
    label: "Payment Pending",
    color: "text-amber-600 dark:text-amber-400",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
    bg: "bg-amber-500/10 border-amber-500/30"
  },
  [MembershipStatus.failed]: {
    label: "Payment Failed",
    color: "text-red-600 dark:text-red-400",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
    bg: "bg-red-500/10 border-red-500/30"
  },
  [MembershipStatus.cancelled]: {
    label: "Cancelled",
    color: "text-muted-foreground",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
    bg: "bg-muted/40 border-border"
  },
  [MembershipStatus.expired]: {
    label: "Expired",
    color: "text-muted-foreground",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
    bg: "bg-muted/40 border-border"
  }
};
function MembershipPage() {
  const { isAuthenticated, login } = useAuth();
  const { data: membership } = useMyMembership();
  const { mutateAsync: subscribe } = useSubscribeMembership();
  const { mutate: cancel, isPending: cancelling } = useCancelMembership();
  const { mutateAsync: updateStatus } = useUpdateMembershipStatus();
  const { data: planConfigs, isLoading: pricingLoading } = useGetPlanConfigs();
  const { data: comparisonRows = [] } = useGetComparisonRows();
  const [processingPlan, setProcessingPlan] = reactExports.useState(
    null
  );
  const plans = STATIC_PLAN_META.map((meta) => ({
    ...meta,
    name: meta.plan === MembershipPlan.monthly ? (planConfigs == null ? void 0 : planConfigs.monthly.name) ?? "Monthly Elite" : (planConfigs == null ? void 0 : planConfigs.annual.name) ?? "Annual Elite",
    price: meta.plan === MembershipPlan.monthly ? ((planConfigs == null ? void 0 : planConfigs.monthly.price) ?? 1e4).toLocaleString() : ((planConfigs == null ? void 0 : planConfigs.annual.price) ?? 1e5).toLocaleString(),
    desc: meta.plan === MembershipPlan.monthly ? (planConfigs == null ? void 0 : planConfigs.monthly.description) ?? "Full fleet access with no per-day charges. Cancel anytime." : (planConfigs == null ? void 0 : planConfigs.annual.description) ?? "Best value. Unlimited year-round access with exclusive VIP perks.",
    features: meta.plan === MembershipPlan.monthly ? (planConfigs == null ? void 0 : planConfigs.monthly.features) ?? [
      "Unlimited vehicle rentals",
      "Access to entire luxury fleet",
      "Priority booking guarantee",
      "24/7 concierge support",
      "Flexible cancellation"
    ] : (planConfigs == null ? void 0 : planConfigs.annual.features) ?? [
      "Unlimited vehicle rentals",
      "Access to entire luxury fleet",
      "Priority booking & dedicated liaison",
      "White-glove 24/7 concierge",
      "Complimentary professional detailing",
      "Exclusive new arrival previews",
      "Two complimentary guest rentals"
    ]
  }));
  const isActiveMember = (membership == null ? void 0 : membership.status) === MembershipStatus.active;
  const isPendingMember = (membership == null ? void 0 : membership.status) === MembershipStatus.pending;
  const isBlockedStatus = (membership == null ? void 0 : membership.status) === MembershipStatus.active || (membership == null ? void 0 : membership.status) === MembershipStatus.pending;
  async function handleSubscribe(plan) {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (isBlockedStatus) return;
    setProcessingPlan(plan);
    try {
      await subscribe(plan);
      const paymentLink = plan === MembershipPlan.monthly ? STRIPE_LINK_MONTHLY : STRIPE_LINK_ANNUAL;
      if (paymentLink === "#") {
        ue.error(
          "Payment system not yet configured. Please contact our concierge to complete your subscription.",
          { duration: 8e3 }
        );
        setProcessingPlan(null);
        return;
      }
      const origin = window.location.origin;
      const successUrl = encodeURIComponent(
        `${origin}/membership?session=success&plan=${plan}`
      );
      const cancelUrl = encodeURIComponent(
        `${origin}/membership?session=cancelled`
      );
      const redirectUrl = `${paymentLink}?success_url=${successUrl}&cancel_url=${cancelUrl}`;
      window.location.href = redirectUrl;
    } catch (_err) {
      ue.error("Subscription could not be started. Please try again.");
      setProcessingPlan(null);
    }
  }
  function handleCancel() {
    cancel(void 0, {
      onSuccess: () => ue.success("Membership cancelled."),
      onError: () => ue.error("Could not cancel. Please try again.")
    });
  }
  const urlParams = new URLSearchParams(window.location.search);
  const sessionResult = urlParams.get("session");
  const sessionPlan = urlParams.get("plan");
  reactExports.useEffect(() => {
    if (sessionResult === "success" && (membership == null ? void 0 : membership.status) === MembershipStatus.pending) {
      void updateStatus({
        userId: membership.userId,
        status: MembershipStatus.active
      }).then(() => {
        ue.success("Membership activated! Welcome to OK Rentals Elite.", {
          duration: 6e3
        });
      });
    }
  }, [sessionResult, membership == null ? void 0 : membership.status, membership == null ? void 0 : membership.userId, updateStatus]);
  const stripeReturnBanner = sessionResult === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      className: "bg-emerald-500/10 border-b border-emerald-500/30 py-4",
      "data-ocid": "membership.stripe_success_banner",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-emerald-500 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
          "Payment confirmed! Your",
          " ",
          sessionPlan === "annual" ? "Annual" : "Monthly",
          " Elite membership is being activated. Our team will verify and complete activation shortly."
        ] })
      ] })
    }
  ) : sessionResult === "cancelled" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      className: "bg-amber-500/10 border-b border-amber-500/30 py-4",
      "data-ocid": "membership.stripe_cancel_banner",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-amber-500 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Payment was not completed. Your membership is pending — please try again." })
      ] })
    }
  ) : null;
  const membershipStatus = membership == null ? void 0 : membership.status;
  const statusConfig = membershipStatus ? STATUS_CONFIG[membershipStatus] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "membership.page", children: [
    stripeReturnBanner,
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-4", children: "Elite Access Program" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl sm:text-6xl font-bold text-foreground mb-5", children: "Elite Membership" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed", children: "One membership. Unlimited access to the world's most extraordinary vehicles — Lamborghini, Rolls-Royce, and Mercedes — whenever you desire." })
        ]
      }
    ) }) }),
    membership && statusConfig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: `py-6 border-b ${statusConfig.bg}`,
        "data-ocid": "membership.status_banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ${statusConfig.color}`,
                children: isActiveMember ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }) : statusConfig.icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
                  membership.plan === MembershipPlan.annual ? "Annual" : "Monthly",
                  " ",
                  "Elite Membership"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color}`,
                    children: [
                      statusConfig.icon,
                      statusConfig.label
                    ]
                  }
                )
              ] }),
              isActiveMember && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Renews",
                " ",
                new Date(Number(membership.endDate)).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }
                )
              ] }),
              isPendingMember && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Awaiting payment confirmation. Complete checkout to activate your membership." }),
              membership.status === MembershipStatus.failed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Payment failed. Select a plan below to try again." })
            ] })
          ] }),
          isActiveMember && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleCancel,
              disabled: cancelling,
              className: "border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase tracking-widest",
              "data-ocid": "membership.cancel_button",
              type: "button",
              children: cancelling ? "Cancelling..." : "Cancel Membership"
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "mb-8 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4",
          "data-ocid": "membership.payment_notice",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-primary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-0.5", children: "Secure Stripe Checkout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: `Clicking "Activate" will redirect you to Stripe's secure checkout to enter your card details. Your membership is only activated after successful payment — you will never be charged without completing checkout.` })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-8", children: plans.map((p, i) => {
        const isCurrentPlan = isActiveMember && (membership == null ? void 0 : membership.plan) === p.plan;
        const isPending = processingPlan === p.plan;
        const cannotSubscribe = isBlockedStatus && !isCurrentPlan;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 28 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.15 },
            className: `relative bg-card rounded-xl p-8 flex flex-col transition-all duration-300 ${p.highlight ? "border-2 border-primary shadow-luxury" : "border border-border hover:border-primary/40"} ${isCurrentPlan ? "ring-2 ring-primary/40" : ""}`,
            "data-ocid": `membership.plan_card.${i + 1}`,
            children: [
              p.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] px-4 py-1", children: p.badge }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-7", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-4", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-5xl font-bold text-primary", children: pricingLoading ? "..." : `${p.price}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: p.period })
                ] }),
                p.savings && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-primary/40 text-primary text-xs mt-2",
                    children: p.savings
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-3 leading-relaxed", children: p.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8 flex-1", children: p.features.map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-2.5 text-sm text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary flex-shrink-0" }),
                    feat
                  ]
                },
                feat
              )) }),
              isCurrentPlan ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  disabled: true,
                  className: "w-full uppercase tracking-widest text-sm opacity-70",
                  "data-ocid": `membership.current_plan_button.${i + 1}`,
                  type: "button",
                  children: "Current Plan"
                }
              ) : cannotSubscribe ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  disabled: true,
                  variant: "outline",
                  className: "w-full uppercase tracking-widest text-sm opacity-50",
                  "data-ocid": `membership.blocked_button.${i + 1}`,
                  type: "button",
                  children: isPendingMember ? "Payment Pending" : "Already Subscribed"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: () => handleSubscribe(p.plan),
                  disabled: isPending || processingPlan !== null,
                  className: `w-full uppercase tracking-widest text-sm font-semibold ${p.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-luxury" : "bg-secondary text-secondary-foreground hover:bg-muted border border-border"}`,
                  "data-ocid": `membership.subscribe_button.${i + 1}`,
                  children: isPending ? "Redirecting to Checkout..." : isAuthenticated ? `Activate ${p.name} — Secure Checkout` : "Login to Subscribe"
                }
              ),
              !isCurrentPlan && !cannotSubscribe && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-center text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3 h-3" }),
                "Powered by Stripe. Card details entered on Stripe's secure page."
              ] })
            ]
          },
          p.plan
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-16 bg-card border-t border-border",
        "data-ocid": "membership.benefits_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-3", children: "Plan Comparison" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Everything you get with each tier, at a glance." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border rounded-xl overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 bg-card border-b border-border px-6 py-3 [&>*]:min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Benefit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center", children: "Monthly" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary text-center", children: "Annual" })
            ] }),
            comparisonRows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -8 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { delay: i * 0.05 },
                className: `grid grid-cols-3 px-6 py-3.5 items-center [&>*]:min-w-0 ${i % 2 === 0 ? "bg-background" : "bg-card/50"}`,
                "data-ocid": `membership.benefit_row.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground break-words", children: row.feature }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, { active: row.monthly }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, { active: row.annual }) })
                ]
              },
              row.feature
            ))
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-14 bg-background border-t border-border",
        "data-ocid": "membership.payment_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-3", children: "Payment Methods" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 text-sm", children: "Subscriptions are processed securely through Stripe. Crypto and Apple Pay available at checkout." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-4 mb-10", children: PAYMENT_METHODS.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2.5 bg-card border border-border rounded-lg px-5 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: label })
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-6", children: [
            {
              step: "01",
              title: "Choose Your Plan",
              desc: "Monthly or Annual — both include full fleet access"
            },
            {
              step: "02",
              title: "Secure Stripe Checkout",
              desc: "Enter card details on Stripe's PCI-compliant checkout — we never see your card"
            },
            {
              step: "03",
              title: "Drive Unlimited",
              desc: "Membership activates after payment. Book any vehicle, any time"
            }
          ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "bg-card border border-border rounded-lg p-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-bold text-primary/30 mb-3", children: s.step }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm mb-1.5", children: s.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: s.desc })
              ]
            },
            s.step
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-14 bg-card border-t border-border",
        "data-ocid": "membership.contact_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-10 h-10 text-primary/60 mx-auto mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-3", children: "Questions? Let's Talk." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-7 leading-relaxed", children: "Our concierge team is available around the clock to walk you through membership options, verify payments, or assist with your subscription." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+14155551234", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  className: "bg-primary text-primary-foreground uppercase tracking-widest px-10 hover:bg-primary/90 shadow-luxury",
                  "data-ocid": "membership.contact_button",
                  children: "Contact Concierge"
                }
              ) })
            ]
          }
        ) })
      }
    )
  ] });
}
export {
  MembershipPage
};
