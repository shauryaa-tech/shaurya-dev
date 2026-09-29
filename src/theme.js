const STEPS = [5, 8, 10, 12, 15, 25, 35, 40, 45, 50, 60];

export function applyTheme(theme) {
  if (!theme) return;
  const mode = theme.mode === "light" ? "light" : "dark";
  const cyan = theme.cyan || "#00f0ff";
  const violet = theme.violet || "#a855f7";
  const ink = theme.ink || "#030712";
  const panel = theme.panel || "#0b0f19";
  document.documentElement.dataset.mode = mode;
  let css = `
    :root { --cyan: ${cyan}; --violet: ${violet}; --ink: ${ink}; --panel: ${panel}; }
    body { background: ${ink} !important; }
    .text-neon, .hover\\:text-neon:hover, .group:hover .group-hover\\:text-neon { color: ${cyan} !important; }
    .bg-neon, .hover\\:bg-neon:hover, .group:hover .group-hover\\:bg-neon { background-color: ${cyan} !important; }
    .text-viol, .group:hover .group-hover\\:text-viol { color: ${violet} !important; }
    .text-ink, .group:hover .group-hover\\:text-ink { color: ${ink} !important; }
    .bg-panel { background-color: ${panel} !important; }
    .grad-text {
      background: linear-gradient(92deg, ${cyan} 10%, ${violet} 90%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      color: transparent !important;
    }
    .text-stroke { -webkit-text-stroke: 1.5px ${cyan} !important; color: transparent !important; }
    ::selection { background: ${cyan}; color: ${ink}; }
    .from-neon { --tw-gradient-from: ${cyan} !important; }
    .to-viol { --tw-gradient-to: ${violet} !important; }
    .bg-gradient-to-r.from-neon.to-viol { background-image: linear-gradient(to right, ${cyan}, ${violet}) !important; }
    .from-ink { --tw-gradient-from: ${ink} !important; }
  `;
  for (const step of STEPS) {
    css += `.bg-neon\\/${step}, .hover\\:bg-neon\\/${step}:hover { background-color: color-mix(in srgb, ${cyan} ${step}%, transparent) !important; }`;
    css += `.bg-viol\\/${step}, .hover\\:bg-viol\\/${step}:hover { background-color: color-mix(in srgb, ${violet} ${step}%, transparent) !important; }`;
    css += `.border-neon\\/${step}, .hover\\:border-neon\\/${step}:hover { border-color: color-mix(in srgb, ${cyan} ${step}%, transparent) !important; }`;
    css += `.border-viol\\/${step}, .hover\\:border-viol\\/${step}:hover { border-color: color-mix(in srgb, ${violet} ${step}%, transparent) !important; }`;
    css += `.bg-ink\\/${step} { background-color: color-mix(in srgb, ${ink} ${step}%, transparent) !important; }`;
    css += `.bg-panel\\/${step} { background-color: color-mix(in srgb, ${panel} ${step}%, transparent) !important; }`;
    css += `.group:hover .group-hover\\:bg-viol\\/${step} { background-color: color-mix(in srgb, ${violet} ${step}%, transparent) !important; }`;
    css += `.group:hover .group-hover\\:border-viol\\/${step} { border-color: color-mix(in srgb, ${violet} ${step}%, transparent) !important; }`;
    css += `.group:hover .group-hover\\:text-neon\\/${step} { color: color-mix(in srgb, ${cyan} ${step}%, transparent) !important; }`;
  }
  if (mode === "light") css += lightModeCss();
  let node = document.getElementById("site-theme");
  if (!node) {
    node = document.createElement("style");
    node.id = "site-theme";
    document.head.appendChild(node);
  }
  node.textContent = css;
}

function lightModeCss() {
  return `
    html[data-mode="light"] body { background: #f4f7fb !important; color: #334155 !important; }
    html[data-mode="light"] .text-white { color: #0f172a !important; }
    html[data-mode="light"] .text-slate-200 { color: #1e293b !important; }
    html[data-mode="light"] .text-slate-300,
    html[data-mode="light"] .hover\\:text-slate-300:hover { color: #334155 !important; }
    html[data-mode="light"] .text-slate-400,
    html[data-mode="light"] .hover\\:text-slate-400:hover { color: #475569 !important; }
    html[data-mode="light"] .text-slate-500 { color: #64748b !important; }
    html[data-mode="light"] .text-slate-600 { color: #334155 !important; }
    html[data-mode="light"] .glass {
      background: rgba(255, 255, 255, 0.78) !important;
      border-color: rgba(15, 23, 42, 0.08) !important;
    }
    html[data-mode="light"] .bg-panel,
    html[data-mode="light"] .bg-panel\\/40,
    html[data-mode="light"] .bg-panel\\/80 { background-color: #ffffff !important; }
    html[data-mode="light"] .bg-ink\\/40,
    html[data-mode="light"] .bg-ink\\/70 { background-color: rgba(255, 255, 255, 0.9) !important; }
    html[data-mode="light"] .from-ink { --tw-gradient-from: #f4f7fb !important; }
    html[data-mode="light"] .border-white\\/5,
    html[data-mode="light"] .border-white\\/10,
    html[data-mode="light"] .border-white\\/15,
    html[data-mode="light"] .border-white\\/20,
    html[data-mode="light"] .hover\\:border-white\\/25:hover { border-color: rgba(15, 23, 42, 0.12) !important; }
    html[data-mode="light"] .bg-white\\/5,
    html[data-mode="light"] .bg-white\\/10 { background-color: rgba(15, 23, 42, 0.04) !important; }
    html[data-mode="light"] input,
    html[data-mode="light"] textarea,
    html[data-mode="light"] select { color: #0f172a; }
    html[data-mode="light"] .adm-title,
    html[data-mode="light"] .adm-item h3,
    html[data-mode="light"] .adm-stat strong { color: #0f172a !important; }
    html[data-mode="light"] .adm-check { color: #334155 !important; }
    html[data-mode="light"] .adm-table th,
    html[data-mode="light"] .adm-table td { border-bottom-color: rgba(15, 23, 42, 0.08); }
    html[data-mode="light"] .placeholder\\:text-slate-600::placeholder { color: #64748b !important; }
    html[data-mode="light"] .adm-sub,
    html[data-mode="light"] .adm-meta,
    html[data-mode="light"] .adm-color,
    html[data-mode="light"] .adm-table td { color: #334155 !important; }
    html[data-mode="light"] .adm-field input,
    html[data-mode="light"] .adm-field textarea,
    html[data-mode="light"] .adm-field select,
    html[data-mode="light"] .adm-color input:not([type="color"]) {
      background: #fff !important;
      color: #0f172a !important;
      border-color: rgba(15, 23, 42, 0.12) !important;
    }
    html[data-mode="light"] .adm-tab:not(.active),
    html[data-mode="light"] .adm-btn-ghost {
      color: #0f172a;
      border-color: rgba(15, 23, 42, 0.16);
    }
    html[data-mode="light"] ::-webkit-scrollbar-track { background: #f4f7fb; }
  `;
}
