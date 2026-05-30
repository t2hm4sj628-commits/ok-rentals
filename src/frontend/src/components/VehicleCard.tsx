import type { Vehicle } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddFavorite,
  useAverageRating,
  useFavorites,
  useRemoveFavorite,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Flame, Fuel, Gauge, Heart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
  className?: string;
  favoriteIds?: string[];
}

function formatRate(rate: bigint): string {
  const num = Number(rate);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function VehicleCard({
  vehicle,
  index = 0,
  className,
  favoriteIds,
}: VehicleCardProps) {
  const isAvailable = vehicle.available;
  const { isAuthenticated, login } = useAuth();
  const { data: myFavorites } = useFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const { data: avgRating } = useAverageRating(vehicle.id);

  const favList = favoriteIds ?? myFavorites ?? [];
  const isFavorited = favList.includes(vehicle.id.toString());

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Please log in to save favorites.");
      login();
      return;
    }
    if (isFavorited) {
      removeFavorite(vehicle.id.toString());
    } else {
      addFavorite(vehicle.id.toString());
    }
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    const target = e.currentTarget;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      const placeholder = parent.querySelector(".img-placeholder");
      if (placeholder) (placeholder as HTMLElement).style.display = "flex";
    }
  }

  return (
    <Link
      to="/cars/$carId"
      params={{ carId: vehicle.id.toString() }}
      className="block"
      data-ocid={`vehicle.card.${index + 1}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={cn(
          "group relative bg-card border border-border rounded-lg overflow-hidden hover-lift transition-luxury shadow-luxury-sm hover:shadow-luxury cursor-pointer",
          "hover:border-primary/40",
          className,
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          {vehicle.imageUrl ? (
            <>
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.color} ${vehicle.name} ${vehicle.year}`}
                className="w-full h-full object-cover transition-luxury group-hover:scale-105"
                loading="lazy"
                width={400}
                height={250}
                onError={handleImageError}
              />
              <div
                className="img-placeholder w-full h-full flex-col items-center justify-center gap-2 absolute inset-0 bg-secondary"
                style={{ display: "none" }}
              >
                <Gauge className="w-12 h-12 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest text-center px-4">
                  {vehicle.name}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Gauge className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
                {vehicle.name}
              </p>
            </div>
          )}
          {/* Favorite + Availability badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 backdrop-blur-sm ${
                isFavorited
                  ? "bg-primary/90 border-primary text-primary-foreground"
                  : "bg-black/40 border-white/20 text-white/80 hover:bg-primary/80 hover:border-primary hover:text-primary-foreground"
              }`}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
              data-ocid={`vehicle.favorite_button.${index + 1}`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>
            {vehicle.bookedRanges && vehicle.bookedRanges.length > 3 && (
              <Badge
                className="text-xs uppercase tracking-widest font-semibold bg-orange-500/20 text-orange-400 border-orange-500/40"
                variant="outline"
                data-ocid={`vehicle.high_demand_badge.${index + 1}`}
              >
                <Flame className="w-3 h-3 mr-1" />
                High Demand
              </Badge>
            )}
            <Badge
              className={cn(
                "text-xs uppercase tracking-widest font-semibold",
                isAvailable
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "bg-destructive/20 text-destructive border-destructive/40",
              )}
              variant="outline"
            >
              {isAvailable ? "Available" : "Booked"}
            </Badge>
          </div>
          {/* Year badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="text-xs uppercase tracking-widest"
            >
              {vehicle.year.toString()}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-luxury truncate">
                {vehicle.name}
              </h3>
              {avgRating && Number(avgRating) > 0 ? (
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5">
                  ★ {Number(avgRating) / 10}
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-1.5 py-0.5 uppercase tracking-wider">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {vehicle.color}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-primary/70" />
              {vehicle.mileageLimit.toString()} mi/day
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-primary/70" />
              Luxury
            </span>
          </div>

          {/* Rate */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                From
              </p>
              <span className="font-display text-2xl font-bold text-primary">
                {formatRate(vehicle.dailyRate)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">/day</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Deposit</p>
              <p className="text-sm font-semibold text-foreground">
                {formatRate(vehicle.deposit)}
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs font-semibold transition-luxury"
            disabled={!isAvailable}
            data-ocid={`vehicle.view_details_button.${index + 1}`}
            type="button"
          >
            {isAvailable ? "View Details" : "Unavailable"}
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}
