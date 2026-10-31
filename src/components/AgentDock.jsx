import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, X } from "lucide-react";
import { AGENT_PROMPTS, askPortfolioAgent } from "../lib/portfolioAgent";
import { useSiteContent } from "../site-content";

function EvaMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="evaMarkG" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7af6ff" />
          <stop offset="1" stopColor="#3a8bff" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="14" fill="url(#evaMarkG)" opacity="0.18" />
      <path d="M16 15h16v3.2H19.6V22H30v3H19.6v5.2H32.2V33H16V15z" fill="#9af8ff" />
      <circle cx="36" cy="12" r="3" fill="#5ef8ff" opacity="0.9" />
    </svg>
  );
}

function EvaLauncherIcon() {
  return (
    <svg className="eva-launcher__art" viewBox="0 0 96 96" width="68" height="68" aria-hidden>
      <defs>
        <linearGradient id="evaBotShell" x1="18" y1="10" x2="78" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4fbff" />
          <stop offset="0.45" stopColor="#d7eef8" />
          <stop offset="1" stopColor="#8ec8e0" />
        </linearGradient>
        <linearGradient id="evaBotBlue" x1="28" y1="48" x2="68" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5ef0ff" />
          <stop offset="1" stopColor="#1e8fff" />
        </linearGradient>
        <radialGradient id="evaBotEye" cx="35%" cy="35%" r="65%">
          <stop stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#7af8ff" />
          <stop offset="1" stopColor="#00a8ff" />
        </radialGradient>
        <filter id="evaBotGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#00d9ff" floodOpacity="0.5" />
        </filter>
      </defs>

      <ellipse className="eva-bot__shadow" cx="48" cy="88" rx="20" ry="4" fill="#00d4ff" opacity="0.28" />

      <g filter="url(#evaBotGlow)">
        {/* ears */}
        <circle cx="18" cy="40" r="9" fill="url(#evaBotShell)" stroke="#7adfff" strokeWidth="1.5" />
        <circle cx="18" cy="40" r="4.2" fill="#00c8ff" className="eva-bot__ear-light" />
        <circle cx="78" cy="40" r="9" fill="url(#evaBotShell)" stroke="#7adfff" strokeWidth="1.5" />
        <circle cx="78" cy="40" r="4.2" fill="#00c8ff" className="eva-bot__ear-light" />

        {/* head */}
        <circle cx="48" cy="40" r="26" fill="url(#evaBotShell)" />
        <path d="M34 18c4-3 24-3 28 0" stroke="#5ad8ff" strokeWidth="3.5" strokeLinecap="round" />

        {/* visor */}
        <rect x="30" y="28" width="36" height="24" rx="12" fill="#071018" />

        {/* eyes — glance + blink */}
        <g className="eva-bot__eyes">
          <g className="eva-bot__eye">
            <ellipse cx="39" cy="38" rx="5.2" ry="5.8" fill="url(#evaBotEye)" />
            <circle className="eva-bot__pupil" cx="40" cy="38.5" r="1.7" fill="#041018" />
          </g>
          <g className="eva-bot__eye">
            <ellipse cx="57" cy="38" rx="5.2" ry="5.8" fill="url(#evaBotEye)" />
            <circle className="eva-bot__pupil" cx="58" cy="38.5" r="1.7" fill="#041018" />
          </g>
        </g>

        {/* mouth — smile ↔ sad */}
        <path
          className="eva-bot__mouth"
          d="M40 46.5 C43 50.5, 53 50.5, 56 46.5"
          fill="none"
          stroke="#5ef8ff"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="7s"
            repeatCount="indefinite"
            values="
              M40 46.5 C43 50.5, 53 50.5, 56 46.5;
              M40 46.5 C43 50.5, 53 50.5, 56 46.5;
              M40 48 C44 48, 52 48, 56 48;
              M40 49.5 C43 45.5, 53 45.5, 56 49.5;
              M40 49.5 C43 45.5, 53 45.5, 56 49.5;
              M40 48 C44 48, 52 48, 56 48;
              M40 46.5 C43 50.5, 53 50.5, 56 46.5
            "
          />
        </path>

        {/* body */}
        <path
          d="M34 62c0-3 5-5 14-5s14 2 14 5v10c0 6-5.5 10-14 10s-14-4-14-10V62z"
          fill="url(#evaBotBlue)"
        />
        <path d="M36 72c2 8 22 8 24 0v8c-2 5-8 8-12 8s-10-3-12-8v-8z" fill="#eef8fc" />
        <circle cx="48" cy="68" r="3.2" fill="#062033" stroke="#9af8ff" strokeWidth="1.4" />

        {/* arms */}
        <path d="M30 68c-4 2-6 5-5 8" stroke="#dff7ff" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M66 68c4 2 6 5 5 8" stroke="#dff7ff" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function AgentDock() {
  const { pathname } = useLocation();
  const { site } = useSiteContent();
  const first = site?.profile?.firstName || "Shaurya";
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/login");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: `Hi — I'm Eva, ${first}'s AI assistant. Ask about projects, skills, experience, or how to get in touch.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (hidden) return null;

  const ask = async (question) => {
    const q = String(question || "").trim();
    if (!q || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setBusy(true);
    try {
      const { answer } = await askPortfolioAgent(site, q);
      setMessages((prev) => [...prev, { role: "agent", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "I hit a snag for a second. Try again — or ask about projects, skills, or contact." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const showPrompts = messages.length <= 1 && !busy;

  return (
    <div className="agent-dock" data-testid="agent-dock">
      {open && (
        <div className="eva-panel" data-testid="agent-panel">
          <div className="eva-panel__shine" aria-hidden />

          <header className="eva-panel__head">
            <div className="eva-panel__avatar">
              <EvaMark size={26} />
              <span className="eva-panel__online" />
            </div>
            <div className="eva-panel__titles">
              <p className="eva-panel__name">
                Eva
                <Sparkles size={13} />
              </p>
              <p className="eva-panel__status">Online · portfolio guide</p>
            </div>
            <button type="button" className="eva-panel__close" aria-label="Close Eva" onClick={() => setOpen(false)}>
              <X size={15} />
            </button>
          </header>

          <div className="eva-panel__messages" data-testid="hero-agent-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`eva-row ${msg.role === "user" ? "is-user" : "is-agent"}`}>
                {msg.role === "agent" && <span className="eva-row__badge">E</span>}
                <div className={`eva-bubble ${msg.role === "user" ? "is-user" : "is-agent"}`}>{msg.text}</div>
              </div>
            ))}
            {busy && (
              <div className="eva-row is-agent">
                <span className="eva-row__badge">E</span>
                <div className="eva-bubble is-agent is-typing">
                  <span className="eva-typing-dot" />
                  <span className="eva-typing-dot" />
                  <span className="eva-typing-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {showPrompts && (
            <div className="eva-panel__prompts">
              <p className="eva-panel__prompts-label">Try asking</p>
              <div className="eva-panel__chips">
                {AGENT_PROMPTS.slice(0, 3).map((prompt) => (
                  <button key={prompt} type="button" disabled={busy} onClick={() => ask(prompt)} className="eva-chip">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="eva-panel__composer"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${first}…`}
              disabled={busy}
              data-testid="hero-agent-input"
              className="eva-panel__input"
            />
            <button type="submit" disabled={busy || !input.trim()} className="eva-panel__send" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          type="button"
          data-testid="agent-launcher"
          aria-label="Open Eva chatbot"
          title="Chat with Eva"
          className="eva-launcher"
          onClick={() => setOpen(true)}
        >
          <span className="eva-launcher__halo" aria-hidden />
          <EvaLauncherIcon />
        </button>
      )}
    </div>
  );
}
