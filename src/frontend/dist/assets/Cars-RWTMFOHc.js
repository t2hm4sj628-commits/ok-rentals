import { c as createLucideIcon, u as useListVehicles, d as useFavorites, r as reactExports, j as jsxRuntimeExports, f as ChevronDown, C as Crown, B as Button } from "./index-irnVJvcV.js";
import { V as VehicleCard } from "./VehicleCard-CPa8eIsT.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import "./gauge-C3Rv6Xb0.js";
import "./heart-DqkVX7dQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const MOCK_VEHICLES = [
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
    description: "The Lamborghini Urus in stunning pearl white is the world's most powerful Super Sport Utility Vehicle with V8 twin-turbo engine producing 657 horsepower.",
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
    description: "The pinnacle of British luxury. Hand-crafted perfection meets effortless power in this grand tourer that defines what it means to arrive in style.",
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
    description: "Sinister and powerful, the Nero Nemesis Urus commands every road it travels. Blacked-out presence with supercar performance built into an SUV silhouette.",
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
    description: "The benchmark of automotive luxury — unparalleled comfort with cutting-edge technology. The S-Class sets the standard every other luxury sedan aspires to meet.",
    rules: []
  }
];
function CarsPage() {
  const { data: backendVehicles, isLoading } = useListVehicles();
  const { data: favoriteIds } = useFavorites();
  const [priceFilter, setPriceFilter] = reactExports.useState("all");
  const [mileageFilter, setMileageFilter] = reactExports.useState("all");
  const [sortOption, setSortOption] = reactExports.useState("default");
  const [sortOpen, setSortOpen] = reactExports.useState(false);
  const vehicles = backendVehicles && backendVehicles.length > 0 ? backendVehicles : MOCK_VEHICLES;
  const filtered = reactExports.useMemo(() => {
    let result = [...vehicles];
    if (priceFilter === "under1000") {
      result = result.filter((v) => Number(v.dailyRate) < 1e3);
    } else if (priceFilter === "over1000") {
      result = result.filter((v) => Number(v.dailyRate) >= 1e3);
    }
    if (mileageFilter === "100") {
      result = result.filter((v) => Number(v.mileageLimit) <= 100);
    } else if (mileageFilter === "150") {
      result = result.filter((v) => Number(v.mileageLimit) <= 150);
    } else if (mileageFilter === "200plus") {
      result = result.filter((v) => Number(v.mileageLimit) >= 200);
    }
    if (sortOption === "price_asc") {
      result.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
    }
    return result;
  }, [vehicles, priceFilter, mileageFilter, sortOption]);
  const sortLabels = {
    default: "Sort: Featured",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low"
  };
  const hasActiveFilters = priceFilter !== "all" || mileageFilter !== "all";
  function clearFilters() {
    setPriceFilter("all");
    setMileageFilter("all");
    setSortOption("default");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "cars.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3", children: "OK RENTALS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl sm:text-6xl font-bold text-foreground mb-4 relative inline-block", children: [
            "Our Fleet",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "absolute bottom-0 left-0 h-[3px] w-full bg-primary",
                style: { bottom: "-6px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl mt-6 text-base leading-relaxed", children: "Every vehicle in our collection represents the pinnacle of automotive engineering. Choose your statement — performance, prestige, or pure luxury." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "border-primary/40 text-primary text-xs uppercase tracking-widest px-3 py-1",
                children: [
                  vehicles.length,
                  " Vehicles"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "border-border text-muted-foreground text-xs uppercase tracking-widest px-3 py-1",
                children: "All Available"
              }
            )
          ] })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-6 bg-secondary/30 border-b border-border sticky top-0 z-20 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Filter" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider mr-1", children: "Price:" }),
        [
          ["all", "All Rates"],
          ["under1000", "Under $1,000/day"],
          ["over1000", "$1,000+/day"]
        ].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setPriceFilter(val),
            "data-ocid": `cars.price_filter.${val}`,
            className: `px-3 py-1.5 text-xs rounded-full border transition-all duration-200 uppercase tracking-widest font-medium ${priceFilter === val ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
            children: label
          },
          val
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px h-5 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider mr-1", children: "Mileage:" }),
        [
          ["all", "All"],
          ["100", "100 mi/day"],
          ["150", "150 mi/day"],
          ["200plus", "200+ mi/day"]
        ].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMileageFilter(val),
            "data-ocid": `cars.mileage_filter.${val}`,
            className: `px-3 py-1.5 text-xs rounded-full border transition-all duration-200 uppercase tracking-widest font-medium ${mileageFilter === val ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
            children: label
          },
          val
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:ml-auto", children: [
        hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearFilters,
            "data-ocid": "cars.clear_filters_button",
            className: "text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors duration-200 uppercase tracking-widest",
            children: "Clear all"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSortOpen((p) => !p),
              "data-ocid": "cars.sort_dropdown",
              className: "flex items-center gap-2 px-4 py-2 text-xs bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-all duration-200 uppercase tracking-widest font-medium min-w-[180px] justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sortLabels[sortOption] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    className: `w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          sortOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-luxury overflow-hidden z-30", children: [
            ["default", "Featured"],
            ["price_asc", "Price: Low to High"],
            ["price_desc", "Price: High to Low"]
          ].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `cars.sort_option.${val}`,
              onClick: () => {
                setSortOption(val);
                setSortOpen(false);
              },
              className: `w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${sortOption === val ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`,
              children: label
            },
            val
          )) })
        ] })
      ] })
    ] }) }) }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: filtered.length === vehicles.length ? `Showing all ${filtered.length} vehicles` : `Showing ${filtered.length} of ${vehicles.length} vehicles` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-8 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "data-ocid": "cars.loading_state",
        children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[16/9] w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
              ] })
            ]
          },
          i
        ))
      }
    ) : filtered.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "data-ocid": "cars.vehicle_list",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: filtered.map((vehicle, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          VehicleCard,
          {
            vehicle,
            index: i,
            favoriteIds
          },
          vehicle.id.toString()
        ))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "text-center py-24 bg-card border border-border rounded-lg",
        "data-ocid": "cars.empty_state",
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-12 h-12 text-primary/30 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold text-foreground mb-2", children: "No vehicles match" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-sm mx-auto", children: "Try adjusting your filters to discover the perfect vehicle for your journey." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: clearFilters,
              className: "border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs",
              type: "button",
              "data-ocid": "cars.reset_filters_button",
              children: "Clear All Filters"
            }
          )
        ]
      }
    ) }) }),
    sortOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-10",
        onClick: () => setSortOpen(false),
        onKeyDown: (e) => e.key === "Escape" && setSortOpen(false),
        "aria-hidden": "true"
      }
    )
  ] });
}
export {
  CarsPage
};
