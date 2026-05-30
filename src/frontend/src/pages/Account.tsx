import {
  BookingStatus,
  ExternalBlob,
  MembershipPlan,
  MembershipStatus,
} from "@/backend";
import type { Booking, Message, TripPhoto } from "@/backend";
import { PrincipalDisplay } from "@/components/PrincipalDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddTripPhoto,
  useCancelBooking,
  useFavorites,
  useGetVehicle,
  useListVehicles,
  useMessages,
  useMyBookings,
  useMyMembership,
  useMyProfile,
  useReferralCode,
  useReferralStats,
  useRegisterProfile,
  useRemoveFavorite,
  useSendMessage,
  useTripPhotos,
} from "@/hooks/useBackend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Crown,
  Heart,
  ImageIcon,
  MessageCircle,
  Send,
  ShieldCheck,
  Star,
  Upload,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(n: bigint): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  [BookingStatus.approved]: {
    label: "Approved",
    className: "border-primary/50 text-primary bg-primary/10",
  },
  [BookingStatus.pending]: {
    label: "Pending",
    className: "border-amber-500/50 text-amber-400 bg-amber-500/10",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "border-destructive/50 text-destructive bg-destructive/10",
  },
  [BookingStatus.active]: {
    label: "Active",
    className: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
  },
  [BookingStatus.completed]: {
    label: "Completed",
    className: "border-blue-500/50 text-blue-400 bg-blue-500/10",
  },
  [BookingStatus.returned]: {
    label: "Returned",
    className: "border-violet-500/50 text-violet-400 bg-violet-500/10",
  },
};

function MembershipBadge({
  plan,
  endDate,
}: {
  plan: MembershipPlan;
  endDate: bigint;
}) {
  const planLabel =
    plan === MembershipPlan.annual ? "Annual Elite" : "Monthly Elite";
  return (
    <div
      className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3"
      data-ocid="account.membership_badge"
    >
      <Crown className="w-5 h-5 text-primary flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {planLabel}
        </p>
        <p className="text-xs text-muted-foreground">
          Renews {formatDate(endDate)}
        </p>
      </div>
      <Link
        to="/membership"
        className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
        data-ocid="account.manage_membership_link"
      >
        Manage
      </Link>
    </div>
  );
}

function ProfileCard({
  profile,
  onSetup,
}: {
  profile: { displayName: string; email: string; createdAt: bigint } | null;
  onSetup: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-luxury-sm">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 mx-auto mb-4">
        <User className="w-8 h-8 text-primary" />
      </div>
      {profile ? (
        <div className="text-center">
          <p className="font-display font-bold text-lg text-foreground">
            {profile.displayName}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile.email}
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Member Since
            </p>
            <p className="text-sm text-foreground mt-0.5">
              {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No profile set up yet.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onSetup}
            className="border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10"
            data-ocid="account.setup_profile_button"
            type="button"
          >
            Set Up Profile
          </Button>
        </div>
      )}
    </div>
  );
}

function ProfileForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (name: string, email: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(displayName, email);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-5 mt-4 space-y-4"
    >
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        Create Profile
      </h3>
      <div>
        <label
          className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5"
          htmlFor="acc-displayName"
        >
          Display Name
        </label>
        <input
          id="acc-displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
          required
          data-ocid="account.display_name_input"
        />
      </div>
      <div>
        <label
          className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5"
          htmlFor="acc-email"
        >
          Email
        </label>
        <input
          id="acc-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
          required
          data-ocid="account.email_input"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="bg-primary text-primary-foreground text-xs uppercase tracking-widest"
          data-ocid="account.register_submit_button"
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs text-muted-foreground"
          data-ocid="account.register_cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function formatMessageTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function BookingMessages({ bookingId }: { bookingId: bigint }) {
  const { data: messages = [] } = useMessages(bookingId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage();
  const [text, setText] = useState("");
  const { principal } = useAuth();

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(
      { bookingId, content: text.trim() },
      {
        onSuccess: () => setText(""),
        onError: () => toast.error("Failed to send message."),
      },
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5" />
        Messages
      </p>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No messages yet.
          </p>
        ) : (
          messages.map((msg: Message, idx: number) => {
            const isMe = principal
              ? msg.senderId.toText() === principal.toText()
              : false;
            return (
              <div
                key={msg.id.toString()}
                className={`text-xs px-2.5 py-1.5 rounded-lg max-w-[85%] ${
                  isMe
                    ? "bg-primary/15 text-primary ml-auto"
                    : "bg-secondary text-secondary-foreground"
                }`}
                data-ocid={`account.message.${idx + 1}`}
              >
                <p className="font-medium text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                  {isMe ? "You" : "Admin"}
                </p>
                <p className="leading-relaxed">{msg.content}</p>
                <p className="text-[10px] opacity-50 mt-0.5 text-right">
                  {formatMessageTime(msg.timestamp)}
                </p>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-1.5 text-xs bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors"
          data-ocid="account.message_input"
        />
        <Button
          type="submit"
          size="sm"
          disabled={sending || !text.trim()}
          className="h-7 px-2.5 bg-primary text-primary-foreground"
          data-ocid="account.send_message_button"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}

function BookingTripPhotos({ booking }: { booking: Booking }) {
  const bookingIdStr = booking.id.toString();
  const { data: photos = [] } = useTripPhotos(bookingIdStr);
  const { mutate: addTripPhoto } = useAddTripPhoto();
  const { actor } = useActor(() => {
    const { createActor } = require("@/backend");
    return createActor();
  });
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const beforePhotos = photos.filter((p: TripPhoto) => p.phase === "before");
  const afterPhotos = photos.filter((p: TripPhoto) => p.phase === "after");

  async function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    phase: "before" | "after",
  ) {
    const file = e.target.files?.[0];
    if (!file || !actor) return;
    setUploading(phase);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const backend = actor as unknown as {
        _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>;
        _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>;
      };
      const reference = await backend._uploadFile(blob);
      const downloaded = await backend._downloadFile(reference);
      const url = downloaded.getDirectURL();
      addTripPhoto(
        { bookingId: bookingIdStr, phase, photoId: url },
        {
          onSuccess: () =>
            toast.success(
              `${phase === "before" ? "Before" : "After"} photo added.`,
            ),
          onError: () => toast.error("Failed to add photo."),
        },
      );
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(null);
      if (e.target) e.target.value = "";
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5" />
        Trip Photos
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Before */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
            Before
          </p>
          <div className="flex flex-wrap gap-1.5">
            {beforePhotos.map((p: TripPhoto, idx: number) => (
              <img
                key={p.id.toString()}
                src={p.photoId}
                alt="Before"
                className="w-14 h-14 object-cover rounded-md border border-border"
                data-ocid={`account.trip_photo.before.${idx + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
            ))}
          </div>
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFileSelect(e, "before")}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => beforeRef.current?.click()}
            disabled={uploading === "before"}
            className="mt-2 h-7 text-[10px] uppercase tracking-widest w-full"
            data-ocid="account.upload_before_photo_button"
          >
            {uploading === "before" ? (
              "Uploading..."
            ) : (
              <>
                <Camera className="w-3 h-3 mr-1" /> Before Photo
              </>
            )}
          </Button>
        </div>

        {/* After */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
            After
          </p>
          <div className="flex flex-wrap gap-1.5">
            {afterPhotos.map((p: TripPhoto, idx: number) => (
              <img
                key={p.id.toString()}
                src={p.photoId}
                alt="After"
                className="w-14 h-14 object-cover rounded-md border border-border"
                data-ocid={`account.trip_photo.after.${idx + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
            ))}
          </div>
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFileSelect(e, "after")}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => afterRef.current?.click()}
            disabled={uploading === "after"}
            className="mt-2 h-7 text-[10px] uppercase tracking-widest w-full"
            data-ocid="account.upload_after_photo_button"
          >
            {uploading === "after" ? (
              "Uploading..."
            ) : (
              <>
                <Camera className="w-3 h-3 mr-1" /> After Photo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  index,
  onCancel,
}: {
  booking: Booking;
  index: number;
  onCancel: (id: bigint) => void;
}) {
  const [showMessages, setShowMessages] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const canShowPhotos =
    booking.status === BookingStatus.active ||
    booking.status === BookingStatus.completed ||
    booking.status === BookingStatus.returned;

  return (
    <motion.div
      key={booking.id.toString()}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
      data-ocid={`account.booking.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Booking #{booking.id.toString()}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(booking.startDate)} — {formatDate(booking.endDate)}
          </p>
          <p className="text-sm font-bold text-primary mt-1.5">
            {formatCurrency(booking.totalCost)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Badge
            variant="outline"
            className={STATUS_CONFIG[booking.status].className}
          >
            {STATUS_CONFIG[booking.status].label}
          </Badge>
          {booking.status === BookingStatus.pending && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-2"
              type="button"
              data-ocid={`account.cancel_booking_button.${index + 1}`}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible actions */}
      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowMessages((s) => !s)}
          className="h-7 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary"
          data-ocid={`account.toggle_messages_button.${index + 1}`}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          {showMessages ? "Hide Messages" : "Messages"}
        </Button>
        {canShowPhotos && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPhotos((s) => !s)}
            className="h-7 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary"
            data-ocid={`account.toggle_photos_button.${index + 1}`}
          >
            <ImageIcon className="w-3 h-3 mr-1" />
            {showPhotos ? "Hide Photos" : "Trip Photos"}
          </Button>
        )}
      </div>

      {showMessages && <BookingMessages bookingId={booking.id} />}
      {showPhotos && canShowPhotos && <BookingTripPhotos booking={booking} />}
    </motion.div>
  );
}

function FavoritesTab() {
  const { data: favoriteIds = [] } = useFavorites();
  const { data: vehicles = [] } = useListVehicles();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const favoriteVehicles = vehicles.filter((v) =>
    favoriteIds.includes(v.id.toString()),
  );

  return (
    <div data-ocid="account.favorites_tab">
      <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary" />
        My Favorites
      </h2>

      {favoriteVehicles.length === 0 ? (
        <div
          className="text-center py-16 bg-card border border-border rounded-lg"
          data-ocid="account.favorites_empty_state"
        >
          <Heart className="w-10 h-10 text-primary/30 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Browse vehicles and tap the heart to save your favorites here.
          </p>
          <Link to="/cars">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10"
              data-ocid="account.browse_fleet_button"
            >
              Browse Fleet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="account.favorites_list">
          {favoriteVehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.id.toString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
              data-ocid={`account.favorite.${i + 1}`}
            >
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="w-16 h-12 object-cover rounded-md border border-border shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {vehicle.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.year.toString()} · {vehicle.color}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to="/cars" search={{ carId: vehicle.id.toString() }}>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs uppercase tracking-widest border-primary/40 text-primary hover:bg-primary/10"
                    data-ocid={`account.favorite_view_button.${i + 1}`}
                  >
                    View
                  </Button>
                </Link>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFavorite(vehicle.id.toString())}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                  data-ocid={`account.favorite_remove_button.${i + 1}`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReferralSection() {
  const { data: code = "" } = useReferralCode();
  const { data: stats } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const shareLink = code
    ? `${window.location.origin}?ref=${encodeURIComponent(code)}`
    : "";

  function handleCopy() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    });
  }

  if (!code) return null;

  return (
    <div
      className="bg-card border border-border rounded-lg p-5 mt-4"
      data-ocid="account.referral_section"
    >
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          Referral Program
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Share your link with friends. When they join and book, you both earn
        rewards.
      </p>

      <div className="bg-secondary/50 border border-border rounded-md px-3 py-2 mb-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Your Code
        </p>
        <p className="font-mono text-sm text-primary font-semibold">{code}</p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-xs text-muted-foreground truncate">
          {shareLink}
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleCopy}
          className="bg-primary text-primary-foreground text-xs uppercase tracking-widest"
          data-ocid="account.copy_referral_link_button"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" /> Copy
            </>
          )}
        </Button>
      </div>

      {stats && stats.referralCount > 0n && (
        <p className="text-xs text-muted-foreground mt-3">
          <strong className="text-foreground">
            {stats.referralCount.toString()}
          </strong>{" "}
          friend{stats.referralCount === 1n ? "" : "s"} joined using your
          referral link.
        </p>
      )}
    </div>
  );
}

export function AccountPage() {
  const { isAuthenticated, login, principal } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const { data: membership } = useMyMembership();
  const { mutate: registerProfile, isPending: registering } =
    useRegisterProfile();
  const { mutate: cancelBooking } = useCancelBooking();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "favorites">(
    "bookings",
  );

  function handleRegister(name: string, email: string) {
    registerProfile(
      { displayName: name, email },
      {
        onSuccess: () => {
          toast.success("Profile created!");
          setShowRegister(false);
        },
        onError: () =>
          toast.error("Failed to create profile. Please try again."),
      },
    );
  }

  function handleCancel(id: bigint) {
    cancelBooking(id, {
      onSuccess: () => toast.success("Booking cancelled."),
      onError: () => toast.error("Could not cancel booking."),
    });
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="account.auth_required"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm px-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Members Only
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sign in to access your account, booking history, and Elite
            membership benefits.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground uppercase tracking-widest px-8 hover:bg-primary/90 shadow-luxury"
            data-ocid="account.login_button"
          >
            Login with Internet Identity
          </Button>
        </motion.div>
      </div>
    );
  }

  const isActiveMember = membership?.status === MembershipStatus.active;

  return (
    <div className="min-h-screen bg-background" data-ocid="account.page">
      {/* Header */}
      <section className="bg-card border-b border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2">
              Dashboard
            </p>
            <h1 className="font-display text-4xl font-bold text-foreground">
              My Account
            </h1>
            {principal && (
              <div
                className="mt-2 max-w-sm"
                data-ocid="account.principal_display"
              >
                <PrincipalDisplay principal={principal.toText()} />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {profileLoading ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ) : (
              <ProfileCard
                profile={profile ?? null}
                onSetup={() => setShowRegister(true)}
              />
            )}

            {showRegister && !profile && (
              <ProfileForm
                onSubmit={handleRegister}
                onCancel={() => setShowRegister(false)}
                loading={registering}
              />
            )}

            {/* Membership Status */}
            {isActiveMember && membership ? (
              <MembershipBadge
                plan={membership.plan}
                endDate={membership.endDate}
              />
            ) : (
              <div
                className="bg-card border border-border rounded-lg p-5"
                data-ocid="account.membership_upsell"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    No Active Membership
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Unlock unlimited rentals with an Elite membership plan.
                </p>
                <Link to="/membership">
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/90"
                    data-ocid="account.upgrade_membership_button"
                  >
                    Explore Membership
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            )}

            <ReferralSection />
          </div>

          {/* Main Content Tabs */}
          <div className="md:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                  activeTab === "bookings"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="account.bookings_tab"
              >
                <Calendar className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Bookings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("favorites")}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                  activeTab === "favorites"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="account.favorites_tab_button"
              >
                <Heart className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Favorites
              </button>
            </div>

            {activeTab === "bookings" ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  My Bookings
                </h2>

                {bookingsLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="account.bookings_loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-3" data-ocid="account.bookings_list">
                    {bookings.map((booking, i) => (
                      <BookingCard
                        key={booking.id.toString()}
                        booking={booking}
                        index={i}
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-16 bg-card border border-border rounded-lg"
                    data-ocid="account.bookings_empty_state"
                  >
                    <Crown className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                    <p className="text-foreground font-semibold mb-2">
                      No Bookings Yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your rental history will appear here after your first
                      booking.
                    </p>
                    <Link to="/cars">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10"
                        data-ocid="account.browse_fleet_button"
                      >
                        Browse Fleet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <FavoritesTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
