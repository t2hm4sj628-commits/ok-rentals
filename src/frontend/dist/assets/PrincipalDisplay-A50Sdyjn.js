import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports } from "./index-irnVJvcV.js";
import { C as Copy } from "./shield-check-D7D7k1Zv.js";
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
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
function PrincipalDisplay({
  principal,
  className = ""
}) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    var _a;
    if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
      navigator.clipboard.writeText(principal).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      }).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  }
  function fallbackCopy() {
    const textarea = document.createElement("textarea");
    textarea.value = principal;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
    document.body.removeChild(textarea);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-2 min-w-0 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "font-mono text-xs text-muted-foreground break-all select-all cursor-text leading-relaxed flex-1 min-w-0",
        title: principal,
        children: principal
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleCopy,
        "aria-label": copied ? "Copied!" : "Copy principal ID",
        className: "shrink-0 mt-0.5 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "data-ocid": "principal.copy_button",
        children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
      }
    )
  ] });
}
export {
  Check as C,
  PrincipalDisplay as P,
  Camera as a
};
