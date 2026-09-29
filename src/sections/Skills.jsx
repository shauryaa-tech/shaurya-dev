import { Brain, Braces, Code2, Database, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

const ICONS = { Brain, Braces, Code2, Database, Wrench };

export default function Skills() {
  const { site } = useSiteContent();
  const skills = site.skills;
  return (
    <section id="skills" className="relative py-24 md:py-36 bg-panel/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={skills.index} eyebrow={skills.eyebrow} title={skills.title} accent={skills.accent} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.groups.map((g, gi) => {
            const Icon = ICONS[g.icon] || Brain;
            return (
              <Reveal key={g.title} delay={0.08 * gi} className={gi === 0 ? "md:col-span-2 lg:col-span-1" : ""}>
                <div
                  data-testid={`skills-card-${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="glass rounded-3xl p-6 md:p-7 h-full hover:border-neon/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.08)] t-fast group"
                >
                  <div className="flex items-center gap-3.5 mb-6">
                    <span className="w-11 h-11 rounded-xl bg-neon/10 border border-neon/25 flex items-center justify-center text-neon group-hover:bg-viol/10 group-hover:border-viol/40 group-hover:text-viol t-fast">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display font-bold text-white text-lg">{g.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {g.skills.map((s, si) => (
                      <div key={s.name} data-testid={`skill-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-slate-300 text-sm">{s.name}</span>
                          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                            {s.level >= 5 ? "Core" : s.level >= 4 ? "Advanced" : "Working"}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-neon to-viol"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(s.level / 5) * 100}%` }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.9, delay: 0.1 + si * 0.06, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
