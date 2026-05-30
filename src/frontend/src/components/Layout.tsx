import { AIChatWidget } from "@/components/AIChatWidget";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetCeoProfile, useIsAdmin } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, Instagram, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Fleet", href: "/cars" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "Booking", href: "/checkout" },
  { label: "Account", href: "/account" },
];

const PAYMENT_METHODS = [
  { label: "Apple Pay", icon: "" },
  { label: "Visa", icon: "" },
  { label: "Mastercard", icon: "" },
  { label: "Crypto", icon: "" },
  { label: "Amex", icon: "" },
];

function FooterCeoCard() {
  const { data: ceo } = useGetCeoProfile();

  function extractHandle(raw: string | undefined): string {
    if (!raw) return "_stannoodles";
    if (raw.startsWith("https://")) {
      try {
        const url = new URL(raw);
        const path = url.pathname.replace(/^\/+/, "");
        const h = path.split("/")[0];
        return h || "_stannoodles";
      } catch {
        return "_stannoodles";
      }
    }
    return raw.replace(/^@/, "");
  }

  const handle = extractHandle(ceo?.instagramHandle);
  const displayHandle = `@${handle}`;
  const instagramUrl = `https://www.instagram.com/${handle}`;
  const photoUrl = ceo?.photoUrl || null;
  const name = ceo?.name || displayHandle;
  const title = ceo?.title || "CEO";

  return (
    <div>
      <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary mb-4">
        Leadership
      </h4>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
        data-ocid="footer.ceo_instagram_link"
      >
        <div className="w-12 h-12 rounded-full bg-secondary border-2 border-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0 transition-luxury group-hover:border-primary">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-display font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {displayHandle}
          </p>
          <p className="text-xs text-primary uppercase tracking-widest">
            {title}, OK RENTALS
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Instagram ↗</p>
        </div>
      </a>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading, principal, login, logout } = useAuth();
  const { data: isAdmin } = useIsAdmin(principal);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-luxury-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="header.logo_link"
            >
              <Crown className="w-5 h-5 text-primary transition-luxury group-hover:scale-110" />
              <span className="font-display text-lg font-bold tracking-widest">
                <span className="text-primary">OK</span>{" "}
                <span className="text-foreground">RENTALS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-body font-medium tracking-widest uppercase transition-luxury",
                    currentPath === link.href
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : "text-muted-foreground hover:text-primary",
                  )}
                  data-ocid={`header.nav_${link.label.toLowerCase()}_link`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={cn(
                    "text-sm font-body font-semibold tracking-widest uppercase transition-luxury flex items-center gap-1.5 px-3 py-1 rounded-md border",
                    currentPath === "/admin"
                      ? "text-primary-foreground bg-primary border-primary"
                      : "text-primary border-primary/40 hover:bg-primary/10",
                  )}
                  data-ocid="header.nav_admin_link"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Auth + CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-xs"
                  data-ocid="header.logout_button"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-xs"
                  data-ocid="header.login_button"
                >
                  {isLoading ? "Connecting..." : "Login / Register"}
                </Button>
              )}
              <Link to="/cars">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs font-semibold shadow-luxury-sm transition-luxury"
                  data-ocid="header.book_now_button"
                >
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-ocid="header.mobile_menu_toggle"
              type="button"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div
            className="md:hidden bg-card border-t border-border px-4 pb-4"
            data-ocid="header.mobile_menu"
          >
            <nav className="flex flex-col gap-4 pt-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm font-body font-medium tracking-widest uppercase transition-luxury",
                    currentPath === link.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                  data-ocid={`header.mobile_nav_${link.label.toLowerCase()}_link`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm font-body font-semibold tracking-widest uppercase transition-luxury text-primary flex items-center gap-1.5",
                    currentPath === "/admin"
                      ? "text-primary"
                      : "text-primary/70",
                  )}
                  data-ocid="header.mobile_nav_admin_link"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="justify-start uppercase tracking-widest text-xs"
                    data-ocid="header.mobile_logout_button"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="justify-start uppercase tracking-widest text-xs"
                    data-ocid="header.mobile_login_button"
                  >
                    Login / Register
                  </Button>
                )}
                <Link to="/cars" onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground uppercase tracking-widest text-xs"
                    data-ocid="header.mobile_book_button"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* AI Chat Widget */}
      <AIChatWidget />

      {/* Footer */}
      <footer
        className="bg-card border-t border-border mt-auto"
        data-ocid="footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-display text-lg font-bold tracking-widest">
                  <span className="text-primary">OK</span>{" "}
                  <span className="text-foreground">RENTALS</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium luxury vehicle rentals. Unmatched elegance, performance,
                and service.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-luxury"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CEO Card */}
            <FooterCeoCard />

            {/* Payment Methods */}
            <div>
              <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                Payment Methods
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {PAYMENT_METHODS.map((pm) => (
                  <span
                    key={pm.label}
                    className="px-3 py-1.5 text-xs font-medium bg-secondary border border-border rounded text-muted-foreground tracking-wide"
                  >
                    {pm.label}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  Booking Info
                </h4>
                <p className="text-xs text-muted-foreground">
                  Pickup & drop-off details communicated via email or phone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} OK RENTALS. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
