import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
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
      <path
        d="M16 15h16v3.2H19.6V22H30v3H19.6v5.2H32.2V33H16V15z"
        fill="#9af8ff"
      />
      <circle cx="36" cy="12" r="3" fill="#5ef8ff" opacity="0.9" />
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
          <span className="eva-launcher__ring" aria-hidden />
          <span className="eva-launcher__core">
            <MessageCircle size={26} strokeWidth={2.2} />
            <span className="eva-launcher__dot" />
          </span>
        </button>
      )}
    </div>
  );
}
