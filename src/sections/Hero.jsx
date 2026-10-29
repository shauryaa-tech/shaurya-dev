import { Download, ArrowDown } from "lucide-react";
import { KineticLine, Reveal } from "../components/Kinetic";
import { scrollToId } from "../components/Nav";
import { useSiteContent } from "../site-content";

export default function Hero() {
  const { site } = useSiteContent();
  const hero = site.hero;
  const profile = site.profile;

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            site.theme.mode === "light"
              ? "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)"
              : "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="absolute -top-24 -left-24 w-[440px] h-[440px] rounded-full bg-neon/15 blur-[130px]" />
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-viol/15 blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full py-16 lg:py-0">
        <div className="max-w-3xl">
          <Reveal y={12}>
            <div
              data-testid="hero-status-badge"
              className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-300">
                {hero.badge}
              </span>
            </div>
          </Reveal>

          <h1 className="font-display font-extrabold text-white leading-[0.95] tracking-tight text-[clamp(2.55rem,10.5vw,5.4rem)]">
            <span className="block font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400 mb-4">
              {profile.name} · {profile.location}
            </span>
            <KineticLine delay={0.12}>{hero.line1}</KineticLine>
            <KineticLine delay={0.24}>
              <span className="text-stroke">{hero.line2}</span>
            </KineticLine>
            <KineticLine delay={0.36}>
              {hero.line3} <span className="grad-text">{hero.accent}</span>
            </KineticLine>
          </h1>

          <Reveal delay={0.55} className="mt-7 max-w-xl">
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              {hero.bio}
            </p>
          </Reveal>

          <Reveal delay={0.68} className="hero-actions mt-9 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-explore-btn"
              onClick={() => scrollToId("projects")}
              className="inline-flex items-center gap-2.5 rounded-full bg-neon px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 t-fast"
            >
              {hero.explore} <ArrowDown size={15} />
            </button>
            <a
              href={site.profile.resume}
              download="Shaurya_Pratap_Singh_Resume.pdf"
              data-testid="hero-resume-btn"
              className="inline-flex items-center gap-2.5 rounded-full border border-viol/50 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-viol hover:bg-viol/10 hover:shadow-[0_0_28px_rgba(168,85,247,0.35)] t-fast"
            >
              <Download size={15} /> {hero.resume}
            </a>
          </Reveal>

          <Reveal delay={0.8} className="hero-metrics mt-12 grid grid-cols-3 gap-3 max-w-xl">
            {site.metrics.map((m) => (
              <div
                key={m.label}
                data-testid={`hero-metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="glass rounded-2xl px-4 py-4 hover:border-neon/40 t-fast"
              >
                <p className="font-display font-bold text-2xl md:text-3xl text-white">
                  {m.value}
                  <span className="text-neon text-sm ml-1 font-body font-medium">{m.label}</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-1">
                  {m.sub}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{hero.scroll}</span>
        <span className="w-px h-10 bg-gradient-to-b from-neon to-transparent scroll-line" />
      </div>
    </section>
  );
}
