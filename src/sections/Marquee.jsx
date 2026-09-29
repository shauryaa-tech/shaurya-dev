import { useSiteContent } from "../site-content";

export default function Marquee() {
  const { site } = useSiteContent();
  const items = site.marquee;
  return (
    <div
      className="marquee relative border-y border-white/10 bg-panel/80 py-6 overflow-hidden"
      data-testid="editorial-marquee"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center">
                <span className="font-display font-bold text-2xl md:text-4xl text-slate-600 hover:text-slate-300 t-fast px-6 md:px-10 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-neon text-lg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
    </div>
  );
}
