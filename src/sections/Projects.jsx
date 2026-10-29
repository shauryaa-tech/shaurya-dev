import { useEffect, useState } from "react";
import { Users, FileSearch, MessagesSquare, Mic, ArrowUpRight, Brain, Code2, Database, Eye, Info, X, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

const ICONS = { Users, FileSearch, MessagesSquare, Mic, Brain, Code2, Database };

export default function Projects() {
  const { site } = useSiteContent();
  const projects = site.projects;
  const heading = site.projectsSection;
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!info) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setInfo(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [info]);

  return (
    <section id="projects" className="relative py-24 md:py-36 bg-panel/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={heading.index} eyebrow={heading.eyebrow} title={heading.title} accent={heading.accent} />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => {
            const Icon = ICONS[p.icon] || Code2;
            return (
              <Reveal key={p.num} delay={0.07 * i}>
                <article
                  data-testid={`project-card-${p.num}`}
                  className="glass rounded-3xl p-7 md:p-8 h-full relative overflow-hidden group hover:border-neon/45 hover:-translate-y-1.5 hover:shadow-[0_16px_50px_rgba(0,240,255,0.12)] t-fast flex flex-col"
                >
                  <div className="absolute -top-10 -right-6 font-display font-extrabold text-[7rem] leading-none text-white/[0.04] group-hover:text-neon/10 t-fast select-none">
                    {p.num}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/25 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-ink t-fast">
                      <Icon size={21} />
                    </span>
                    {p.repo ? (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 hover:text-neon t-fast"
                      >
                        {p.repoLabel || "View Code"}
                        <ArrowUpRight size={18} />
                      </a>
                    ) : null}
                  </div>
                  <h3 className="font-display font-bold text-white text-xl md:text-2xl mt-6 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {(p.tags || []).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border border-viol/25 bg-viol/5 px-3 py-1 text-viol"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {p.preview ? (
                      <a
                        href={p.preview}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`project-preview-${p.num}`}
                        className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] t-fast"
                      >
                        <Eye size={14} /> Preview
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600">
                        <Eye size={14} /> Preview soon
                      </span>
                    )}
                    <button
                      type="button"
                      data-testid={`project-info-${p.num}`}
                      onClick={() => setInfo(p)}
                      className="inline-flex items-center gap-2 rounded-full border border-viol/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-viol hover:bg-viol/10 t-fast"
                    >
                      <Info size={14} /> Info
                    </button>
                  </div>
                </article>
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

      {info && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
          data-testid="project-info-modal"
          onClick={() => setInfo(null)}
        >
          <div
            className="glass w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-neon/20 p-6 md:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon mb-2">{info.num} · Project</p>
                <h3 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight">{info.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setInfo(null)}
                className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-300 hover:text-neon hover:border-neon/40 t-fast"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed mt-5 whitespace-pre-wrap">
              {info.summary || info.desc}
            </p>
            {(info.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {info.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border border-viol/25 bg-viol/5 px-3 py-1 text-viol"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {info.preview && (
                <a
                  href={info.preview}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink"
                >
                  <ExternalLink size={14} /> Open live preview
                </a>
              )}
              {info.repo && (
                <a
                  href={info.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-200"
                >
                  <ArrowUpRight size={14} /> {info.repoLabel || "View Code"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
