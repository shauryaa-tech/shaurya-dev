import { Link } from "react-router-dom";
import { ArrowRight, Download, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { Reveal, KineticLine } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

export default function Footer() {
  const { site } = useSiteContent();
  const profile = site.profile;
  const footer = site.footer;
  const socials = [
    { icon: Github, href: profile.github, label: "GitHub", testid: "footer-github" },
    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn", testid: "footer-linkedin" },
    { icon: Mail, href: `mailto:${profile.email}`, label: profile.email, testid: "footer-email" },
    { icon: Phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, label: profile.phone, testid: "footer-phone" },
    { icon: MapPin, href: null, label: profile.location, testid: "footer-location" },
  ];
  return (
    <footer className="relative pt-24 md:pt-36 pb-10 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-viol/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon mb-6">
            {footer.index} // {footer.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-white leading-[1.05] tracking-tight text-[clamp(2.1rem,8vw,3.75rem)]">
            <KineticLine delay={0.05}>{footer.title}</KineticLine>
            <KineticLine delay={0.18}>
              <span className="grad-text">{footer.accent}</span>
            </KineticLine>
          </h2>
          <Reveal delay={0.3}>
            <p className="text-slate-400 mt-6 leading-relaxed">
              {footer.blurb}
            </p>
          </Reveal>
          <Reveal delay={0.4} className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              data-testid="footer-contact-cta"
              className="inline-flex items-center gap-2.5 rounded-full bg-neon px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 t-fast"
            >
              {footer.cta} <ArrowRight size={15} />
            </Link>
            <a
              href={profile.resume}
              download="Shaurya_Pratap_Singh_Resume.pdf"
              data-testid="footer-resume-btn"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-slate-200 hover:border-neon/60 hover:text-neon t-fast"
            >
              <Download size={15} /> {footer.resume}
            </a>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-20">
          {socials.map((s) => {
            const Icon = s.icon;
            const inner = (
              <>
                <Icon size={18} className="text-neon shrink-0" />
                <span className="text-slate-300 text-sm truncate">{s.label}</span>
              </>
            );
            return s.href ? (
              <a
                key={s.testid}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-testid={s.testid}
                className="glass rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-neon/40 hover:-translate-y-1 t-fast"
              >
                {inner}
              </a>
            ) : (
              <div key={s.testid} data-testid={s.testid} className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-slate-500 tracking-wide">
            © {new Date().getFullYear()} {profile.name} — All rights reserved.
          </p>
          <Link
            to="/login"
            data-testid="footer-admin-link"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-neon t-fast"
          >
            Admin
          </Link>
          <p className="font-mono text-[11px] text-slate-500 tracking-wide">
            {footer.credit} <span className="text-neon">{footer.wordA}</span> &{" "}
            <span className="text-viol">{footer.wordB}</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
