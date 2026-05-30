import { c as createLucideIcon, k as useAuth, d as useFavorites, l as useAddFavorite, m as useRemoveFavorite, n as useAverageRating, j as jsxRuntimeExports, L as Link, o as cn, B as Button, i as ue } from "./index-irnVJvcV.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { G as Gauge } from "./gauge-C3Rv6Xb0.js";
import { H as Heart } from "./heart-DqkVX7dQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "3", x2: "15", y1: "22", y2: "22", key: "xegly4" }],
  ["line", { x1: "4", x2: "14", y1: "9", y2: "9", key: "xcnuvu" }],
  ["path", { d: "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18", key: "16j0yd" }],
  [
    "path",
    {
      d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",
      key: "7cu91f"
    }
  ]
];
const Fuel = createLucideIcon("fuel", __iconNode);
function formatRate(rate) {
  const num = Number(rate);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(num);
}
function VehicleCard({
  vehicle,
  index = 0,
  className,
  favoriteIds
}) {
  const isAvailable = vehicle.available;
  const { isAuthenticated, login } = useAuth();
  const { data: myFavorites } = useFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const { data: avgRating } = useAverageRating(vehicle.id);
  const favList = favoriteIds ?? myFavorites ?? [];
  const isFavorited = favList.includes(vehicle.id.toString());
  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      ue.info("Please log in to save favorites.");
      login();
      return;
    }
    if (isFavorited) {
      removeFavorite(vehicle.id.toString());
    } else {
      addFavorite(vehicle.id.toString());
    }
  }
  function handleImageError(e) {
    const target = e.currentTarget;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      const placeholder = parent.querySelector(".img-placeholder");
      if (placeholder) placeholder.style.display = "flex";
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/cars/$carId",
      params: { carId: vehicle.id.toString() },
      className: "block",
      "data-ocid": `vehicle.card.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: index * 0.1 },
          className: cn(
            "group relative bg-card border border-border rounded-lg overflow-hidden hover-lift transition-luxury shadow-luxury-sm hover:shadow-luxury cursor-pointer",
            "hover:border-primary/40",
            className
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/9] overflow-hidden bg-secondary", children: [
              vehicle.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: vehicle.imageUrl,
                    alt: `${vehicle.color} ${vehicle.name} ${vehicle.year}`,
                    className: "w-full h-full object-cover transition-luxury group-hover:scale-105",
                    loading: "lazy",
                    width: 400,
                    height: 250,
                    onError: handleImageError
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "img-placeholder w-full h-full flex-col items-center justify-center gap-2 absolute inset-0 bg-secondary",
                    style: { display: "none" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-12 h-12 text-muted-foreground/30" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 uppercase tracking-widest text-center px-4", children: vehicle.name })
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-12 h-12 text-muted-foreground/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 uppercase tracking-widest", children: vehicle.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 flex flex-col gap-1.5 items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleFavoriteClick,
                    className: `w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 backdrop-blur-sm ${isFavorited ? "bg-primary/90 border-primary text-primary-foreground" : "bg-black/40 border-white/20 text-white/80 hover:bg-primary/80 hover:border-primary hover:text-primary-foreground"}`,
                    "aria-label": isFavorited ? "Remove from favorites" : "Add to favorites",
                    "data-ocid": `vehicle.favorite_button.${index + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: `w-4 h-4 ${isFavorited ? "fill-current" : ""}`
                      }
                    )
                  }
                ),
                vehicle.bookedRanges && vehicle.bookedRanges.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: "text-xs uppercase tracking-widest font-semibold bg-orange-500/20 text-orange-400 border-orange-500/40",
                    variant: "outline",
                    "data-ocid": `vehicle.high_demand_badge.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3 mr-1" }),
                      "High Demand"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: cn(
                      "text-xs uppercase tracking-widest font-semibold",
                      isAvailable ? "bg-primary/20 text-primary border-primary/40" : "bg-destructive/20 text-destructive border-destructive/40"
                    ),
                    variant: "outline",
                    children: isAvailable ? "Available" : "Booked"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs uppercase tracking-widest",
                  children: vehicle.year.toString()
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground group-hover:text-primary transition-luxury truncate", children: vehicle.name }),
                  avgRating && Number(avgRating) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5", children: [
                    "★ ",
                    Number(avgRating) / 10
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-1.5 py-0.5 uppercase tracking-wider", children: "New" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground capitalize", children: vehicle.color })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-3.5 h-3.5 text-primary/70" }),
                  vehicle.mileageLimit.toString(),
                  " mi/day"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-3.5 h-3.5 text-primary/70" }),
                  "Luxury"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-0.5", children: "From" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: formatRate(vehicle.dailyRate) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: "/day" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Deposit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatRate(vehicle.deposit) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs font-semibold transition-luxury",
                  disabled: !isAvailable,
                  "data-ocid": `vehicle.view_details_button.${index + 1}`,
                  type: "button",
                  children: isAvailable ? "View Details" : "Unavailable"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  VehicleCard as V
};
