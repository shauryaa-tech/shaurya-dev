import { ChevronRight, GraduationCap } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

export default function Experience() {
  const { site } = useSiteContent();
  const experience = site.experience;
  const journey = site.journey;
  return (
    <section id="journey" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={journey.index} eyebrow={journey.eyebrow} title={journey.title} accent={journey.accent} />

        <div className="relative pl-6 md:pl-10">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-neon via-viol/60 to-transparent" />

          <div className="space-y-10">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={0.06 * i}>
                <div className="relative" data-testid={`timeline-entry-${i + 1}`}>
                  <span
                    className={`absolute -left-6 md:-left-10 top-2 w-3 h-3 rounded-full -translate-x-[5.5px] ${
                      e.current
                        ? "bg-neon shadow-[0_0_16px_rgba(0,240,255,0.9)]"
                        : "bg-viol shadow-[0_0_14px_rgba(168,85,247,0.7)]"
                    }`}
                  />
                  <div className="glass rounded-3xl p-6 md:p-8 hover:border-neon/35 t-fast">
                    <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                      <div>
                        <h3 className="font-display font-bold text-white text-xl md:text-2xl">
                          {e.role}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          <span className="text-neon font-medium">{e.company}</span> · {e.place}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.15em] rounded-full px-4 py-1.5 border ${
                          e.current
                            ? "border-neon/40 text-neon bg-neon/5"
                            : "border-viol/40 text-viol bg-viol/5"
                        }`}
                      >
                        {e.period}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {e.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-2.5 text-slate-400 text-sm leading-relaxed">
                          <ChevronRight size={15} className="text-neon shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="mt-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-viol mb-6">
            {journey.educationLabel}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {site.education.map((ed, i) => (
              <div
                key={ed.title}
                data-testid={`education-card-${i + 1}`}
                className={`glass rounded-2xl p-6 t-fast hover:-translate-y-1 ${
                  ed.highlight
                    ? "border-neon/40 shadow-[0_0_32px_rgba(0,240,255,0.12)]"
                    : "hover:border-white/25"
                }`}
              >
                <GraduationCap size={20} className={ed.highlight ? "text-neon" : "text-viol"} />
                <h4 className="font-display font-bold text-white mt-3.5 leading-snug">{ed.title}</h4>
                <p className="text-slate-400 text-sm mt-1.5">{ed.org}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 mt-2.5">
                  {ed.meta}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
