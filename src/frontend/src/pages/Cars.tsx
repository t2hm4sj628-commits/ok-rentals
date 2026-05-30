import { VehicleCard } from "@/components/VehicleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites, useListVehicles } from "@/hooks/useBackend";
import { ChevronDown, Crown, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

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
    bookedRanges: [] as Array<[bigint, bigint]>,
    sortOrder: 0n,
    imageUrl: "/assets/urus-white.jpeg",
    description:
      "The Lamborghini Urus in stunning pearl white is the world's most powerful Super Sport Utility Vehicle with V8 twin-turbo engine producing 657 horsepower.",
    rules: [] as string[],
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
    description:
      "The pinnacle of British luxury. Hand-crafted perfection meets effortless power in this grand tourer that defines what it means to arrive in style.",
    rules: [] as string[],
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
    description:
      "Sinister and powerful, the Nero Nemesis Urus commands every road it travels. Blacked-out presence with supercar performance built into an SUV silhouette.",
    rules: [] as string[],
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
    description:
      "The benchmark of automotive luxury — unparalleled comfort with cutting-edge technology. The S-Class sets the standard every other luxury sedan aspires to meet.",
    rules: [] as string[],
  },
];

type PriceFilter = "all" | "under1000" | "over1000";
type MileageFilter = "all" | "100" | "150" | "200plus";
type SortOption = "default" | "price_asc" | "price_desc";

export function CarsPage() {
  const { data: backendVehicles, isLoading } = useListVehicles();
  const { data: favoriteIds } = useFavorites();
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [mileageFilter, setMileageFilter] = useState<MileageFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [sortOpen, setSortOpen] = useState(false);

  const vehicles =
    backendVehicles && backendVehicles.length > 0
      ? backendVehicles
      : MOCK_VEHICLES;

  const filtered = useMemo(() => {
    let result = [...vehicles];

    // Price filter — values are plain dollar integers
    if (priceFilter === "under1000") {
      result = result.filter((v) => Number(v.dailyRate) < 1000);
    } else if (priceFilter === "over1000") {
      result = result.filter((v) => Number(v.dailyRate) >= 1000);
    }

    // Mileage filter
    if (mileageFilter === "100") {
      result = result.filter((v) => Number(v.mileageLimit) <= 100);
    } else if (mileageFilter === "150") {
      result = result.filter((v) => Number(v.mileageLimit) <= 150);
    } else if (mileageFilter === "200plus") {
      result = result.filter((v) => Number(v.mileageLimit) >= 200);
    }

    // Sort
    if (sortOption === "price_asc") {
      result.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
    }

    return result;
  }, [vehicles, priceFilter, mileageFilter, sortOption]);

  const sortLabels: Record<SortOption, string> = {
    default: "Sort: Featured",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
  };

  const hasActiveFilters = priceFilter !== "all" || mileageFilter !== "all";

  function clearFilters() {
    setPriceFilter("all");
    setMileageFilter("all");
    setSortOption("default");
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="cars.page">
      {/* Page Header */}
      <section className="bg-card border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em] mb-3">
              OK RENTALS
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-4 relative inline-block">
              Our Fleet
              {/* Gold accent underline */}
              <span
                className="absolute bottom-0 left-0 h-[3px] w-full bg-primary"
                style={{ bottom: "-6px" }}
              />
            </h1>
            <p className="text-muted-foreground max-w-xl mt-6 text-base leading-relaxed">
              Every vehicle in our collection represents the pinnacle of
              automotive engineering. Choose your statement — performance,
              prestige, or pure luxury.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Badge
                variant="outline"
                className="border-primary/40 text-primary text-xs uppercase tracking-widest px-3 py-1"
              >
                {vehicles.length} Vehicles
              </Badge>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground text-xs uppercase tracking-widest px-3 py-1"
              >
                All Available
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="py-6 bg-secondary/30 border-b border-border sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filter Icon Label */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wider mr-1">
                Price:
              </span>
              {(
                [
                  ["all", "All Rates"],
                  ["under1000", "Under $1,000/day"],
                  ["over1000", "$1,000+/day"],
                ] as [PriceFilter, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriceFilter(val)}
                  data-ocid={`cars.price_filter.${val}`}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 uppercase tracking-widest font-medium ${
                    priceFilter === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-border" />

            {/* Mileage Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wider mr-1">
                Mileage:
              </span>
              {(
                [
                  ["all", "All"],
                  ["100", "100 mi/day"],
                  ["150", "150 mi/day"],
                  ["200plus", "200+ mi/day"],
                ] as [MileageFilter, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMileageFilter(val)}
                  data-ocid={`cars.mileage_filter.${val}`}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 uppercase tracking-widest font-medium ${
                    mileageFilter === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort + Clear — pushed to right */}
            <div className="flex items-center gap-3 sm:ml-auto">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  data-ocid="cars.clear_filters_button"
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors duration-200 uppercase tracking-widest"
                >
                  Clear all
                </button>
              )}

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((p) => !p)}
                  data-ocid="cars.sort_dropdown"
                  className="flex items-center gap-2 px-4 py-2 text-xs bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-all duration-200 uppercase tracking-widest font-medium min-w-[180px] justify-between"
                >
                  <span>{sortLabels[sortOption]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-luxury overflow-hidden z-30">
                    {(
                      [
                        ["default", "Featured"],
                        ["price_asc", "Price: Low to High"],
                        ["price_desc", "Price: High to Low"],
                      ] as [SortOption, string][]
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        data-ocid={`cars.sort_option.${val}`}
                        onClick={() => {
                          setSortOption(val);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
                          sortOption === val
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results count */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {filtered.length === vehicles.length
              ? `Showing all ${filtered.length} vehicles`
              : `Showing ${filtered.length} of ${vehicles.length} vehicles`}
          </p>
        </div>
      )}

      {/* Vehicle Grid */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="cars.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="cars.vehicle_list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((vehicle, i) => (
                <VehicleCard
                  key={vehicle.id.toString()}
                  vehicle={vehicle}
                  index={i}
                  favoriteIds={favoriteIds}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-24 bg-card border border-border rounded-lg"
              data-ocid="cars.empty_state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Crown className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No vehicles match
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Try adjusting your filters to discover the perfect vehicle for
                your journey.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs"
                type="button"
                data-ocid="cars.reset_filters_button"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Click outside to close sort dropdown */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setSortOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSortOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
