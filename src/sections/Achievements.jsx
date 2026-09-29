import { Trophy, Medal, Award, BadgeCheck } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

const ICONS = { Trophy, Medal, Award, BadgeCheck };

export default function Achievements() {
  const { site } = useSiteContent();
  const heading = site.achievementsSection;
  return (
    <section id="achievements" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading index={heading.index} eyebrow={heading.eyebrow} title={heading.title} accent={heading.accent} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {site.achievements.map((a, i) => {
            const Icon = ICONS[a.icon] || Award;
            return (
              <Reveal key={a.title} delay={0.07 * i}>
                <div
                  data-testid={`achievement-card-${i + 1}`}
                  className={`glass rounded-3xl p-6 h-full hover:-translate-y-1.5 t-fast relative overflow-hidden ${
                    a.gold
                      ? "hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,0.15)]"
                      : "hover:border-viol/45"
                  }`}
                >
                  {a.gold && (
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-yellow-400/15 blur-2xl" />
                  )}
                  <span
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border t-fast ${
                      a.gold
                        ? "bg-yellow-400/10 border-yellow-400/40 text-yellow-300"
                        : "bg-neon/10 border-neon/25 text-neon"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <h3 className="font-display font-bold text-white mt-5 leading-snug">{a.title}</h3>
                  <p className="text-slate-400 text-sm mt-1.5">{a.org}</p>
                  <p
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] mt-3 ${
                      a.gold ? "text-yellow-300" : "text-viol"
                    }`}
                  >
                    {a.meta}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
