import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, X } from "lucide-react";
import { AGENT_PROMPTS, askPortfolioAgent } from "../lib/portfolioAgent";
import { useSiteContent } from "../site-content";

function EvaIcon({ size = 56, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="evaBody" x1="18" y1="8" x2="62" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8fbff" />
          <stop offset="0.45" stopColor="#9ae7ff" />
          <stop offset="1" stopColor="#3dd0ff" />
        </linearGradient>
        <linearGradient id="evaShell" x1="20" y1="12" x2="60" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c5f4ff" />
        </linearGradient>
        <filter id="evaSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#00e5ff" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="40" cy="72" rx="18" ry="4" fill="#00d4ff" opacity="0.28" className="eva-icon-shadow" />

      <g filter="url(#evaSoft)">
        <path
          d="M28 48c0-2.5 2.4-4.5 12-4.5s12 2 12 4.5v10.5c0 5.2-4.8 9-12 9s-12-3.8-12-9V48z"
          fill="url(#evaBody)"
        />
        <circle cx="40" cy="34" r="18" fill="url(#evaShell)" />
        <rect x="27" y="26" width="26" height="16" rx="8" fill="#0a1220" />
        <circle className="eva-icon-eye" cx="34.5" cy="33.5" r="2.6" fill="#5ef8ff" />
        <circle className="eva-icon-eye" cx="45.5" cy="33.5" r="2.6" fill="#5ef8ff" />
        <path
          className="eva-icon-mouth"
          d="M36 39.5c1.4 1.6 6.6 1.6 8 0"
          stroke="#5ef8ff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="22" cy="34" r="4.2" fill="#7aefff" />
        <circle cx="58" cy="34" r="4.2" fill="#7aefff" />
        <circle cx="22" cy="34" r="2" fill="#00b8e6" />
        <circle cx="58" cy="34" r="2" fill="#00b8e6" />
        <circle cx="40" cy="52.5" r="2.4" fill="#062033" stroke="#5ef8ff" strokeWidth="1.2" />
        <path d="M24 56c1.2 2.2 2.2 3.2 0 5" stroke="#dff9ff" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M56 56c-1.2 2.2-2.2 3.2 0 5" stroke="#dff9ff" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function AgentDock() {
  const { pathname } = useLocation();
  const { site } = useSiteContent();
  const first = site.profile?.firstName || "Shaurya";
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

  return (
    <div className="agent-dock" data-testid="agent-dock">
      {open && (
        <div className="eva-panel" data-testid="agent-panel">
          <div className="eva-panel__glow" aria-hidden />

          <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink/60 ring-1 ring-neon/30 overflow-hidden">
              <EvaIcon size={40} />
              <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-white text-[15px] flex items-center gap-1.5 leading-none">
                Eva
                <Sparkles size={14} className="text-neon" />
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/90">
                Online · ready to help
              </p>
            </div>
            <button
              type="button"
              aria-label="Close Eva"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-neon/40 hover:text-neon t-fast"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3" data-testid="hero-agent-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-neon text-ink shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      : "rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5 flex items-center gap-1.5">
                  <span className="eva-typing-dot" />
                  <span className="eva-typing-dot" />
                  <span className="eva-typing-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="relative px-3 pb-2 flex flex-wrap gap-1.5">
            {AGENT_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={busy}
                onClick={() => ask(prompt)}
                className="rounded-full border border-neon/20 bg-neon/5 px-3 py-1.5 font-mono text-[10px] tracking-wide text-slate-300 hover:border-neon/50 hover:bg-neon/10 hover:text-neon t-fast disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="relative m-3 mt-1 flex gap-2 rounded-2xl border border-white/10 bg-ink/70 p-1.5 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.06)]"
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
              className="flex-1 min-w-0 rounded-xl bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-xl bg-neon text-ink px-3.5 py-2.5 disabled:opacity-40 hover:brightness-110 t-fast"
              aria-label="Send"
            >
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
          <span className="eva-launcher__ring" aria-hidden />
          <span className="eva-launcher__core">
            <EvaIcon size={54} />
          </span>
        </button>
      )}
    </div>
  );
}
