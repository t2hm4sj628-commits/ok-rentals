import { useAnalyticsSettings } from "@/hooks/useBackend";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track?: (...args: unknown[]) => void;
      load?: (id: string) => void;
      page?: () => void;
    };
    dataLayer?: unknown[];
  }
}

function injectScript(id: string, src: string, inline?: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  if (src) {
    script.async = true;
    script.src = src;
  }
  if (inline) {
    script.textContent = inline;
  }
  document.head.appendChild(script);
}

export function AnalyticsPixels() {
  const { data: settings } = useAnalyticsSettings();
  const injectedRef = useRef<Set<string>>(new Set());

  const ga4Id = settings?.ga4Id || import.meta.env.VITE_GA4_ID || "";
  const metaPixelId =
    settings?.metaPixelId || import.meta.env.VITE_META_PIXEL_ID || "";
  const tiktokPixelId =
    settings?.tiktokPixelId || import.meta.env.VITE_TIKTOK_PIXEL_ID || "";

  useEffect(() => {
    if (ga4Id && !injectedRef.current.has("ga4")) {
      injectScript(
        "gtag-js",
        `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`,
      );
      injectScript(
        "gtag-init",
        "",
        `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `,
      );
      injectedRef.current.add("ga4");
    }

    if (metaPixelId && !injectedRef.current.has("meta")) {
      injectScript(
        "meta-pixel",
        "",
        `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');
        `,
      );
      injectedRef.current.add("meta");
    }

    if (tiktokPixelId && !injectedRef.current.has("tiktok")) {
      injectScript(
        "tiktok-pixel",
        "",
        `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){var e=ttq._i[t]||[];for(var n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${tiktokPixelId}');
            ttq.page();
          }(window, document, 'ttq');
        `,
      );
      injectedRef.current.add("tiktok");
    }
  }, [ga4Id, metaPixelId, tiktokPixelId]);

  return null;
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  if (window.fbq) {
    window.fbq("track", eventName, params);
  }
  if (window.ttq?.track) {
    window.ttq.track(eventName, params);
  }
}
