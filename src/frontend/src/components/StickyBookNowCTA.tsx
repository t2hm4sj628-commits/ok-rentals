import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cta_dismissed";

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const expiry = Number(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
  } catch {
    // ignore
  }
}

export function StickyBookNowCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(isDismissed());

  useEffect(() => {
    if (dismissed) return;

    const hero = document.querySelector("[data-ocid='home.hero_section']");
    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting);
        },
        { threshold: 0.1 },
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }

    // fallback: show after scrolling 600px
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed z-50 bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto"
      data-ocid="sticky_cta"
    >
      <div className="bg-card border border-primary/40 rounded-xl shadow-luxury p-4 flex items-center gap-3">
        <Link to="/cars" className="flex-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground uppercase tracking-widest">
            Reserve Today
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => {
            dismiss();
            setDismissed(true);
          }}
          aria-label="Dismiss"
          data-ocid="sticky_cta.dismiss_button"
          type="button"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </motion.div>
  );
}
