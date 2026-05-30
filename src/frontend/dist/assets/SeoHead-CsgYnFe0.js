import { r as reactExports } from "./index-irnVJvcV.js";
function SeoHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = "website",
  canonical,
  noIndex = false,
  jsonLd
}) {
  reactExports.useEffect(() => {
    if (title) {
      document.title = title;
    }
    function setMeta(name, content, property = false) {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (property) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    }
    if (description) setMeta("description", description);
    if (ogTitle) setMeta("og:title", ogTitle, true);
    if (ogDescription) setMeta("og:description", ogDescription, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    if (ogUrl) setMeta("og:url", ogUrl, true);
    if (ogType) setMeta("og:type", ogType, true);
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");
    if (canonical) {
      let link = document.querySelector(
        'link[rel="canonical"]'
      );
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
    if (jsonLd) {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      for (const s of scripts) {
        s.remove();
      }
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    canonical,
    noIndex,
    jsonLd
  ]);
  return null;
}
export {
  SeoHead as S
};
