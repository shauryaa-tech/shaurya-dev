import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useSiteContent } from "../site-content";

export const scrollToId = (id, navigate) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
  if (navigate) navigate("/");
};

export default function Nav() {
  const { site } = useSiteContent();
  const profile = site.profile;
  const nav = site.nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (pathname !== "/") {
      setActive("");
      return;
    }
    const ids = nav.links.map((l) => l.id);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname, nav.links]);

  const go = (id) => {
    setOpen(false);
    setActive(id);
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      scrollToId(id);
    }
  };

  const linkClass = (id, mobile = false) =>
    `${mobile ? "font-mono text-sm text-left w-full py-3" : "font-mono text-xs"} uppercase tracking-[0.2em] t-fast ${
      active === id ? "text-neon" : mobile ? "text-slate-200 hover:text-neon" : "text-slate-400 hover:text-neon"
    }`;

  return (
    <header
      className={`site-header fixed top-0 inset-x-0 z-50 t-fast ${
        scrolled || open ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
    >
      <div className="nav-row max-w-7xl mx-auto px-5 md:px-8 h-[64px] md:h-[72px] flex items-center justify-between">
        <Link
          to="/"
          data-testid="nav-logo-link"
          className="flex items-center gap-3 group min-w-0"
          onClick={() => setOpen(false)}
        >
          <span className="t-fast group-hover:rotate-[8deg] shrink-0">
            <Logo />
          </span>
          <span className="font-display font-bold text-white text-sm tracking-wide hidden sm:block truncate">
            {profile.brand}<span className="text-neon">{profile.brandAccent}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              aria-current={active === l.id ? "true" : undefined}
              className={linkClass(l.id)}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={profile.resume}
            download="Shaurya_Pratap_Singh_Resume.pdf"
            data-testid="nav-resume-btn"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-200 hover:border-neon/60 hover:text-neon t-fast"
          >
            <Download size={14} /> {nav.resumeLabel}
          </a>
          <Link
            to="/contact"
            data-testid="nav-contact-cta"
            className="hidden md:inline-flex items-center rounded-full bg-neon px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] t-fast"
          >
            {nav.talkLabel}
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden text-white p-2 -mr-1 rounded-xl border border-white/10 bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 max-h-[calc(100dvh-64px-env(safe-area-inset-top))] overflow-y-auto"
          data-testid="nav-mobile-panel"
        >
          <div className="flex flex-col">
            {nav.links.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-mobile-link-${l.id}`}
                onClick={() => go(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={linkClass(l.id, true)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={profile.resume}
              download="Shaurya_Pratap_Singh_Resume.pdf"
              data-testid="nav-mobile-resume-btn"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-slate-200"
              onClick={() => setOpen(false)}
            >
              <Download size={16} /> {nav.mobileResume}
            </a>
            <Link
              to="/contact"
              data-testid="nav-mobile-contact-cta"
              className="inline-flex items-center justify-center rounded-full bg-neon px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink"
              onClick={() => setOpen(false)}
            >
              {nav.talkLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
