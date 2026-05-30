import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface PrincipalDisplayProps {
  principal: string;
  className?: string;
}

/**
 * Renders a full, selectable, copyable principal ID.
 * Works on iOS Safari via textarea fallback.
 */
export function PrincipalDisplay({
  principal,
  className = "",
}: PrincipalDisplayProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    // Primary: navigator.clipboard (modern browsers)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(principal)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    // Fallback: textarea trick for iOS Safari
    const textarea = document.createElement("textarea");
    textarea.value = principal;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    // iOS needs setSelectionRange after focus
    textarea.setSelectionRange(0, textarea.value.length);
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail — user can still manually select
    }
    document.body.removeChild(textarea);
  }

  return (
    <div className={`flex items-start gap-2 min-w-0 ${className}`}>
      {/* The text itself — full, break-all, user-selectable */}
      <p
        className="font-mono text-xs text-muted-foreground break-all select-all cursor-text leading-relaxed flex-1 min-w-0"
        title={principal}
      >
        {principal}
      </p>
      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : "Copy principal ID"}
        className="shrink-0 mt-0.5 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        data-ocid="principal.copy_button"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
