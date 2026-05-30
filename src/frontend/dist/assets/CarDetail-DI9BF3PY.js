import { c as createLucideIcon, p as useParams, q as useNavigate, s as useGetVehicle, k as useAuth, t as useVehicleReviews, n as useAverageRating, v as useSubmitReview, w as useMyBookings, r as reactExports, x as useCheckAvailability, y as BookingStatus, j as jsxRuntimeExports, L as Link, B as Button, o as cn, i as ue } from "./index-irnVJvcV.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { C as CircleAlert, a as CircleCheckBig } from "./circle-check-big-DOMqNcZN.js";
import { A as ArrowLeft } from "./arrow-left-CfdV0Pwi.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { G as Gauge } from "./gauge-C3Rv6Xb0.js";
import { S as Shield } from "./shield-v2tpAXVL.js";
import { S as Star } from "./star-YZWh37Zs.js";
import { M as MessageSquare } from "./message-square-CTTCKPo-.js";
import { C as Calendar } from "./calendar-BprvNXmT.js";
import { C as CircleX } from "./circle-x-IvkZDk8J.js";
import { S as Smartphone } from "./smartphone-Bwz3yTh-.js";
import { C as CreditCard } from "./credit-card-DkWzIIts.js";
import { B as Bitcoin } from "./bitcoin-DMFPQ8NC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
];
const Ban = createLucideIcon("ban", __iconNode$1);
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
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
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
  "Subleasing or re-renting the vehicle is strictly prohibited"
];
const PAYMENT_OPTIONS = [
  {
    key: "apple_pay",
    label: "Apple Pay",
    subLabel: "Instant & secure",
    Icon: Smartphone
  },
  {
    key: "credit_card",
    label: "Credit Card",
    subLabel: "Visa, MC, Amex",
    Icon: CreditCard
  },
  {
    key: "crypto",
    label: "Crypto",
    subLabel: "BTC, ETH, USDC",
    Icon: Bitcoin
  }
];
function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(rate));
}
function CarDetailPage() {
  const { carId } = useParams({ from: "/cars/$carId" });
  const vehicleId = BigInt(carId);
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useGetVehicle(vehicleId);
  const { isAuthenticated, login } = useAuth();
  const { data: reviews } = useVehicleReviews(vehicleId);
  const { data: avgRating } = useAverageRating(vehicleId);
  const { mutate: submitReview, isPending: submittingReview } = useSubmitReview();
  const { data: myBookings } = useMyBookings();
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const [selectedPayment, setSelectedPayment] = reactExports.useState("credit_card");
  const [dateOverlapError, setDateOverlapError] = reactExports.useState("");
  const [blockedDates, setBlockedDates] = reactExports.useState(/* @__PURE__ */ new Set());
  const [reviewRating, setReviewRating] = reactExports.useState(0);
  const [reviewComment, setReviewComment] = reactExports.useState("");
  reactExports.useState(() => {
    if (!vehicle) return;
    const blocked = /* @__PURE__ */ new Set();
    for (const [rs, re] of vehicle.bookedRanges) {
      const start = Number(rs);
      const end = Number(re);
      for (let t = start; t <= end; t += 864e5) {
        blocked.add(new Date(t).toISOString().split("T")[0]);
      }
    }
    setBlockedDates(blocked);
  });
  const startTs = startDate ? BigInt(new Date(startDate).getTime()) : null;
  const endTs = endDate ? BigInt(new Date(endDate).getTime()) : null;
  const { data: isAvailable } = useCheckAvailability(vehicleId, startTs, endTs);
  function hasDateOverlap(start, end) {
    if (!vehicle || !start || !end) return false;
    const selStart = new Date(start).getTime();
    const selEnd = new Date(end).getTime();
    return vehicle.bookedRanges.some(([rangeStart, rangeEnd]) => {
      const rs = Number(rangeStart);
      const re = Number(rangeEnd);
      return selStart < re && selEnd > rs;
    });
  }
  const days = startDate && endDate ? Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 864e5
    )
  ) : 0;
  const totalCost = vehicle && days > 0 ? Number(vehicle.dailyRate) * days : 0;
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const completedBookingForVehicle = myBookings == null ? void 0 : myBookings.find(
    (b) => b.vehicleId === vehicleId && (b.status === BookingStatus.completed || b.status === BookingStatus.returned)
  );
  function isDateBlocked(dateStr) {
    if (!dateStr) return false;
    return blockedDates.has(dateStr);
  }
  function getBlockedRangeMessage(start, end) {
    if (!vehicle || !start || !end) return "";
    const selStart = new Date(start).getTime();
    const selEnd = new Date(end).getTime();
    for (const [rangeStart, rangeEnd] of vehicle.bookedRanges) {
      const rs = Number(rangeStart);
      const re = Number(rangeEnd);
      if (selStart < re && selEnd > rs) {
        const fmt = (ts) => new Date(ts).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
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
    if (hasDateOverlap(startDate, endDate)) {
      setDateOverlapError(
        "These dates are already reserved — please choose different dates."
      );
      return;
    }
    if (isAvailable === false) {
      setDateOverlapError(
        "These dates are already reserved — please choose different dates."
      );
      return;
    }
    navigate({
      to: "/checkout",
      search: {
        vehicleId: vehicle.id.toString(),
        startDate,
        endDate,
        paymentMethod: selectedPayment
      }
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14",
        "data-ocid": "car_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 mb-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
            ] })
          ] })
        ]
      }
    );
  }
  if (!vehicle) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center",
        "data-ocid": "car_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 text-destructive mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Vehicle Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "This vehicle may no longer be available in our fleet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "border-primary/40 text-primary",
              "data-ocid": "car_detail.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Fleet"
              ]
            }
          ) })
        ]
      }
    );
  }
  const bookingReady = vehicle.available && !!startDate && !!endDate && !dateOverlapError && isAvailable === true;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "car_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/cars",
        className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
        "data-ocid": "car_detail.back_link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Back to Fleet"
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-8 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          className: "lg:col-span-3 rounded-xl overflow-hidden bg-secondary border border-border shadow-luxury aspect-video",
          children: vehicle.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: vehicle.imageUrl,
              alt: vehicle.name,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-24 h-24 text-muted-foreground/20" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.1 },
          className: "lg:col-span-2 flex flex-col justify-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs uppercase tracking-widest border-primary/40 text-primary",
                  children: vehicle.year.toString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: cn(
                    "text-xs uppercase tracking-widest",
                    vehicle.available ? "border-primary/40 text-primary" : "border-destructive/40 text-destructive"
                  ),
                  children: vehicle.available ? "Available" : "Unavailable"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-2", children: vehicle.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground capitalize text-sm tracking-widest uppercase mb-5", children: vehicle.color }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1", children: "Starting from" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-5xl font-bold text-primary leading-none", children: [
                formatRate(vehicle.dailyRate),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-muted-foreground font-normal font-body ml-2", children: "/ day" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              {
                label: "Security Deposit",
                value: formatRate(vehicle.deposit)
              },
              { label: "Miles/Day", value: `${vehicle.mileageLimit}` }
            ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-secondary border border-border rounded-lg p-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold font-display text-foreground", children: stat.value }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mt-0.5", children: stat.label })
                ]
              },
              stat.label
            )) })
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground uppercase tracking-widest mb-4", children: "About This Vehicle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: vehicle.description })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: "bg-card border border-border rounded-xl p-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold text-foreground uppercase tracking-widest mb-5 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }),
                "Rental Rules & Regulations"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: (vehicle.rules.length > 0 ? vehicle.rules : RENTAL_RULES).map(
                (rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-3 text-sm text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rule })
                    ]
                  },
                  rule
                )
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4 },
            className: "bg-card border border-border rounded-xl p-6",
            "data-ocid": "car_detail.reviews_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold text-foreground uppercase tracking-widest flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-primary" }),
                  "Reviews"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: avgRating && Number(avgRating) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-400 font-bold text-lg", children: [
                    "★ ",
                    Number(avgRating) / 10
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "(",
                    (reviews == null ? void 0 : reviews.length) ?? 0,
                    " reviews)"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No reviews yet" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mb-6", children: reviews && reviews.length > 0 ? reviews.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border-b border-border last:border-0 pb-4 last:pb-0",
                  "data-ocid": `car_detail.review.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: Array.from({ length: 5 }).map((_, starIdx) => {
                        var _a;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Star,
                          {
                            className: `w-3.5 h-3.5 ${starIdx < Number(review.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`
                          },
                          `star-${((_a = review.id) == null ? void 0 : _a.toString()) ?? i}-${starIdx}`
                        );
                      }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                        review.reviewerId.toText().slice(0, 8),
                        "…"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-1", children: review.comment }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: new Date(Number(review.timestamp)).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }
                    ) })
                  ]
                },
                review.id.toString()
              )) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Be the first to review this vehicle." }) }),
              isAuthenticated && completedBookingForVehicle && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-secondary border border-border rounded-lg p-4",
                  "data-ocid": "car_detail.review_form",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 text-primary" }),
                      "Leave a Review"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-3", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setReviewRating(star),
                        className: "p-0.5 transition-colors",
                        "data-ocid": `car_detail.review_star.${star}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Star,
                          {
                            className: `w-5 h-5 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30 hover:text-amber-400/50"}`
                          }
                        )
                      },
                      star
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        value: reviewComment,
                        onChange: (e) => setReviewComment(e.target.value),
                        placeholder: "Share your experience with this vehicle...",
                        className: "w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[80px] resize-y mb-3",
                        "data-ocid": "car_detail.review_comment_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        disabled: reviewRating === 0 || !reviewComment.trim() || submittingReview,
                        onClick: () => {
                          if (!completedBookingForVehicle) return;
                          submitReview(
                            {
                              vehicleId,
                              bookingId: completedBookingForVehicle.id,
                              rating: BigInt(reviewRating),
                              comment: reviewComment.trim()
                            },
                            {
                              onSuccess: () => {
                                ue.success("Review submitted!");
                                setReviewRating(0);
                                setReviewComment("");
                              },
                              onError: () => ue.error("Failed to submit review.")
                            }
                          );
                        },
                        className: "bg-primary text-primary-foreground text-xs uppercase tracking-widest",
                        "data-ocid": "car_detail.review_submit_button",
                        children: submittingReview ? "Submitting…" : "Submit Review"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            className: "bg-secondary border border-border rounded-xl p-5 flex items-start gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-primary flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Pickup & Drop-off" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Exact pickup location and drop-off instructions will be communicated via email or phone call after your booking is confirmed. Our concierge team will reach out within 24 hours." })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25 },
          className: "sticky top-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-6 shadow-luxury",
              "data-ocid": "car_detail.booking_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground uppercase tracking-[0.15em]", children: "Reserve This Vehicle" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        className: "block text-xs uppercase tracking-widest text-muted-foreground mb-1.5",
                        htmlFor: "startDate",
                        children: "Pickup Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "startDate",
                        type: "date",
                        value: startDate,
                        onChange: (e) => {
                          const val = e.target.value;
                          setStartDate(val);
                          if (endDate && val >= endDate) setEndDate("");
                          const overlap = hasDateOverlap(val, endDate);
                          setDateOverlapError(
                            overlap ? getBlockedRangeMessage(val, endDate) : ""
                          );
                        },
                        min: todayStr,
                        className: "w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [color-scheme:dark]",
                        "data-ocid": "car_detail.start_date_input"
                      }
                    ),
                    startDate && isDateBlocked(startDate) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-destructive mt-1 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3 h-3" }),
                      "This date is unavailable"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        className: "block text-xs uppercase tracking-widest text-muted-foreground mb-1.5",
                        htmlFor: "endDate",
                        children: "Return Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "endDate",
                        type: "date",
                        value: endDate,
                        onChange: (e) => {
                          const val = e.target.value;
                          setEndDate(val);
                          const overlap = hasDateOverlap(startDate, val);
                          setDateOverlapError(
                            overlap ? getBlockedRangeMessage(startDate, val) : ""
                          );
                        },
                        min: startDate || todayStr,
                        className: "w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [color-scheme:dark]",
                        "data-ocid": "car_detail.end_date_input"
                      }
                    ),
                    endDate && isDateBlocked(endDate) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-destructive mt-1 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3 h-3" }),
                      "This date is unavailable"
                    ] })
                  ] }),
                  dateOverlapError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "car_detail.date_overlap_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 flex-shrink-0" }),
                        dateOverlapError
                      ]
                    }
                  ),
                  vehicle.bookedRanges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/60 border border-border rounded-lg p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Unavailable Date Ranges" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: vehicle.bookedRanges.map(([rs, re], _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "text-[10px] text-destructive flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3 h-3" }),
                          new Date(Number(rs)).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          }),
                          " ",
                          "—",
                          " ",
                          new Date(Number(re)).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })
                        ]
                      },
                      `range-${rs.toString()}-${re.toString()}`
                    )) })
                  ] })
                ] }),
                startDate && endDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: cn(
                      "flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-4",
                      isAvailable === false ? "bg-destructive/10 text-destructive" : isAvailable === true ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    ),
                    "data-ocid": "car_detail.availability_status",
                    children: isAvailable === false ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                      "Not available for selected dates"
                    ] }) : isAvailable === true ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
                      "Available — dates confirmed"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 animate-pulse" }),
                      "Checking availability…"
                    ] })
                  }
                ),
                days > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    className: "bg-secondary border border-border rounded-lg p-4 mb-5 overflow-hidden",
                    "data-ocid": "car_detail.cost_summary",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                          formatRate(vehicle.dailyRate),
                          " × ",
                          days,
                          " day",
                          days !== 1 ? "s" : ""
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatRate(BigInt(Number(vehicle.dailyRate) * days)) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Security Deposit" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatRate(vehicle.deposit) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 mt-1 flex justify-between items-baseline", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Total Due" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: formatRate(BigInt(totalCost)) })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Payment Method" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: PAYMENT_OPTIONS.map(({ key, label, subLabel, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedPayment(key),
                      className: cn(
                        "flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg border text-center transition-all duration-200",
                        selectedPayment === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      ),
                      "data-ocid": `car_detail.payment_${key}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Icon,
                          {
                            className: cn(
                              "w-5 h-5",
                              selectedPayment === key ? "text-primary" : "text-muted-foreground"
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold leading-none", children: label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] leading-none opacity-70", children: subLabel })
                      ]
                    },
                    key
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleBookNow,
                    disabled: isAuthenticated ? !bookingReady : false,
                    className: cn(
                      "w-full uppercase tracking-widest font-semibold transition-all duration-200 shadow-luxury-sm",
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                    ),
                    "data-ocid": "car_detail.book_now_button",
                    children: isAuthenticated ? "Book Now" : "Login to Book"
                  }
                ),
                isAuthenticated && (!startDate || !endDate) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-2", children: "Select pickup and return dates to continue" }),
                isAuthenticated && startDate && endDate && dateOverlapError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive text-center mt-2 font-medium", children: "Cannot proceed — dates conflict with an existing reservation." })
              ]
            }
          )
        }
      ) })
    ] }) })
  ] });
}
export {
  CarDetailPage
};
