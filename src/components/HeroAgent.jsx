import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { AGENT_PROMPTS, askPortfolioAgent } from "../lib/portfolioAgent";
import { useSiteContent } from "../site-content";

export default function HeroAgent() {
  const { site } = useSiteContent();
  const first = site.profile?.firstName || "Shaurya";
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: `Hi — I'm ${first}'s AI portfolio agent. Ask about his projects, skills, experience, or how to contact him. I'll answer from his real portfolio.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

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
    <div
      className="hero-agent relative w-full max-w-[520px] justify-self-center lg:justify-self-end"
      data-testid="hero-agent"
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-neon/10 blur-3xl pointer-events-none" />
      <div className="relative glass rounded-[1.6rem] border border-neon/20 overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.12)] flex flex-col h-[min(560px,70vh)] min-h-[420px]">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/5">
          <span className="w-10 h-10 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon">
            <Bot size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm flex items-center gap-2">
              {first} AI Agent
              <Sparkles size={14} className="text-viol" />
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">Online · portfolio-trained</p>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-testid="hero-agent-messages">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-neon text-ink rounded-br-md"
                    : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-white/5 border border-white/10 text-slate-400 text-sm font-mono">
                thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-3 pb-2 flex flex-wrap gap-2">
          {AGENT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={busy}
              onClick={() => ask(prompt)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300 hover:border-neon/40 hover:text-neon t-fast disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="p-3 border-t border-white/10 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          data-testid="hero-agent-form"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${first}…`}
            disabled={busy}
            data-testid="hero-agent-input"
            className="flex-1 min-w-0 rounded-xl bg-ink/60 border border-white/10 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-neon/40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            data-testid="hero-agent-send"
            className="shrink-0 rounded-xl bg-neon text-ink px-3.5 py-3 hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] disabled:opacity-50 t-fast"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
