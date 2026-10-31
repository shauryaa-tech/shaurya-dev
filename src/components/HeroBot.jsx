export default function HeroBot() {
  return (
    <div className="hero-bot" data-testid="hero-bot" aria-hidden>
      <div className="hero-bot__glow" />
      <div className="hero-bot__ring hero-bot__ring--a" />
      <div className="hero-bot__ring hero-bot__ring--b" />
      <div className="hero-bot__ring hero-bot__ring--c" />

      <span className="hero-bot__node hero-bot__node--1" />
      <span className="hero-bot__node hero-bot__node--2" />
      <span className="hero-bot__node hero-bot__node--3" />
      <span className="hero-bot__node hero-bot__node--4" />
      <span className="hero-bot__beam hero-bot__beam--1" />
      <span className="hero-bot__beam hero-bot__beam--2" />

      <svg className="hero-bot__art" viewBox="0 0 320 380" fill="none">
        <defs>
          <linearGradient id="hbShell" x1="60" y1="20" x2="260" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f7fdff" />
            <stop offset="0.45" stopColor="#cfeaf6" />
            <stop offset="1" stopColor="#7eb8d4" />
          </linearGradient>
          <linearGradient id="hbBlue" x1="110" y1="220" x2="210" y2="350" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6ef5ff" />
            <stop offset="1" stopColor="#2a7dff" />
          </linearGradient>
          <radialGradient id="hbEye" cx="35%" cy="32%" r="68%">
            <stop stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#8af8ff" />
            <stop offset="1" stopColor="#009dff" />
          </radialGradient>
          <filter id="hbSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#00d5ff" floodOpacity="0.35" />
          </filter>
        </defs>

        <ellipse className="hero-bot__shadow" cx="160" cy="358" rx="78" ry="12" fill="#00d4ff" opacity="0.22" />

        <g filter="url(#hbSoft)">
          <circle cx="58" cy="132" r="28" fill="url(#hbShell)" stroke="#7adfff" strokeWidth="3" />
          <circle className="hero-bot__ear" cx="58" cy="132" r="12" fill="#00c8ff" />
          <circle cx="262" cy="132" r="28" fill="url(#hbShell)" stroke="#7adfff" strokeWidth="3" />
          <circle className="hero-bot__ear" cx="262" cy="132" r="12" fill="#00c8ff" />

          <circle cx="160" cy="128" r="92" fill="url(#hbShell)" />
          <path d="M108 58c18-14 86-14 104 0" stroke="#57d7ff" strokeWidth="10" strokeLinecap="round" />

          <rect x="96" y="88" width="128" height="84" rx="42" fill="#060d18" />

          <g className="hero-bot__eyes">
            <g className="hero-bot__eye">
              <ellipse cx="128" cy="124" rx="18" ry="20" fill="url(#hbEye)" />
              <circle className="hero-bot__pupil" cx="132" cy="126" r="6" fill="#041018" />
            </g>
            <g className="hero-bot__eye">
              <ellipse cx="192" cy="124" rx="18" ry="20" fill="url(#hbEye)" />
              <circle className="hero-bot__pupil" cx="196" cy="126" r="6" fill="#041018" />
            </g>
          </g>

          <path
            className="hero-bot__mouth"
            d="M132 152 C144 166, 176 166, 188 152"
            fill="none"
            stroke="#5ef8ff"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M132 152 C144 166, 176 166, 188 152;
                M132 152 C144 166, 176 166, 188 152;
                M132 156 C146 156, 174 156, 188 156;
                M132 160 C144 146, 176 146, 188 160;
                M132 160 C144 146, 176 146, 188 160;
                M132 156 C146 156, 174 156, 188 156;
                M132 152 C144 166, 176 166, 188 152
              "
            />
          </path>

          <path
            d="M112 220c0-10 18-18 48-18s48 8 48 18v42c0 22-20 36-48 36s-48-14-48-36V220z"
            fill="url(#hbBlue)"
          />
          <path d="M120 258c8 28 72 28 80 0v28c-8 18-28 28-40 28s-32-10-40-28v-28z" fill="#eef8fc" />
          <circle cx="160" cy="246" r="11" fill="#062033" stroke="#9af8ff" strokeWidth="3" />

          <path d="M100 242c-16 8-24 20-20 32" stroke="#e7f8ff" strokeWidth="14" strokeLinecap="round" />
          <path d="M220 242c16 8 24 20 20 32" stroke="#e7f8ff" strokeWidth="14" strokeLinecap="round" />
        </g>
      </svg>

      <div className="hero-bot__caption">
        <span className="hero-bot__caption-dot" />
        AI companion · live
      </div>
    </div>
  );
}
