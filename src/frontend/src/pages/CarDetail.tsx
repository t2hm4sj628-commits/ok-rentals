import { BookingStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useAverageRating,
  useCheckAvailability,
  useGetVehicle,
  useMyBookings,
  useSubmitReview,
  useVehicleReviews,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Bitcoin,
  Calendar,
  CheckCircle,
  CreditCard,
  Gauge,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  Smartphone,
  Star,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const RENTAL_RULES = [
  "Valid driver's license and passport required at pickup",
  "Minimum driver age: 25 years",
  "No smoking or vaping inside the vehicle at any time",
  "No off-road or track driving permitted",
  "Daily mileage limit: 150 miles — excess charged at $3/mile",
  "Return vehicle with the same fuel level as pickup",
  "Security deposit held; released within 5 business days of return",
  "Any damage or loss assessed against the security deposit",
  "Vehicle must be returned clean; professional cleaning fee may apply",
  "No pets inside the vehicle without prior written approval",
  "Renter is responsible for all toll and parking violations",
  "Subleasing or re-renting the vehicle is strictly prohibited",
];

type PaymentKey = "apple_pay" | "credit_card" | "crypto";

interface PaymentOption {
  key: PaymentKey;
  label: string;
  subLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: "apple_pay",
    label: "Apple Pay",
    subLabel: "Instant & secure",
    Icon: Smartphone,
  },
  {
    key: "credit_card",
    label: "Credit Card",
    subLabel: "Visa, MC, Amex",
    Icon: CreditCard,
  },
  {
    key: "crypto",
    label: "Crypto",
    subLabel: "BTC, ETH, USDC",
    Icon: Bitcoin,
  },
];

function formatRate(rate: bigint): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(rate));
}

export function CarDetailPage() {
  const { carId } = useParams({ from: "/cars/$carId" });
  const vehicleId = BigInt(carId);
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useGetVehicle(vehicleId);
  const { isAuthenticated, login } = useAuth();
  const { data: reviews } = useVehicleReviews(vehicleId);
  const { data: avgRating } = useAverageRating(vehicleId);
  const { mutate: submitReview, isPending: submittingReview } =
    useSubmitReview();
  const { data: myBookings } = useMyBookings();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentKey>("credit_card");
  const [dateOverlapError, setDateOverlapError] = useState("");
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Build a set of blocked date strings from bookedRanges
  useState(() => {
    if (!vehicle) return;
    const blocked = new Set<string>();
    for (const [rs, re] of vehicle.bookedRanges) {
      const start = Number(rs);
      const end = Number(re);
      for (let t = start; t <= end; t += 86400000) {
        blocked.add(new Date(t).toISOString().split("T")[0]);
      }
    }
    setBlockedDates(blocked);
  });

  const startTs = startDate ? BigInt(new Date(startDate).getTime()) : null;
  const endTs = endDate ? BigInt(new Date(endDate).getTime()) : null;
  const { data: isAvailable } = useCheckAvailability(vehicleId, startTs, endTs);

  function hasDateOverlap(start: string, end: string): boolean {
    if (!vehicle || !start || !end) return false;
    const selStart = new Date(start).getTime();
    const selEnd = new Date(end).getTime();
    return vehicle.bookedRanges.some(([rangeStart, rangeEnd]) => {
      const rs = Number(rangeStart);
      const re = Number(rangeEnd);
      return selStart < re && selEnd > rs;
    });
  }

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
  const totalCost = vehicle && days > 0 ? Number(vehicle.dailyRate) * days : 0;
  const todayStr = new Date().toISOString().split("T")[0];

  // Determine if user has a completed booking for this vehicle
  const completedBookingForVehicle = myBookings?.find(
    (b) =>
      b.vehicleId === vehicleId &&
      (b.status === BookingStatus.completed ||
        b.status === BookingStatus.returned),
  );

  function isDateBlocked(dateStr: string): boolean {
    if (!dateStr) return false;
    return blockedDates.has(dateStr);
  }

  function getBlockedRangeMessage(start: string, end: string): string {
    if (!vehicle || !start || !end) return "";
    const selStart = new Date(start).getTime();
    const selEnd = new Date(end).getTime();
    for (const [rangeStart, rangeEnd] of vehicle.bookedRanges) {
      const rs = Number(rangeStart);
      const re = Number(rangeEnd);
      if (selStart < re && selEnd > rs) {
        const fmt = (ts: number) =>
          new Date(ts).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        return `Dates overlap with a reservation from ${fmt(rs)} to ${fmt(re)}.`;
      }
    }
    return "";
  }

  function handleBookNow() {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!vehicle || !startDate || !endDate) return;
    // Final guard: re-check overlap before navigating to checkout
    if (hasDateOverlap(startDate, endDate)) {
      setDateOverlapError(
        "These dates are already reserved — please choose different dates.",
      );
      return;
    }
    if (isAvailable === false) {
      setDateOverlapError(
        "These dates are already reserved — please choose different dates.",
      );
      return;
    }
    navigate({
      to: "/checkout",
      search: {
        vehicleId: vehicle.id.toString(),
        startDate,
        endDate,
        paymentMethod: selectedPayment,
      },
    });
  }

  if (isLoading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
        data-ocid="car_detail.loading_state"
      >
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center"
        data-ocid="car_detail.error_state"
      >
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Vehicle Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This vehicle may no longer be available in our fleet.
        </p>
        <Link to="/cars">
          <Button
            variant="outline"
            className="border-primary/40 text-primary"
            data-ocid="car_detail.back_button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Button>
        </Link>
      </div>
    );
  }

  const bookingReady =
    vehicle.available &&
    !!startDate &&
    !!endDate &&
    !dateOverlapError &&
    isAvailable === true;

  return (
    <div className="min-h-screen bg-background" data-ocid="car_detail.page">
      {/* Breadcrumb bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            data-ocid="car_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fleet
          </Link>
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 rounded-xl overflow-hidden bg-secondary border border-border shadow-luxury aspect-video"
            >
              {vehicle.imageUrl ? (
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gauge className="w-24 h-24 text-muted-foreground/20" />
                </div>
              )}
            </motion.div>

            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-xs uppercase tracking-widest border-primary/40 text-primary"
                >
                  {vehicle.year.toString()}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs uppercase tracking-widest",
                    vehicle.available
                      ? "border-primary/40 text-primary"
                      : "border-destructive/40 text-destructive",
                  )}
                >
                  {vehicle.available ? "Available" : "Unavailable"}
                </Badge>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-2">
                {vehicle.name}
              </h1>
              <p className="text-muted-foreground capitalize text-sm tracking-widest uppercase mb-5">
                {vehicle.color}
              </p>

              {/* Prominent daily rate */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Starting from
                </p>
                <p className="font-display text-5xl font-bold text-primary leading-none">
                  {formatRate(vehicle.dailyRate)}
                  <span className="text-lg text-muted-foreground font-normal font-body ml-2">
                    / day
                  </span>
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Security Deposit",
                    value: formatRate(vehicle.deposit),
                  },
                  { label: "Miles/Day", value: `${vehicle.mileageLimit}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-secondary border border-border rounded-lg p-3"
                  >
                    <p className="text-base font-semibold font-display text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left col: Description + Rules */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-semibold text-foreground uppercase tracking-widest mb-4">
                About This Vehicle
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {vehicle.description}
              </p>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Rental Rules & Regulations
              </h2>
              <ul className="space-y-3">
                {(vehicle.rules.length > 0 ? vehicle.rules : RENTAL_RULES).map(
                  (rule) => (
                    <li
                      key={rule}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ),
                )}
              </ul>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
              data-ocid="car_detail.reviews_section"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Reviews
                </h2>
                <div className="flex items-center gap-2">
                  {avgRating && Number(avgRating) > 0 ? (
                    <>
                      <span className="text-amber-400 font-bold text-lg">
                        ★ {Number(avgRating) / 10}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({reviews?.length ?? 0} reviews)
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-4 mb-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div
                      key={review.id.toString()}
                      className="border-b border-border last:border-0 pb-4 last:pb-0"
                      data-ocid={`car_detail.review.${i + 1}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                              key={`star-${review.id?.toString() ?? i}-${starIdx}`}
                              className={`w-3.5 h-3.5 ${
                                starIdx < Number(review.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {review.reviewerId.toText().slice(0, 8)}…
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        {review.comment}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {new Date(Number(review.timestamp)).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Be the first to review this vehicle.
                  </p>
                )}
              </div>

              {/* Leave a Review form */}
              {isAuthenticated && completedBookingForVehicle && (
                <div
                  className="bg-secondary border border-border rounded-lg p-4"
                  data-ocid="car_detail.review_form"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Leave a Review
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 transition-colors"
                        data-ocid={`car_detail.review_star.${star}`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30 hover:text-amber-400/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this vehicle..."
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[80px] resize-y mb-3"
                    data-ocid="car_detail.review_comment_input"
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      reviewRating === 0 ||
                      !reviewComment.trim() ||
                      submittingReview
                    }
                    onClick={() => {
                      if (!completedBookingForVehicle) return;
                      submitReview(
                        {
                          vehicleId,
                          bookingId: completedBookingForVehicle.id,
                          rating: BigInt(reviewRating),
                          comment: reviewComment.trim(),
                        },
                        {
                          onSuccess: () => {
                            toast.success("Review submitted!");
                            setReviewRating(0);
                            setReviewComment("");
                          },
                          onError: () =>
                            toast.error("Failed to submit review."),
                        },
                      );
                    }}
                    className="bg-primary text-primary-foreground text-xs uppercase tracking-widest"
                    data-ocid="car_detail.review_submit_button"
                  >
                    {submittingReview ? "Submitting…" : "Submit Review"}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Logistics note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-secondary border border-border rounded-xl p-5 flex items-start gap-3"
            >
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Pickup & Drop-off
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Exact pickup location and drop-off instructions will be
                  communicated via email or phone call after your booking is
                  confirmed. Our concierge team will reach out within 24 hours.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right col: Booking form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="sticky top-6"
            >
              <div
                className="bg-card border border-border rounded-xl p-6 shadow-luxury"
                data-ocid="car_detail.booking_panel"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-[0.15em]">
                    Reserve This Vehicle
                  </h3>
                </div>

                {/* Date pickers */}
                <div className="space-y-3 mb-5">
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5"
                      htmlFor="startDate"
                    >
                      Pickup Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStartDate(val);
                        if (endDate && val >= endDate) setEndDate("");
                        const overlap = hasDateOverlap(val, endDate);
                        setDateOverlapError(
                          overlap ? getBlockedRangeMessage(val, endDate) : "",
                        );
                      }}
                      min={todayStr}
                      className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [color-scheme:dark]"
                      data-ocid="car_detail.start_date_input"
                    />
                    {startDate && isDateBlocked(startDate) && (
                      <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        This date is unavailable
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5"
                      htmlFor="endDate"
                    >
                      Return Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEndDate(val);
                        const overlap = hasDateOverlap(startDate, val);
                        setDateOverlapError(
                          overlap ? getBlockedRangeMessage(startDate, val) : "",
                        );
                      }}
                      min={startDate || todayStr}
                      className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [color-scheme:dark]"
                      data-ocid="car_detail.end_date_input"
                    />
                    {endDate && isDateBlocked(endDate) && (
                      <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        This date is unavailable
                      </p>
                    )}
                  </div>
                  {dateOverlapError && (
                    <p
                      className="text-xs text-destructive flex items-center gap-1.5"
                      data-ocid="car_detail.date_overlap_error"
                    >
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {dateOverlapError}
                    </p>
                  )}
                  {vehicle.bookedRanges.length > 0 && (
                    <div className="bg-secondary/60 border border-border rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        Unavailable Date Ranges
                      </p>
                      <ul className="space-y-1">
                        {vehicle.bookedRanges.map(([rs, re], _i) => (
                          <li
                            key={`range-${rs.toString()}-${re.toString()}`}
                            className="text-[10px] text-destructive flex items-center gap-1"
                          >
                            <Ban className="w-3 h-3" />
                            {new Date(Number(rs)).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            —{" "}
                            {new Date(Number(re)).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Availability indicator */}
                {startDate && endDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-4",
                      isAvailable === false
                        ? "bg-destructive/10 text-destructive"
                        : isAvailable === true
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                    data-ocid="car_detail.availability_status"
                  >
                    {isAvailable === false ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Not available for selected dates
                      </>
                    ) : isAvailable === true ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Available — dates confirmed
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 animate-pulse" />
                        Checking availability…
                      </>
                    )}
                  </motion.div>
                )}

                {/* Cost summary */}
                {days > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-secondary border border-border rounded-lg p-4 mb-5 overflow-hidden"
                    data-ocid="car_detail.cost_summary"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {formatRate(vehicle.dailyRate)} × {days} day
                        {days !== 1 ? "s" : ""}
                      </span>
                      <span className="text-foreground">
                        {formatRate(BigInt(Number(vehicle.dailyRate) * days))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Security Deposit
                      </span>
                      <span className="text-foreground">
                        {formatRate(vehicle.deposit)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 mt-1 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-foreground">
                        Total Due
                      </span>
                      <span className="font-display text-xl font-bold text-primary">
                        {formatRate(BigInt(totalCost))}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Payment method selector */}
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_OPTIONS.map(({ key, label, subLabel, Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedPayment(key)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg border text-center transition-all duration-200",
                          selectedPayment === key
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                        data-ocid={`car_detail.payment_${key}`}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            selectedPayment === key
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                        <span className="text-xs font-semibold leading-none">
                          {label}
                        </span>
                        <span className="text-[10px] leading-none opacity-70">
                          {subLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleBookNow}
                  disabled={isAuthenticated ? !bookingReady : false}
                  className={cn(
                    "w-full uppercase tracking-widest font-semibold transition-all duration-200 shadow-luxury-sm",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                  data-ocid="car_detail.book_now_button"
                >
                  {isAuthenticated ? "Book Now" : "Login to Book"}
                </Button>

                {isAuthenticated && (!startDate || !endDate) && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Select pickup and return dates to continue
                  </p>
                )}
                {isAuthenticated &&
                  startDate &&
                  endDate &&
                  dateOverlapError && (
                    <p className="text-xs text-destructive text-center mt-2 font-medium">
                      Cannot proceed — dates conflict with an existing
                      reservation.
                    </p>
                  )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
