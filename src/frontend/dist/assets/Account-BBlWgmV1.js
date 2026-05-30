import { c as createLucideIcon, k as useAuth, H as useMyProfile, w as useMyBookings, I as useMyMembership, J as useRegisterProfile, K as useCancelBooking, r as reactExports, j as jsxRuntimeExports, B as Button, M as MembershipStatus, L as Link, C as Crown, i as ue, N as MembershipPlan, O as useReferralCode, Q as useReferralStats, y as BookingStatus, S as MessageCircle, d as useFavorites, u as useListVehicles, m as useRemoveFavorite, T as useMessages, U as useSendMessage, V as Send, W as useTripPhotos, Y as useAddTripPhoto, Z as useActor, _ as ExternalBlob } from "./index-irnVJvcV.js";
import { P as PrincipalDisplay, C as Check, a as Camera } from "./PrincipalDisplay-A50Sdyjn.js";
import { B as Badge } from "./badge-DnE0tSAF.js";
import { S as Skeleton } from "./skeleton-BUCI7g4X.js";
import { m as motion } from "./proxy-B7zvdM7E.js";
import { S as ShieldCheck, C as Copy } from "./shield-check-D7D7k1Zv.js";
import { S as Star } from "./star-YZWh37Zs.js";
import { C as Calendar } from "./calendar-BprvNXmT.js";
import { H as Heart } from "./heart-DqkVX7dQ.js";
import { U as User } from "./user-Bvdi27gZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(n));
}
const STATUS_CONFIG = {
  [BookingStatus.approved]: {
    label: "Approved",
    className: "border-primary/50 text-primary bg-primary/10"
  },
  [BookingStatus.pending]: {
    label: "Pending",
    className: "border-amber-500/50 text-amber-400 bg-amber-500/10"
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "border-destructive/50 text-destructive bg-destructive/10"
  },
  [BookingStatus.active]: {
    label: "Active",
    className: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
  },
  [BookingStatus.completed]: {
    label: "Completed",
    className: "border-blue-500/50 text-blue-400 bg-blue-500/10"
  },
  [BookingStatus.returned]: {
    label: "Returned",
    className: "border-violet-500/50 text-violet-400 bg-violet-500/10"
  }
};
function MembershipBadge({
  plan,
  endDate
}) {
  const planLabel = plan === MembershipPlan.annual ? "Annual Elite" : "Monthly Elite";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3",
      "data-ocid": "account.membership_badge",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: planLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Renews ",
            formatDate(endDate)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/membership",
            className: "ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0",
            "data-ocid": "account.manage_membership_link",
            children: "Manage"
          }
        )
      ]
    }
  );
}
function ProfileCard({
  profile,
  onSetup
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 shadow-luxury-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-8 h-8 text-primary" }) }),
    profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground", children: profile.displayName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: profile.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: "Member Since" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-0.5", children: formatDate(profile.createdAt) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "No profile set up yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onSetup,
          className: "border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10",
          "data-ocid": "account.setup_profile_button",
          type: "button",
          children: "Set Up Profile"
        }
      )
    ] })
  ] });
}
function ProfileForm({
  onSubmit,
  onCancel,
  loading
}) {
  const [displayName, setDisplayName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(displayName, email);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "bg-card border border-border rounded-lg p-5 mt-4 space-y-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold uppercase tracking-widest text-primary", children: "Create Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              className: "text-xs text-muted-foreground uppercase tracking-widest block mb-1.5",
              htmlFor: "acc-displayName",
              children: "Display Name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "acc-displayName",
              value: displayName,
              onChange: (e) => setDisplayName(e.target.value),
              className: "w-full px-3 py-2 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors",
              required: true,
              "data-ocid": "account.display_name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              className: "text-xs text-muted-foreground uppercase tracking-widest block mb-1.5",
              htmlFor: "acc-email",
              children: "Email"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "acc-email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full px-3 py-2 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors",
              required: true,
              "data-ocid": "account.email_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: loading,
              className: "bg-primary text-primary-foreground text-xs uppercase tracking-widest",
              "data-ocid": "account.register_submit_button",
              children: loading ? "Saving..." : "Save Profile"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onCancel,
              className: "text-xs text-muted-foreground",
              "data-ocid": "account.register_cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
function formatMessageTime(ts) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function BookingMessages({ bookingId }) {
  const { data: messages = [] } = useMessages(bookingId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage();
  const [text, setText] = reactExports.useState("");
  const { principal } = useAuth();
  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(
      { bookingId, content: text.trim() },
      {
        onSuccess: () => setText(""),
        onError: () => ue.error("Failed to send message.")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5" }),
      "Messages"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-1", children: messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No messages yet." }) : messages.map((msg, idx) => {
      const isMe = principal ? msg.senderId.toText() === principal.toText() : false;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `text-xs px-2.5 py-1.5 rounded-lg max-w-[85%] ${isMe ? "bg-primary/15 text-primary ml-auto" : "bg-secondary text-secondary-foreground"}`,
          "data-ocid": `account.message.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-[10px] uppercase tracking-wider mb-0.5 opacity-70", children: isMe ? "You" : "Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed", children: msg.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-50 mt-0.5 text-right", children: formatMessageTime(msg.timestamp) })
          ]
        },
        msg.id.toString()
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSend, className: "flex gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: text,
          onChange: (e) => setText(e.target.value),
          placeholder: "Type a message...",
          className: "flex-1 px-3 py-1.5 text-xs bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors",
          "data-ocid": "account.message_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          size: "sm",
          disabled: sending || !text.trim(),
          className: "h-7 px-2.5 bg-primary text-primary-foreground",
          "data-ocid": "account.send_message_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
function BookingTripPhotos({ booking }) {
  const bookingIdStr = booking.id.toString();
  const { data: photos = [] } = useTripPhotos(bookingIdStr);
  const { mutate: addTripPhoto } = useAddTripPhoto();
  const { actor } = useActor(() => {
    const { createActor } = require("@/backend");
    return createActor();
  });
  const [uploading, setUploading] = reactExports.useState(null);
  const beforeRef = reactExports.useRef(null);
  const afterRef = reactExports.useRef(null);
  const beforePhotos = photos.filter((p) => p.phase === "before");
  const afterPhotos = photos.filter((p) => p.phase === "after");
  async function handleFileSelect(e, phase) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !actor) return;
    setUploading(phase);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const backend = actor;
      const reference = await backend._uploadFile(blob);
      const downloaded = await backend._downloadFile(reference);
      const url = downloaded.getDirectURL();
      addTripPhoto(
        { bookingId: bookingIdStr, phase, photoId: url },
        {
          onSuccess: () => ue.success(
            `${phase === "before" ? "Before" : "After"} photo added.`
          ),
          onError: () => ue.error("Failed to add photo.")
        }
      );
    } catch (err) {
      ue.error(err.message);
    } finally {
      setUploading(null);
      if (e.target) e.target.value = "";
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3.5 h-3.5" }),
      "Trip Photos"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5", children: "Before" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: beforePhotos.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: p.photoId,
            alt: "Before",
            className: "w-14 h-14 object-cover rounded-md border border-border",
            "data-ocid": `account.trip_photo.before.${idx + 1}`,
            onError: (e) => {
              e.target.src = "/assets/images/placeholder.svg";
            }
          },
          p.id.toString()
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: beforeRef,
            type: "file",
            accept: "image/*",
            className: "sr-only",
            onChange: (e) => handleFileSelect(e, "before")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => {
              var _a;
              return (_a = beforeRef.current) == null ? void 0 : _a.click();
            },
            disabled: uploading === "before",
            className: "mt-2 h-7 text-[10px] uppercase tracking-widest w-full",
            "data-ocid": "account.upload_before_photo_button",
            children: uploading === "before" ? "Uploading..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3 h-3 mr-1" }),
              " Before Photo"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5", children: "After" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: afterPhotos.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: p.photoId,
            alt: "After",
            className: "w-14 h-14 object-cover rounded-md border border-border",
            "data-ocid": `account.trip_photo.after.${idx + 1}`,
            onError: (e) => {
              e.target.src = "/assets/images/placeholder.svg";
            }
          },
          p.id.toString()
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: afterRef,
            type: "file",
            accept: "image/*",
            className: "sr-only",
            onChange: (e) => handleFileSelect(e, "after")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => {
              var _a;
              return (_a = afterRef.current) == null ? void 0 : _a.click();
            },
            disabled: uploading === "after",
            className: "mt-2 h-7 text-[10px] uppercase tracking-widest w-full",
            "data-ocid": "account.upload_after_photo_button",
            children: uploading === "after" ? "Uploading..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3 h-3 mr-1" }),
              " After Photo"
            ] })
          }
        )
      ] })
    ] })
  ] });
}
function BookingCard({
  booking,
  index,
  onCancel
}) {
  const [showMessages, setShowMessages] = reactExports.useState(false);
  const [showPhotos, setShowPhotos] = reactExports.useState(false);
  const canShowPhotos = booking.status === BookingStatus.active || booking.status === BookingStatus.completed || booking.status === BookingStatus.returned;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 16 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.07 },
      className: "bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors",
      "data-ocid": `account.booking.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              "Booking #",
              booking.id.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              formatDate(booking.startDate),
              " — ",
              formatDate(booking.endDate)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-primary mt-1.5", children: formatCurrency(booking.totalCost) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: STATUS_CONFIG[booking.status].className,
                children: STATUS_CONFIG[booking.status].label
              }
            ),
            booking.status === BookingStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => onCancel(booking.id),
                className: "text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-2",
                type: "button",
                "data-ocid": `account.cancel_booking_button.${index + 1}`,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => setShowMessages((s) => !s),
              className: "h-7 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary",
              "data-ocid": `account.toggle_messages_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3 h-3 mr-1" }),
                showMessages ? "Hide Messages" : "Messages"
              ]
            }
          ),
          canShowPhotos && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => setShowPhotos((s) => !s),
              className: "h-7 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary",
              "data-ocid": `account.toggle_photos_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3 mr-1" }),
                showPhotos ? "Hide Photos" : "Trip Photos"
              ]
            }
          )
        ] }),
        showMessages && /* @__PURE__ */ jsxRuntimeExports.jsx(BookingMessages, { bookingId: booking.id }),
        showPhotos && canShowPhotos && /* @__PURE__ */ jsxRuntimeExports.jsx(BookingTripPhotos, { booking })
      ]
    },
    booking.id.toString()
  );
}
function FavoritesTab() {
  const { data: favoriteIds = [] } = useFavorites();
  const { data: vehicles = [] } = useListVehicles();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const favoriteVehicles = vehicles.filter(
    (v) => favoriteIds.includes(v.id.toString())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "account.favorites_tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 text-primary" }),
      "My Favorites"
    ] }),
    favoriteVehicles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 bg-card border border-border rounded-lg",
        "data-ocid": "account.favorites_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-10 h-10 text-primary/30 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-2", children: "No favorites yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Browse vehicles and tap the heart to save your favorites here." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10",
              "data-ocid": "account.browse_fleet_button",
              children: "Browse Fleet"
            }
          ) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "account.favorites_list", children: favoriteVehicles.map((vehicle, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.07 },
        className: "bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/30 transition-colors",
        "data-ocid": `account.favorite.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: vehicle.imageUrl,
              alt: vehicle.name,
              className: "w-16 h-12 object-cover rounded-md border border-border shrink-0",
              onError: (e) => {
                e.target.src = "/assets/images/placeholder.svg";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: vehicle.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              vehicle.year.toString(),
              " · ",
              vehicle.color
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", search: { carId: vehicle.id.toString() }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "text-xs uppercase tracking-widest border-primary/40 text-primary hover:bg-primary/10",
                "data-ocid": `account.favorite_view_button.${i + 1}`,
                children: "View"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                onClick: () => removeFavorite(vehicle.id.toString()),
                className: "text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0",
                "data-ocid": `account.favorite_remove_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 fill-current" })
              }
            )
          ] })
        ]
      },
      vehicle.id.toString()
    )) })
  ] });
}
function ReferralSection() {
  const { data: code = "" } = useReferralCode();
  const { data: stats } = useReferralStats();
  const [copied, setCopied] = reactExports.useState(false);
  const shareLink = code ? `${window.location.origin}?ref=${encodeURIComponent(code)}` : "";
  function handleCopy() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      ue.success("Link copied to clipboard!");
    });
  }
  if (!code) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-lg p-5 mt-4",
      "data-ocid": "account.referral_section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Referral Program" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 leading-relaxed", children: "Share your link with friends. When they join and book, you both earn rewards." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/50 border border-border rounded-md px-3 py-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Your Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-primary font-semibold", children: code })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-input border border-border rounded-md px-3 py-2 text-xs text-muted-foreground truncate", children: shareLink }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleCopy,
              className: "bg-primary text-primary-foreground text-xs uppercase tracking-widest",
              "data-ocid": "account.copy_referral_link_button",
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1" }),
                " Copied"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1" }),
                " Copy"
              ] })
            }
          )
        ] }),
        stats && stats.referralCount > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: stats.referralCount.toString() }),
          " ",
          "friend",
          stats.referralCount === 1n ? "" : "s",
          " joined using your referral link."
        ] })
      ]
    }
  );
}
function AccountPage() {
  const { isAuthenticated, login, principal } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const { data: membership } = useMyMembership();
  const { mutate: registerProfile, isPending: registering } = useRegisterProfile();
  const { mutate: cancelBooking } = useCancelBooking();
  const [showRegister, setShowRegister] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState(
    "bookings"
  );
  function handleRegister(name, email) {
    registerProfile(
      { displayName: name, email },
      {
        onSuccess: () => {
          ue.success("Profile created!");
          setShowRegister(false);
        },
        onError: () => ue.error("Failed to create profile. Please try again.")
      }
    );
  }
  function handleCancel(id) {
    cancelBooking(id, {
      onSuccess: () => ue.success("Booking cancelled."),
      onError: () => ue.error("Could not cancel booking.")
    });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center bg-background",
        "data-ocid": "account.auth_required",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "text-center max-w-sm px-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-3", children: "Members Only" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 leading-relaxed", children: "Sign in to access your account, booking history, and Elite membership benefits." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: login,
                  className: "bg-primary text-primary-foreground uppercase tracking-widest px-8 hover:bg-primary/90 shadow-luxury",
                  "data-ocid": "account.login_button",
                  children: "Login with Internet Identity"
                }
              )
            ]
          }
        )
      }
    );
  }
  const isActiveMember = (membership == null ? void 0 : membership.status) === MembershipStatus.active;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "account.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2", children: "Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold text-foreground", children: "My Account" }),
          principal && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-2 max-w-sm",
              "data-ocid": "account.principal_display",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrincipalDisplay, { principal: principal.toText() })
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-full mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2 mx-auto" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileCard,
          {
            profile: profile ?? null,
            onSetup: () => setShowRegister(true)
          }
        ),
        showRegister && !profile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileForm,
          {
            onSubmit: handleRegister,
            onCancel: () => setShowRegister(false),
            loading: registering
          }
        ),
        isActiveMember && membership ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          MembershipBadge,
          {
            plan: membership.plan,
            endDate: membership.endDate
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-5",
            "data-ocid": "account.membership_upsell",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No Active Membership" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 leading-relaxed", children: "Unlock unlimited rentals with an Elite membership plan." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/membership", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "w-full bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/90",
                  "data-ocid": "account.upgrade_membership_button",
                  children: [
                    "Explore Membership",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 ml-1" })
                  ]
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReferralSection, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-6 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("bookings"),
              className: `px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${activeTab === "bookings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              "data-ocid": "account.bookings_tab",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 inline-block mr-1.5 -mt-0.5" }),
                "Bookings"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("favorites"),
              className: `px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${activeTab === "favorites" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              "data-ocid": "account.favorites_tab_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 inline-block mr-1.5 -mt-0.5" }),
                "Favorites"
              ]
            }
          )
        ] }),
        activeTab === "bookings" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-5 h-5 text-primary" }),
            "My Bookings"
          ] }),
          bookingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-3",
              "data-ocid": "account.bookings_loading_state",
              children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-lg" }, i))
            }
          ) : bookings && bookings.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "account.bookings_list", children: bookings.map((booking, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            BookingCard,
            {
              booking,
              index: i,
              onCancel: handleCancel
            },
            booking.id.toString()
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-16 bg-card border border-border rounded-lg",
              "data-ocid": "account.bookings_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-primary/30 mx-auto mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-2", children: "No Bookings Yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Your rental history will appear here after your first booking." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cars", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/10",
                    "data-ocid": "account.browse_fleet_button",
                    children: "Browse Fleet"
                  }
                ) })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FavoritesTab, {})
      ] })
    ] }) })
  ] });
}
export {
  AccountPage
};
