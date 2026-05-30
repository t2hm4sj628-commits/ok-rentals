import { MembershipPlan, MembershipStatus, PaymentMethod } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useCancelMembership,
  useGetComparisonRows,
  useGetPlanConfigs,
  useMyMembership,
  useSubscribeMembership,
  useUpdateMembershipStatus,
} from "@/hooks/useBackend";
import {
  AlertCircle,
  Bitcoin,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Phone,
  Smartphone,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Stripe Payment Links — configure VITE_STRIPE_PAYMENT_LINK_MONTHLY and
// VITE_STRIPE_PAYMENT_LINK_ANNUAL in your .env file with the links from
// your Stripe Dashboard → Payment Links section.
const STRIPE_LINK_MONTHLY =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY ?? "#";
const STRIPE_LINK_ANNUAL =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL ?? "#";

const STATIC_PLAN_META = [
  {
    plan: MembershipPlan.monthly,
    savings: null as string | null,
    period: "/ month",
    badge: null as string | null,
    highlight: false,
  },
  {
    plan: MembershipPlan.annual,
    savings: "Best Value",
    period: "/ year",
    badge: "Best Value",
    highlight: true,
  },
];

const PAYMENT_METHODS = [
  { icon: Smartphone, label: "Apple Pay", method: PaymentMethod.applePay },
  { icon: CreditCard, label: "Credit Card", method: PaymentMethod.creditCard },
  { icon: Bitcoin, label: "Crypto", method: PaymentMethod.crypto },
];

function CheckIcon({ active }: { active: boolean }) {
  if (active)
    return <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />;
  return <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />;
}

const STATUS_CONFIG: Record<
  MembershipStatus,
  { label: string; color: string; icon: React.ReactNode; bg: string }
> = {
  [MembershipStatus.active]: {
    label: "Active",
    color: "text-emerald-600 dark:text-emerald-400",
    icon: <CheckCircle className="w-4 h-4" />,
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  [MembershipStatus.pending]: {
    label: "Payment Pending",
    color: "text-amber-600 dark:text-amber-400",
    icon: <Clock className="w-4 h-4" />,
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  [MembershipStatus.failed]: {
    label: "Payment Failed",
    color: "text-red-600 dark:text-red-400",
    icon: <XCircle className="w-4 h-4" />,
    bg: "bg-red-500/10 border-red-500/30",
  },
  [MembershipStatus.cancelled]: {
    label: "Cancelled",
    color: "text-muted-foreground",
    icon: <AlertCircle className="w-4 h-4" />,
    bg: "bg-muted/40 border-border",
  },
  [MembershipStatus.expired]: {
    label: "Expired",
    color: "text-muted-foreground",
    icon: <AlertCircle className="w-4 h-4" />,
    bg: "bg-muted/40 border-border",
  },
};

export function MembershipPage() {
  const { isAuthenticated, login } = useAuth();
  const { data: membership } = useMyMembership();
  const { mutateAsync: subscribe } = useSubscribeMembership();
  const { mutate: cancel, isPending: cancelling } = useCancelMembership();
  const { mutateAsync: updateStatus } = useUpdateMembershipStatus();
  const { data: planConfigs, isLoading: pricingLoading } = useGetPlanConfigs();
  const { data: comparisonRows = [] } = useGetComparisonRows();
  const [processingPlan, setProcessingPlan] = useState<MembershipPlan | null>(
    null,
  );

  const plans = STATIC_PLAN_META.map((meta) => ({
    ...meta,
    name:
      meta.plan === MembershipPlan.monthly
        ? (planConfigs?.monthly.name ?? "Monthly Elite")
        : (planConfigs?.annual.name ?? "Annual Elite"),
    price:
      meta.plan === MembershipPlan.monthly
        ? (planConfigs?.monthly.price ?? 10000).toLocaleString()
        : (planConfigs?.annual.price ?? 100000).toLocaleString(),
    desc:
      meta.plan === MembershipPlan.monthly
        ? (planConfigs?.monthly.description ??
          "Full fleet access with no per-day charges. Cancel anytime.")
        : (planConfigs?.annual.description ??
          "Best value. Unlimited year-round access with exclusive VIP perks."),
    features:
      meta.plan === MembershipPlan.monthly
        ? (planConfigs?.monthly.features ?? [
            "Unlimited vehicle rentals",
            "Access to entire luxury fleet",
            "Priority booking guarantee",
            "24/7 concierge support",
            "Flexible cancellation",
          ])
        : (planConfigs?.annual.features ?? [
            "Unlimited vehicle rentals",
            "Access to entire luxury fleet",
            "Priority booking & dedicated liaison",
            "White-glove 24/7 concierge",
            "Complimentary professional detailing",
            "Exclusive new arrival previews",
            "Two complimentary guest rentals",
          ]),
  }));

  const isActiveMember = membership?.status === MembershipStatus.active;
  const isPendingMember = membership?.status === MembershipStatus.pending;
  const isBlockedStatus =
    membership?.status === MembershipStatus.active ||
    membership?.status === MembershipStatus.pending;

  async function handleSubscribe(plan: MembershipPlan) {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (isBlockedStatus) return;

    setProcessingPlan(plan);
    try {
      // Step 1: Create membership record with #pending status (payment not yet confirmed)
      await subscribe(plan);

      // Step 2: Redirect to Stripe Payment Link — card details entered on Stripe's page
      const paymentLink =
        plan === MembershipPlan.monthly
          ? STRIPE_LINK_MONTHLY
          : STRIPE_LINK_ANNUAL;

      if (paymentLink === "#") {
        toast.error(
          "Payment system not yet configured. Please contact our concierge to complete your subscription.",
          { duration: 8000 },
        );
        setProcessingPlan(null);
        return;
      }

      // Append return URL so Stripe can redirect back with session result
      const origin = window.location.origin;
      const successUrl = encodeURIComponent(
        `${origin}/membership?session=success&plan=${plan}`,
      );
      const cancelUrl = encodeURIComponent(
        `${origin}/membership?session=cancelled`,
      );
      const redirectUrl = `${paymentLink}?success_url=${successUrl}&cancel_url=${cancelUrl}`;

      // Redirect — membership activates only after webhook/return confirms payment
      window.location.href = redirectUrl;
    } catch (_err) {
      toast.error("Subscription could not be started. Please try again.");
      setProcessingPlan(null);
    }
  }

  function handleCancel() {
    cancel(undefined, {
      onSuccess: () => toast.success("Membership cancelled."),
      onError: () => toast.error("Could not cancel. Please try again."),
    });
  }

  // Activate membership when Stripe redirects back with success (run once on mount)
  const urlParams = new URLSearchParams(window.location.search);
  const sessionResult = urlParams.get("session");
  const sessionPlan = urlParams.get("plan");

  useEffect(() => {
    if (
      sessionResult === "success" &&
      membership?.status === MembershipStatus.pending
    ) {
      void updateStatus({
        userId: membership.userId,
        status: MembershipStatus.active,
      }).then(() => {
        toast.success("Membership activated! Welcome to OK Rentals Elite.", {
          duration: 6000,
        });
      });
    }
  }, [sessionResult, membership?.status, membership?.userId, updateStatus]);

  // Show return message from Stripe redirect
  const stripeReturnBanner =
    sessionResult === "success" ? (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-500/10 border-b border-emerald-500/30 py-4"
        data-ocid="membership.stripe_success_banner"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-medium text-foreground">
            Payment confirmed! Your{" "}
            {sessionPlan === "annual" ? "Annual" : "Monthly"} Elite membership
            is being activated. Our team will verify and complete activation
            shortly.
          </p>
        </div>
      </motion.div>
    ) : sessionResult === "cancelled" ? (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-500/10 border-b border-amber-500/30 py-4"
        data-ocid="membership.stripe_cancel_banner"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm font-medium text-foreground">
            Payment was not completed. Your membership is pending — please try
            again.
          </p>
        </div>
      </motion.div>
    ) : null;

  const membershipStatus = membership?.status;
  const statusConfig = membershipStatus
    ? STATUS_CONFIG[membershipStatus]
    : null;

  return (
    <div className="min-h-screen bg-background" data-ocid="membership.page">
      {/* Stripe Return Banners */}
      {stripeReturnBanner}

      {/* Hero */}
      <section className="bg-card border-b border-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 mx-auto mb-6">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              Elite Access Program
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-5">
              Elite Membership
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              One membership. Unlimited access to the world's most extraordinary
              vehicles — Lamborghini, Rolls-Royce, and Mercedes — whenever you
              desire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Membership Status Banner */}
      {membership && statusConfig && (
        <section
          className={`py-6 border-b ${statusConfig.bg}`}
          data-ocid="membership.status_banner"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ${statusConfig.color}`}
                >
                  {isActiveMember ? (
                    <Zap className="w-5 h-5" />
                  ) : (
                    statusConfig.icon
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">
                      {membership.plan === MembershipPlan.annual
                        ? "Annual"
                        : "Monthly"}{" "}
                      Elite Membership
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                  {isActiveMember && (
                    <p className="text-xs text-muted-foreground">
                      Renews{" "}
                      {new Date(Number(membership.endDate)).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  )}
                  {isPendingMember && (
                    <p className="text-xs text-muted-foreground">
                      Awaiting payment confirmation. Complete checkout to
                      activate your membership.
                    </p>
                  )}
                  {membership.status === MembershipStatus.failed && (
                    <p className="text-xs text-muted-foreground">
                      Payment failed. Select a plan below to try again.
                    </p>
                  )}
                </div>
              </div>
              {isActiveMember && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase tracking-widest"
                  data-ocid="membership.cancel_button"
                  type="button"
                >
                  {cancelling ? "Cancelling..." : "Cancel Membership"}
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Plan Cards */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Payment gate notice */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4"
            data-ocid="membership.payment_notice"
          >
            <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                Secure Stripe Checkout
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clicking "Activate" will redirect you to Stripe's secure
                checkout to enter your card details. Your membership is only
                activated after successful payment — you will never be charged
                without completing checkout.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((p, i) => {
              const isCurrentPlan =
                isActiveMember && membership?.plan === p.plan;
              const isPending = processingPlan === p.plan;
              const cannotSubscribe = isBlockedStatus && !isCurrentPlan;
              return (
                <motion.div
                  key={p.plan}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative bg-card rounded-xl p-8 flex flex-col transition-all duration-300 ${
                    p.highlight
                      ? "border-2 border-primary shadow-luxury"
                      : "border border-border hover:border-primary/40"
                  } ${isCurrentPlan ? "ring-2 ring-primary/40" : ""}`}
                  data-ocid={`membership.plan_card.${i + 1}`}
                >
                  {p.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] px-4 py-1">
                        {p.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="mb-7">
                    <h3 className="font-display text-xl font-bold text-foreground mb-4">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-display text-5xl font-bold text-primary">
                        {pricingLoading ? "..." : `${p.price}`}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {p.period}
                      </span>
                    </div>
                    {p.savings && (
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary text-xs mt-2"
                      >
                        {p.savings}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {p.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2.5 text-sm text-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button
                      disabled
                      className="w-full uppercase tracking-widest text-sm opacity-70"
                      data-ocid={`membership.current_plan_button.${i + 1}`}
                      type="button"
                    >
                      Current Plan
                    </Button>
                  ) : cannotSubscribe ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full uppercase tracking-widest text-sm opacity-50"
                      data-ocid={`membership.blocked_button.${i + 1}`}
                      type="button"
                    >
                      {isPendingMember
                        ? "Payment Pending"
                        : "Already Subscribed"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleSubscribe(p.plan)}
                      disabled={isPending || processingPlan !== null}
                      className={`w-full uppercase tracking-widest text-sm font-semibold ${
                        p.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-luxury"
                          : "bg-secondary text-secondary-foreground hover:bg-muted border border-border"
                      }`}
                      data-ocid={`membership.subscribe_button.${i + 1}`}
                    >
                      {isPending
                        ? "Redirecting to Checkout..."
                        : isAuthenticated
                          ? `Activate ${p.name} — Secure Checkout`
                          : "Login to Subscribe"}
                    </Button>
                  )}

                  {!isCurrentPlan && !cannotSubscribe && (
                    <p className="mt-3 text-center text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      Powered by Stripe. Card details entered on Stripe's secure
                      page.
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Comparison */}
      <section
        className="py-16 bg-card border-t border-border"
        data-ocid="membership.benefits_section"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Plan Comparison
            </h2>
            <p className="text-muted-foreground">
              Everything you get with each tier, at a glance.
            </p>
          </motion.div>

          <div className="bg-background border border-border rounded-xl overflow-x-auto">
            <div className="grid grid-cols-3 bg-card border-b border-border px-6 py-3 [&>*]:min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Benefit
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center">
                Monthly
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary text-center">
                Annual
              </span>
            </div>
            {comparisonRows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-3 px-6 py-3.5 items-center [&>*]:min-w-0 ${
                  i % 2 === 0 ? "bg-background" : "bg-card/50"
                }`}
                data-ocid={`membership.benefit_row.${i + 1}`}
              >
                <span className="text-sm text-foreground break-words">
                  {row.feature}
                </span>
                <div className="flex justify-center">
                  <CheckIcon active={row.monthly} />
                </div>
                <div className="flex justify-center">
                  <CheckIcon active={row.annual} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section
        className="py-14 bg-background border-t border-border"
        data-ocid="membership.payment_section"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Payment Methods
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Subscriptions are processed securely through Stripe. Crypto and
            Apple Pay available at checkout.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-card border border-border rounded-lg px-5 py-3"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-6">
            {[
              {
                step: "01",
                title: "Choose Your Plan",
                desc: "Monthly or Annual — both include full fleet access",
              },
              {
                step: "02",
                title: "Secure Stripe Checkout",
                desc: "Enter card details on Stripe's PCI-compliant checkout — we never see your card",
              },
              {
                step: "03",
                title: "Drive Unlimited",
                desc: "Membership activates after payment. Book any vehicle, any time",
              },
            ].map((s) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <p className="font-display text-3xl font-bold text-primary/30 mb-3">
                  {s.step}
                </p>
                <p className="font-semibold text-foreground text-sm mb-1.5">
                  {s.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="py-14 bg-card border-t border-border"
        data-ocid="membership.contact_section"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Phone className="w-10 h-10 text-primary/60 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Questions? Let's Talk.
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              Our concierge team is available around the clock to walk you
              through membership options, verify payments, or assist with your
              subscription.
            </p>
            <a href="tel:+14155551234">
              <Button
                type="button"
                className="bg-primary text-primary-foreground uppercase tracking-widest px-10 hover:bg-primary/90 shadow-luxury"
                data-ocid="membership.contact_button"
              >
                Contact Concierge
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
