import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageSeo } from "../seo";
import { useSiteContent } from "../site-content";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo() {
  const { pathname } = useLocation();
  const { site } = useSiteContent();

  useEffect(() => {
    const seo = pageSeo(pathname, site.profile);
    document.title = seo.title;
    setMeta("name", "description", seo.description);
    setMeta("name", "robots", seo.robots);
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", seo.url);
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = seo.url;
  }, [pathname, site]);

  return null;
}
