import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, X } from "lucide-react";
import { AGENT_PROMPTS, askPortfolioAgent } from "../lib/portfolioAgent";
import { useSiteContent } from "../site-content";

const POS_KEY = "sps-agent-pos-v2";
const WIDTH = 118;
const HEIGHT = 176;

function EvaFace({ size = 96, className = "" }) {
  const h = Math.round(size * 1.48);
  return (
    <img
      src="/eva-icon.png"
      alt="Eva"
      width={size}
      height={h}
      draggable={false}
      className={`object-contain select-none pointer-events-none ${className}`}
      style={{ width: size, height: h, background: "transparent" }}
    />
  );
}

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") return parsed;
  } catch {
    // ignore
  }
  return null;
}

function clampPos(x, y) {
  const maxX = Math.max(12, window.innerWidth - WIDTH - 12);
  const maxY = Math.max(12, window.innerHeight - HEIGHT - 12);
  return {
    x: Math.min(maxX, Math.max(12, x)),
    y: Math.min(maxY, Math.max(12, y)),
  };
}

function defaultSidePos() {
  return clampPos(window.innerWidth - WIDTH - 18, Math.round(window.innerHeight * 0.38));
}

export default function AgentDock() {
  const { pathname } = useLocation();
  const { site } = useSiteContent();
  const first = site.profile?.firstName || "Shaurya";
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/login");

  const [pos, setPos] = useState(() => ({ x: 0, y: 0 }));
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: `Hi — I'm Eva, ${first}'s AI assistant. Ask about his projects, skills, experience, or how to contact him.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const drag = useRef({ active: false, moved: false, ox: 0, oy: 0, startX: 0, startY: 0 });
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = loadPos();
    setPos(saved ? clampPos(saved.x, saved.y) : defaultSidePos());
    setReady(true);
    const onResize = () => setPos((current) => clampPos(current.x, current.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current.active) return;
      const point = e.touches?.[0] || e;
      const next = clampPos(point.clientX - drag.current.ox, point.clientY - drag.current.oy);
      if (Math.hypot(point.clientX - drag.current.startX, point.clientY - drag.current.startY) > 6) {
        drag.current.moved = true;
      }
      setPos(next);
    };
    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setDragging(false);
      setPos((current) => {
        const next = clampPos(current.x, current.y);
        localStorage.setItem(POS_KEY, JSON.stringify(next));
        return next;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  if (hidden || !ready) return null;

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

  const panelLeft = Math.min(Math.max(12, pos.x - 240), window.innerWidth - 360);
  const panelTop = Math.min(Math.max(12, pos.y - 20), window.innerHeight - 440);

  return (
    <div className="agent-dock" data-testid="agent-dock">
      {open && (
        <div
          className="fixed z-[90] w-[min(360px,calc(100vw-24px))] h-[min(440px,70vh)] glass rounded-[1.4rem] border border-neon/25 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.18)] flex flex-col"
          style={{ left: panelLeft, top: panelTop }}
          data-testid="agent-panel"
        >
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/10 bg-white/5">
            <span className="w-11 h-11 rounded-2xl bg-transparent flex items-center justify-center overflow-visible">
              <EvaFace size={40} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-white text-sm flex items-center gap-1.5">
                Eva
                <Sparkles size={13} className="text-viol" />
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-400">AI assistant · online</p>
            </div>
            <button
              type="button"
              aria-label="Close Eva"
              className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:text-neon t-fast"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" data-testid="hero-agent-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
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
                <div className="rounded-2xl rounded-bl-md px-3 py-2 bg-white/5 border border-white/10 text-slate-400 text-sm font-mono">
                  thinking…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-2.5 pb-2 flex flex-wrap gap-1.5">
            {AGENT_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={busy}
                onClick={() => ask(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-300 hover:border-neon/40 hover:text-neon t-fast disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="p-2.5 border-t border-white/10 flex gap-2"
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
              className="flex-1 min-w-0 rounded-xl bg-ink/60 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-neon/40"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-xl bg-neon text-ink px-3 py-2.5 disabled:opacity-50 t-fast"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        data-testid="agent-launcher"
        aria-label="Open Eva"
        title="Ask Eva"
        className={`fixed z-[95] rounded-none bg-transparent border-0 shadow-none flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-visible p-0 eva-float ${dragging ? "is-dragging" : ""}`}
        style={{
          left: pos.x,
          top: pos.y,
          width: WIDTH,
          height: HEIGHT,
          filter: "drop-shadow(0 14px 28px rgba(0,212,255,0.45))",
        }}
        onPointerDown={(e) => {
          drag.current = {
            active: true,
            moved: false,
            ox: e.clientX - pos.x,
            oy: e.clientY - pos.y,
            startX: e.clientX,
            startY: e.clientY,
          };
          setDragging(true);
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onClick={() => {
          if (drag.current.moved) return;
          setOpen((value) => !value);
        }}
      >
        <EvaFace size={110} />
      </button>
    </div>
  );
}
