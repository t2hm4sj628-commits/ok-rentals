import { PaymentMethod } from "@/backend";
import type { Booking } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateBooking,
  useGetVehicle,
  usePolicies,
  useSubmitIDVerification,
} from "@/hooks/useBackend";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bitcoin,
  Calendar,
  Car,
  CheckCircle,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  FileCheck,
  FileUp,
  Loader2,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// Initialize Stripe outside component to avoid re-creation on re-renders
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
);

type CheckoutStep =
  | "select"
  | "insurance_waiver"
  | "id_verification"
  | "credit_card"
  | "crypto";

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CryptoSection({
  txHash,
  setTxHash,
  onSubmit,
  isPending,
}: {
  txHash: string;
  setTxHash: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  function copyToClipboard(text: string, label: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied!`));
  }
  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-5">
          Send Payment to Wallet
        </h3>
        <div className="space-y-4">
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#F7931A] flex items-center justify-center flex-shrink-0">
                <Bitcoin className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Bitcoin (BTC)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-muted-foreground font-mono break-all">
                bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
              </code>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    "BTC address",
                  )
                }
                className="flex-shrink-0 p-1.5 rounded hover:bg-primary/10 transition-colors"
                data-ocid="checkout.copy_btc_button"
              >
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">Ξ</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Ethereum (ETH)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-muted-foreground font-mono break-all">
                0x742d35Cc6634C0532925a3b844Bc454e4438f44e
              </code>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                    "ETH address",
                  )
                }
                className="flex-shrink-0 p-1.5 rounded hover:bg-primary/10 transition-colors"
                data-ocid="checkout.copy_eth_button"
              >
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Transaction Hash / ID
        </Label>
        <Input
          placeholder="Paste your transaction hash here"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          className="font-mono text-sm mb-4"
          data-ocid="checkout.tx_hash_input"
        />
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isPending || !txHash.trim()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12"
          data-ocid="checkout.crypto_submit_button"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Confirm Crypto Payment"
          )}
        </Button>
      </div>
    </div>
  );
}

/**
 * Inner component — must be a child of <Elements> to use useStripe/useElements.
 */
function CreditCardSectionInner({
  onPaySuccess,
  onPayError,
  isPending,
  grandTotal,
}: {
  onPaySuccess: (paymentMethodId: string) => void;
  onPayError: (msg: string) => void;
  isPending: boolean;
  grandTotal: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);

  const isProcessing = isPending || stripeLoading;

  async function handlePay() {
    if (!stripe || !elements) {
      onPayError("Payment system not loaded. Please refresh and try again.");
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPayError("Card element not found. Please refresh and try again.");
      return;
    }

    setStripeLoading(true);
    setStripeError(null);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    setStripeLoading(false);

    if (error) {
      const msg =
        error.message ??
        "Card validation failed. Please check your card details.";
      setStripeError(msg);
      onPayError(msg);
      return;
    }

    if (!paymentMethod?.id) {
      const msg = "Could not create payment method. Please try again.";
      setStripeError(msg);
      onPayError(msg);
      return;
    }

    // Stripe confirmed the card is real — proceed to booking
    onPaySuccess(paymentMethod.id);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Card Details
        </h3>
        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded px-2 py-1">
          <Shield className="w-3 h-3 text-primary/70" />
          <span className="text-[10px] font-semibold text-muted-foreground">
            Secured by Stripe
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-[#1434CB] rounded px-2 py-0.5">
          <span className="font-bold text-white text-xs tracking-wider">
            VISA
          </span>
        </div>
        <div className="relative w-9 h-5">
          <div className="absolute left-0 w-5 h-5 rounded-full bg-[#EB001B] opacity-90" />
          <div className="absolute left-2 w-5 h-5 rounded-full bg-[#F79E1B] opacity-90" />
        </div>
        <div className="bg-[#2E77BC] rounded px-2 py-0.5">
          <span className="font-bold text-white text-xs">AMEX</span>
        </div>
        <div className="ml-1 bg-secondary border border-border rounded px-1.5 py-0.5">
          <span className="font-bold text-muted-foreground text-[10px]">
            MC
          </span>
        </div>
      </div>

      {/* Stripe CardElement — real hosted card field */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">
          Card Information
        </Label>
        <div
          className="rounded-md border border-input bg-background px-3 py-3 focus-within:ring-1 focus-within:ring-primary/60 transition-all duration-200"
          data-ocid="checkout.stripe_card_element"
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#f0e6c8",
                  fontFamily: "inherit",
                  "::placeholder": {
                    color: "#6b6450",
                  },
                  iconColor: "#c9a84c",
                },
                invalid: {
                  color: "#f87171",
                  iconColor: "#f87171",
                },
              },
              hidePostalCode: false,
            }}
            onChange={(e) => {
              setCardReady(e.complete);
              setStripeError(e.error?.message ?? null);
            }}
          />
        </div>
        {stripeError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive flex items-center gap-1.5"
            data-ocid="checkout.stripe_error_state"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {stripeError}
          </motion.p>
        )}
      </div>

      <Button
        type="button"
        onClick={handlePay}
        disabled={isProcessing || !stripe || !cardReady}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12 shadow-lg"
        data-ocid="checkout.pay_now_button"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {stripeLoading ? "Validating Card..." : "Processing Booking..."}
          </span>
        ) : (
          `Pay Now — ${formatUSD(grandTotal)}`
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        Your card information is encrypted and secure. Powered by{" "}
        <span className="text-primary/80 font-medium">Stripe</span>.
      </p>
    </div>
  );
}

/**
 * CreditCardSection provides the Stripe Elements context required by
 * CreditCardSectionInner's useStripe / useElements hooks.
 */
function CreditCardSection({
  onPaySuccess,
  onPayError,
  isPending,
  grandTotal,
}: {
  onPaySuccess: (paymentMethodId: string) => void;
  onPayError: (msg: string) => void;
  isPending: boolean;
  grandTotal: number;
}) {
  return (
    <Elements stripe={stripePromise}>
      <CreditCardSectionInner
        onPaySuccess={onPaySuccess}
        onPayError={onPayError}
        isPending={isPending}
        grandTotal={grandTotal}
      />
    </Elements>
  );
}

type BookingState =
  | { status: "idle" }
  | { status: "success"; booking: Booking }
  | { status: "error"; message: string };

export function CheckoutPage() {
  const search = useSearch({ strict: false }) as Record<string, string>;
  const navigate = useNavigate();
  const vehicleId = search?.vehicleId ? BigInt(search.vehicleId) : null;
  const startDate = search?.startDate ?? "";
  const endDate = search?.endDate ?? "";

  const { data: vehicle } = useGetVehicle(vehicleId);
  const { isAuthenticated, login } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [step, setStep] = useState<CheckoutStep>("select");
  const [txHash, setTxHash] = useState("");
  const [bookingState, setBookingState] = useState<BookingState>({
    status: "idle",
  });

  // Insurance waiver state
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [waiverSignedName, setWaiverSignedName] = useState("");

  // ID verification state
  const [licensePhotoId, setLicensePhotoId] = useState("");
  const [ssnLast4, setSsnLast4] = useState("");
  const [idSubmitted, setIdSubmitted] = useState(false);

  const { data: policies } = usePolicies();
  const { mutate: submitIDVerification } = useSubmitIDVerification();

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              86400000,
          ),
        )
      : 0;

  const dailyRate = vehicle ? Number(vehicle.dailyRate) : 0;
  const subtotal = dailyRate * days;
  const deposit = vehicle ? Number(vehicle.deposit) : 0;
  const grandTotal = subtotal + deposit;

  function doCreateBooking(
    method: PaymentMethod,
    extraOpts: { cryptoTxRef?: string; stripeSessionId?: string } = {},
  ) {
    if (!vehicle || !startDate || !endDate) return;
    createBooking(
      {
        vehicleId: vehicle.id,
        startDate: BigInt(new Date(startDate).getTime()),
        endDate: BigInt(new Date(endDate).getTime()),
        paymentMethod: method,
        ...extraOpts,
      },
      {
        onSuccess: (booking) => {
          setBookingState({ status: "success", booking });
          // Submit ID verification after booking is created
          if (licensePhotoId && ssnLast4) {
            submitIDVerification(
              {
                bookingId: booking.id.toString(),
                licensePhotoId,
                ssnLast4,
              },
              {
                onSuccess: () => setIdSubmitted(true),
                onError: () => setIdSubmitted(false),
              },
            );
          }
          setStep("select"); // reset (confirmation shown via bookingState)
        },
        onError: (err) => {
          setBookingState({
            status: "error",
            message: err.message || "Something went wrong. Please try again.",
          });
        },
      },
    );
  }

  // Auth gate
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[70vh] flex items-center justify-center"
        data-ocid="checkout.auth_required"
      >
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Members Only
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Please sign in to complete your reservation with OK RENTALS.
          </p>
          <Button
            onClick={login}
            className="w-full bg-primary text-primary-foreground uppercase tracking-[0.2em] font-semibold"
            data-ocid="checkout.login_button"
          >
            Sign In to Continue
          </Button>
          <Link
            to="/cars"
            className="block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            data-ocid="checkout.browse_fleet_link"
          >
            ← Browse Fleet
          </Link>
        </div>
      </motion.div>
    );
  }

  // Confirmation screen
  if (bookingState.status === "success") {
    const booking = bookingState.booking;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[70vh] flex items-center justify-center px-4"
        data-ocid="checkout.success_state"
      >
        <div className="max-w-lg w-full">
          {/* Gold glow header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
              <div className="relative w-20 h-20 rounded-full border-2 border-primary/60 bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mt-6 mb-2">
              Booking Confirmed
            </h1>
            <p className="text-muted-foreground text-sm">
              Thank you for choosing OK RENTALS. Your reservation is secured.
            </p>
          </div>

          {/* Confirmation card */}
          <div className="bg-card border border-primary/20 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-primary/5 border-b border-primary/15 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Booking Reference
              </span>
              <span className="font-mono text-foreground font-bold text-sm">
                #{booking.id.toString().slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                    Vehicle
                  </p>
                  <p className="text-foreground font-semibold">
                    {vehicle?.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {vehicle?.color ?? ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                    Rental Period
                  </p>
                  <p className="text-foreground font-medium text-sm">
                    {formatDate(startDate)} → {formatDate(endDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {days} day{days > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                    Status
                  </p>
                  <p className="text-foreground font-medium text-sm capitalize">
                    {booking.status === "pending"
                      ? "Pending — awaiting admin approval"
                      : booking.status === "approved"
                        ? "Approved — ready for pickup"
                        : booking.status === "active"
                          ? "Active — vehicle is out"
                          : booking.status === "completed"
                            ? "Completed — returned and inspected"
                            : booking.status === "returned"
                              ? "Returned — deposit being released"
                              : "Cancelled"}
                  </p>
                </div>
              </div>
              {/* ID Verification */}
              {idSubmitted && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                      ID Verification
                    </p>
                    <p className="text-primary font-medium text-sm">
                      Submitted — pending admin review
                    </p>
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Charged
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  {formatUSD(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation policy */}
          {policies?.cancellationPolicy && (
            <div className="mt-4 bg-secondary/40 border border-border rounded-lg p-4 flex gap-3 items-start">
              <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Cancellation Policy:
                </span>{" "}
                {policies.cancellationPolicy}
              </p>
            </div>
          )}

          {/* Contact note */}
          <div className="mt-4 bg-secondary/60 border border-border rounded-lg p-4 flex gap-3 items-start">
            <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">What's next?</span>{" "}
              Our concierge team will reach out via email or phone within 24
              hours to arrange your pickup and drop-off details.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Link
              to="/account"
              className="flex-1"
              data-ocid="checkout.view_bookings_link"
            >
              <Button
                variant="outline"
                className="w-full border-border hover:border-primary/50"
              >
                View My Bookings
              </Button>
            </Link>
            <Link
              to="/cars"
              className="flex-1"
              data-ocid="checkout.browse_more_link"
            >
              <Button className="w-full bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold">
                Browse More Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="checkout.page">
      {/* Top bar */}
      <div className="bg-card border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              step === "select" ? navigate({ to: "/cars" }) : setStep("select")
            }
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            data-ocid="checkout.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === "select" ? "Back to Fleet" : "Back"}
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary/60" />
            <span className="text-xs text-muted-foreground">
              Secure Checkout
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2">
            Finalize Reservation
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {step === "select"
              ? "Select Payment Method"
              : step === "insurance_waiver"
                ? "Insurance Waiver"
                : step === "id_verification"
                  ? "ID Verification"
                  : step === "credit_card"
                    ? "Card Payment"
                    : "Crypto Payment"}
          </h1>

          {/* Booking Funnel Step Indicator */}
          <div className="mb-10" data-ocid="checkout.step_indicator">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[
                { label: "Select Vehicle", icon: Car, active: true },
                {
                  label: "Choose Dates",
                  icon: Calendar,
                  active: !!vehicleId,
                },
                {
                  label: "Waiver",
                  icon: ShieldCheck,
                  active:
                    step === "insurance_waiver" ||
                    step === "id_verification" ||
                    step === "credit_card" ||
                    step === "crypto",
                },
                {
                  label: "Payment",
                  icon: CheckCircle2,
                  active: step === "credit_card" || step === "crypto",
                },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        s.active
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-widest mt-1.5 ${
                        s.active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        arr[i + 1].active ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left */}
            <div className="lg:col-span-3 space-y-6">
              <AnimatePresence mode="wait">
                {step === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="bg-card border border-border rounded-xl p-6"
                    data-ocid="checkout.payment_section"
                  >
                    <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-5">
                      Choose How to Pay
                    </h3>
                    <div
                      className="space-y-3"
                      data-ocid="checkout.payment_options"
                    >
                      <button
                        type="button"
                        onClick={() => setStep("insurance_waiver")}
                        className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary bg-transparent hover:bg-primary/5 text-left transition-all duration-200 group"
                        data-ocid="checkout.payment_credit_card_option"
                      >
                        <div className="flex-shrink-0 flex gap-1">
                          <div className="bg-[#1434CB] rounded px-1.5 py-0.5">
                            <span className="font-bold text-white text-[10px]">
                              VISA
                            </span>
                          </div>
                          <div className="relative w-8 h-5">
                            <div className="absolute left-0 w-4 h-4 rounded-full bg-[#EB001B] opacity-90 top-0.5" />
                            <div className="absolute left-1.5 w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 top-0.5" />
                          </div>
                          <div className="bg-[#2E77BC] rounded px-1.5 py-0.5">
                            <span className="font-bold text-white text-[10px]">
                              AMEX
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            Credit / Debit Card
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Visa, Mastercard, Amex — secured by Stripe
                          </p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep("insurance_waiver")}
                        className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary bg-transparent hover:bg-primary/5 text-left transition-all duration-200 group"
                        data-ocid="checkout.payment_crypto_option"
                      >
                        <div className="flex-shrink-0 flex gap-1.5 items-center">
                          <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center">
                            <Bitcoin className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              Ξ
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            Cryptocurrency
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Bitcoin, Ethereum & more
                          </p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "insurance_waiver" && (
                  <motion.div
                    key="insurance_waiver"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="bg-card border border-border rounded-xl p-6 space-y-5"
                    data-ocid="checkout.insurance_waiver_section"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Insurance Waiver
                      </h3>
                    </div>
                    <div className="bg-secondary border border-border rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-muted-foreground leading-relaxed space-y-3">
                      {(
                        policies?.insuranceWaiverTerms ??
                        "By signing below, you acknowledge that you are responsible for any damage caused by negligence, reckless driving, or violation of rental terms. Basic insurance is included; supplemental coverage is available upon request."
                      )
                        .split("\n")
                        .map((p, i) => (
                          <p key={`para-${p.slice(0, 20)}-${i}`}>{p}</p>
                        ))}
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        id="waiverAgree"
                        type="checkbox"
                        checked={waiverAgreed}
                        onChange={(e) => setWaiverAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-primary"
                        data-ocid="checkout.waiver_checkbox"
                      />
                      <label
                        htmlFor="waiverAgree"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        I have read and agree to the insurance waiver
                      </label>
                    </div>
                    <div>
                      <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Full Legal Name (Digital Signature)
                      </Label>
                      <Input
                        value={waiverSignedName}
                        onChange={(e) => setWaiverSignedName(e.target.value)}
                        placeholder="Type your full legal name"
                        className="text-sm"
                        data-ocid="checkout.waiver_name_input"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setStep("id_verification")}
                      disabled={!waiverAgreed || !waiverSignedName.trim()}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12"
                      data-ocid="checkout.waiver_continue_button"
                    >
                      Continue to ID Verification
                    </Button>
                    <button
                      type="button"
                      onClick={() => setStep("select")}
                      className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Back to Payment Selection
                    </button>
                  </motion.div>
                )}

                {step === "id_verification" && (
                  <motion.div
                    key="id_verification"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="bg-card border border-border rounded-xl p-6 space-y-5"
                    data-ocid="checkout.id_verification_section"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        ID Verification
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo of your driver&apos;s license and enter the
                      last 4 digits of your SSN. This is required before pickup
                      and will be reviewed by our team.
                    </p>
                    <div>
                      <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Driver&apos;s License Photo
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            // Use object-storage upload pattern
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const base64 = reader.result as string;
                              try {
                                const res = await fetch(
                                  "/api/object-storage/upload",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      data: base64,
                                      filename: file.name,
                                    }),
                                  },
                                );
                                const json = await res.json();
                                if (json?.id) {
                                  setLicensePhotoId(json.id);
                                  toast.success("License photo uploaded");
                                } else {
                                  toast.error("Upload failed");
                                }
                              } catch {
                                toast.error("Upload failed");
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="text-sm"
                          data-ocid="checkout.license_upload_input"
                        />
                        {licensePhotoId && (
                          <FileCheck className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      {licensePhotoId && (
                        <p className="text-[10px] text-primary mt-1">
                          Photo uploaded successfully
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Last 4 Digits of SSN
                      </Label>
                      <Input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={ssnLast4}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setSsnLast4(val);
                        }}
                        placeholder="••••"
                        className="text-sm font-mono tracking-widest"
                        data-ocid="checkout.ssn_input"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setStep("credit_card")}
                      disabled={!licensePhotoId || ssnLast4.length !== 4}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12"
                      data-ocid="checkout.id_continue_button"
                    >
                      Continue to Payment
                    </Button>
                    <button
                      type="button"
                      onClick={() => setStep("insurance_waiver")}
                      className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Back to Insurance Waiver
                    </button>
                  </motion.div>
                )}

                {step === "credit_card" && (
                  <motion.div
                    key="credit_card"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep("id_verification")}
                      className="mb-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Back to ID Verification
                    </button>
                    <CreditCardSection
                      onPaySuccess={(paymentMethodId) =>
                        doCreateBooking(PaymentMethod.creditCard, {
                          stripeSessionId: paymentMethodId,
                        })
                      }
                      onPayError={(msg) => {
                        setBookingState({ status: "error", message: msg });
                        toast.error("Payment failed", { description: msg });
                      }}
                      isPending={isPending}
                      grandTotal={grandTotal}
                    />
                  </motion.div>
                )}

                {step === "crypto" && (
                  <motion.div
                    key="crypto"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep("id_verification")}
                      className="mb-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Back to ID Verification
                    </button>
                    <CryptoSection
                      txHash={txHash}
                      setTxHash={setTxHash}
                      onSubmit={() =>
                        doCreateBooking(PaymentMethod.crypto, {
                          cryptoTxRef: txHash,
                        })
                      }
                      isPending={isPending}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pickup note */}
              <div className="bg-secondary/40 border border-border rounded-xl p-5 flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Pickup & Drop-off Arrangements
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our team will reach out via{" "}
                    <span className="text-foreground">email or phone</span> to
                    arrange your pickup and drop-off.
                  </p>
                </div>
              </div>

              {/* Error state */}
              <AnimatePresence>
                {bookingState.status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex gap-4 items-start"
                    data-ocid="checkout.error_state"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-destructive-foreground mb-1">
                        Booking Failed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bookingState.message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBookingState({ status: "idle" })}
                      className="text-xs text-primary hover:underline flex-shrink-0"
                      data-ocid="checkout.retry_button"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div
                className="bg-card border border-border rounded-xl overflow-hidden sticky top-28"
                data-ocid="checkout.order_summary"
              >
                <div className="bg-primary/5 border-b border-primary/15 px-6 py-4">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    Order Summary
                  </h3>
                </div>
                <div className="px-6 py-5">
                  {vehicle ? (
                    <>
                      <div className="mb-5 pb-5 border-b border-border">
                        {vehicle.imageUrl && (
                          <img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                          />
                        )}
                        <p className="font-display font-bold text-foreground text-base leading-tight">
                          {vehicle.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">
                          {vehicle.color}
                        </p>
                      </div>
                      <div className="space-y-3 mb-5 pb-5 border-b border-border">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Pick Up
                            </p>
                            <p className="text-sm text-foreground font-medium">
                              {formatDate(startDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Drop Off
                            </p>
                            <p className="text-sm text-foreground font-medium">
                              {formatDate(endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                          <span className="text-sm text-foreground font-medium">
                            {days} day{days > 1 ? "s" : ""} rental
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2.5 mb-5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatUSD(dailyRate)} × {days} day
                            {days > 1 ? "s" : ""}
                          </span>
                          <span className="text-foreground">
                            {formatUSD(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Refundable Deposit
                          </span>
                          <span className="text-foreground">
                            {formatUSD(deposit)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-primary/20 pt-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-foreground">
                            Grand Total
                          </span>
                          <span className="font-display text-2xl font-bold text-primary">
                            {formatUSD(grandTotal)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deposit refundable upon vehicle return
                        </p>
                      </div>
                    </>
                  ) : (
                    <div
                      className="text-center py-6"
                      data-ocid="checkout.no_vehicle_state"
                    >
                      <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No vehicle selected.
                      </p>
                      <Link
                        to="/cars"
                        className="text-primary text-xs hover:underline mt-2 inline-block"
                        data-ocid="checkout.browse_fleet_link"
                      >
                        Browse Fleet →
                      </Link>
                    </div>
                  )}
                </div>
                <div className="px-6 pb-6">
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secured by OK RENTALS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
