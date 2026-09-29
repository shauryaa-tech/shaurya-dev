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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 t-fast ${
        scrolled || open ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <Link
          to="/"
          data-testid="nav-logo-link"
          className="flex items-center gap-3 group"
        >
          <span className="t-fast group-hover:rotate-[8deg]">
            <Logo />
          </span>
          <span className="font-display font-bold text-white text-sm tracking-wide hidden sm:block">
            {profile.brand}<span className="text-neon">{profile.brandAccent}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-neon t-fast"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.resume}
            download="Shaurya_Pratap_Singh_Resume.pdf"
            data-testid="nav-resume-btn"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-200 hover:border-neon/60 hover:text-neon t-fast"
          >
            <Download size={14} /> {nav.resumeLabel}
          </a>
          <Link
            to="/contact"
            data-testid="nav-contact-cta"
            className="inline-flex items-center rounded-full bg-neon px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] t-fast"
          >
            {nav.talkLabel}
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/10 px-5 py-4 flex flex-col gap-4" data-testid="nav-mobile-panel">
          {nav.links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-mobile-link-${l.id}`}
              onClick={() => go(l.id)}
              className="font-mono text-sm uppercase tracking-[0.2em] text-slate-200 hover:text-neon t-fast text-left"
            >
              {l.label}
            </button>
          ))}
          <a
            href={profile.resume}
            download="Shaurya_Pratap_Singh_Resume.pdf"
            data-testid="nav-mobile-resume-btn"
            className="font-mono text-sm uppercase tracking-[0.2em] text-neon flex items-center gap-2"
          >
            <Download size={16} /> {nav.mobileResume}
          </a>
        </div>
      )}
    </header>
  );
}
