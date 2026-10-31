const TECH = [
  "Python",
  "React",
  "RAG",
  "LLM",
  "Node",
  "TensorFlow",
  "OpenAI",
  "FastAPI",
  "TypeScript",
  "Docker",
  "MongoDB",
  "LangChain",
];

const ORBITS = [
  { r: 38, dur: 28, reverse: false },
  { r: 52, dur: 40, reverse: true },
  { r: 66, dur: 52, reverse: false },
];

export default function HeroGalaxy() {
  return (
    <div className="hero-galaxy" data-testid="hero-galaxy" aria-hidden>
      <div className="hero-galaxy__nebula hero-galaxy__nebula--a" />
      <div className="hero-galaxy__nebula hero-galaxy__nebula--b" />
      <div className="hero-galaxy__nebula hero-galaxy__nebula--c" />

      <div className="hero-galaxy__stars">
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="hero-galaxy__star"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 12) * 0.35}s`,
              animationDuration: `${2.8 + (i % 5) * 0.45}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-galaxy__core">
        <span className="hero-galaxy__core-glow" />
        <span className="hero-galaxy__core-ring" />
        <span className="hero-galaxy__core-ring hero-galaxy__core-ring--slow" />
        <span className="hero-galaxy__core-pulse" />
        <div className="hero-galaxy__chip">
          <span className="hero-galaxy__chip-dot" />
          AI · SPACE
        </div>
      </div>

      {ORBITS.map((orbit, oi) => (
        <div
          key={orbit.r}
          className={`hero-galaxy__orbit ${orbit.reverse ? "is-reverse" : ""}`}
          style={{
            width: `${orbit.r}%`,
            height: `${orbit.r}%`,
            animationDuration: `${orbit.dur}s`,
          }}
        >
          <span className="hero-galaxy__sat" style={{ animationDelay: `${oi * 0.4}s` }} />
          <span className="hero-galaxy__sat hero-galaxy__sat--b" />
        </div>
      ))}

      <div className="hero-galaxy__techs">
        {TECH.map((label, i) => (
          <span
            key={label}
            className="hero-galaxy__tech"
            style={{
              animationDelay: `${i * 0.35}s`,
              ["--tx"]: `${((i * 47) % 70) - 35}%`,
              ["--ty"]: `${((i * 29) % 60) - 30}%`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <svg className="hero-galaxy__circuit" viewBox="0 0 400 400" fill="none">
        <path
          className="hero-galaxy__trace"
          d="M40 200 H110 L140 170 H190"
          stroke="url(#hgGrad)"
          strokeWidth="1.2"
        />
        <path
          className="hero-galaxy__trace"
          d="M360 210 H290 L260 240 H210"
          stroke="url(#hgGrad)"
          strokeWidth="1.2"
          style={{ animationDelay: "1.2s" }}
        />
        <path
          className="hero-galaxy__trace"
          d="M200 40 V95 L230 125 V160"
          stroke="url(#hgGrad)"
          strokeWidth="1.2"
          style={{ animationDelay: "0.6s" }}
        />
        <path
          className="hero-galaxy__trace"
          d="M200 360 V305 L170 275 V240"
          stroke="url(#hgGrad)"
          strokeWidth="1.2"
          style={{ animationDelay: "1.8s" }}
        />
        <defs>
          <linearGradient id="hgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#00f0ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
