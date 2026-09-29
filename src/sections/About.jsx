import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

export default function About() {
  const { site } = useSiteContent();
  const about = site.about;
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={about.index} eyebrow={about.eyebrow} title={about.title} accent={about.accent} />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          <Reveal className="relative">
            <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-tr from-neon/15 to-viol/15 blur-3xl rounded-full" />
            <div className="relative glass rounded-[2rem] overflow-hidden">
              <img
                src="/about-character.png"
                alt="3D avatar of Shaurya waving with a glowing laptop"
                className="w-full object-cover"
                data-testid="about-character"
              />
              <div className="absolute bottom-5 left-5 glass rounded-2xl px-5 py-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">{about.eduLabel}</p>
                <p className="text-white font-semibold text-sm mt-1">
                  {about.eduTitle}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {about.eduMeta}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                {about.leadBefore}
                <span className="text-neon font-semibold">{about.leadCyan}</span>
                {about.leadMid}
                <span className="text-viol font-semibold">{about.leadViolet}</span>
                {about.leadAfter}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-slate-400 leading-relaxed mt-5">
                {about.body}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {about.cards.map((c, i) => (
                <Reveal key={c.num} delay={0.12 * i}>
                  <div
                    data-testid={`about-card-${c.num}`}
                    className="glass rounded-2xl p-5 h-full hover:border-neon/40 hover:-translate-y-1 t-fast group"
                  >
                    <p className="font-mono text-xs text-neon group-hover:text-viol t-fast">{c.num}</p>
                    <h3 className="font-display font-bold text-white mt-3 text-base leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mt-2.5">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15} className="mt-8">
              <div className="glass rounded-2xl overflow-hidden" data-testid="about-terminal">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-[11px] text-slate-500 ml-3">{about.terminalTitle}</span>
                </div>
                <div className="p-5 font-mono text-[13px] leading-7">
                  {about.terminal.map((l, i) => (
                    <Reveal key={i} delay={0.08 * i} y={8}>
                      <p
                        className={
                          l.tone === "cmd"
                            ? "text-white"
                            : l.tone === "ok"
                            ? "text-emerald-400"
                            : "text-neon"
                        }
                      >
                        {l.text}
                      </p>
                    </Reveal>
                  ))}
                  <p className="text-white">
                    $ <span className="inline-block w-2 h-4 bg-neon align-middle animate-pulse" />
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
