import { useSiteContent } from "../site-content";

const LINES = [
  { tone: "cmd", text: "$ shaurya.init --stack ai" },
  { tone: "ok", text: "✓ rag pipeline ready" },
  { tone: "out", text: "model: gpt · gemini · local" },
  { tone: "ok", text: "✓ production deploy live" },
];

export default function HeroShowcase() {
  const { site } = useSiteContent();
  const profile = site.profile;
  const initial = (profile.firstName || profile.name || "S").trim().charAt(0).toUpperCase();

  return (
    <div className="hero-showcase relative z-0 w-full h-full flex items-center justify-center p-6 sm:p-10" data-testid="hero-showcase">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,240,255,0.12),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.14),transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[380px]">
        <div className="hero-showcase-orb absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-neon/20 blur-3xl" />
        <div className="relative mx-auto mb-7 flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-[2rem] border border-neon/30 bg-ink/80 shadow-[0_0_50px_rgba(0,240,255,0.22)]">
          <span className="font-display font-extrabold text-[4.5rem] sm:text-[5.5rem] leading-none grad-text select-none">{initial}</span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-viol/40 bg-viol/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-viol whitespace-nowrap">
            {profile.role?.split("&")[0]?.trim() || "AI/ML"}
          </span>
        </div>

        <div className="glass rounded-2xl overflow-hidden border-neon/20">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">ai.runtime</span>
          </div>
          <div className="p-4 font-mono text-[12px] sm:text-[13px] leading-7">
            {LINES.map((line) => (
              <p
                key={line.text}
                className={
                  line.tone === "cmd"
                    ? "text-neon"
                    : line.tone === "ok"
                      ? "text-emerald-400"
                      : "text-slate-400"
                }
              >
                {line.text}
              </p>
            ))}
            <p className="text-neon hero-showcase-cursor">█</p>
          </div>
        </div>
      </div>
    </div>
  );
}
