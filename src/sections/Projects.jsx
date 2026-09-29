import { Users, FileSearch, MessagesSquare, Mic, ArrowUpRight, Brain, Code2, Database } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

const ICONS = { Users, FileSearch, MessagesSquare, Mic, Brain, Code2, Database };

export default function Projects() {
  const { site } = useSiteContent();
  const projects = site.projects;
  const heading = site.projectsSection;
  return (
    <section id="projects" className="relative py-24 md:py-36 bg-panel/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={heading.index} eyebrow={heading.eyebrow} title={heading.title} accent={heading.accent} />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => {
            const Icon = ICONS[p.icon] || Code2;
            return (
              <Reveal key={p.num} delay={0.07 * i}>
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`project-card-${p.num}`}
                  className="glass rounded-3xl p-7 md:p-8 block h-full relative overflow-hidden group hover:border-neon/45 hover:-translate-y-1.5 hover:shadow-[0_16px_50px_rgba(0,240,255,0.12)] t-fast"
                >
                  <div className="absolute -top-10 -right-6 font-display font-extrabold text-[7rem] leading-none text-white/[0.04] group-hover:text-neon/10 t-fast select-none">
                    {p.num}
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/25 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-ink t-fast">
                      <Icon size={21} />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 group-hover:text-neon t-fast">
                        {p.repoLabel}
                      </span>
                      <ArrowUpRight
                        size={20}
                        className="text-slate-600 group-hover:text-neon group-hover:translate-x-0.5 group-hover:-translate-y-0.5 t-fast"
                      />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl md:text-2xl mt-6 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border border-viol/25 bg-viol/5 px-3 py-1 text-viol"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <a
            href={site.profile.github}
            target="_blank"
            rel="noreferrer"
            data-testid="projects-github-link"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-neon t-fast border-b border-white/15 hover:border-neon pb-1"
          >
            {heading.more}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
