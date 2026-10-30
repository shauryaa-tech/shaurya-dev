import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, X } from "lucide-react";
import { AGENT_PROMPTS, askPortfolioAgent } from "../lib/portfolioAgent";
import { useSiteContent } from "../site-content";

const POS_KEY = "sps-agent-pos-v5";
const WIDTH = 92;
const HEIGHT = 146;

function EvaFace({ size = 96, className = "", live = false }) {
  const h = Math.round(size * 1.58);
  return (
    <span
      className={`eva-face relative inline-block select-none pointer-events-none ${className}`}
      style={{ width: size, height: h }}
    >
      <img
        src="/eva-icon.png"
        alt="Eva"
        width={size}
        height={h}
        draggable={false}
        className="absolute inset-0 h-full w-full object-fill"
        style={{ background: "transparent" }}
      />
      {live && (
        <svg
          className="eva-visage"
          viewBox="0 0 646 1024"
          width={size}
          height={h}
          aria-hidden
        >
          <g className="eva-eyes">
            <ellipse className="eva-eye" cx="252" cy="210" rx="22" ry="26" />
            <ellipse className="eva-eye" cx="394" cy="210" rx="22" ry="26" />
          </g>
          <path
            className="eva-mouth"
            d="M 290 268 Q 323 298 356 268"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
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
  return clampPos(window.innerWidth - WIDTH - 16, window.innerHeight - HEIGHT - 28);
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
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  return (
    <div className="agent-dock" data-testid="agent-dock">
      {open && (
        <div
          className="eva-panel fixed z-[96] right-3 bottom-3 sm:right-5 sm:bottom-5 w-[min(380px,calc(100vw-24px))] h-[min(520px,78vh)] flex flex-col overflow-hidden"
          data-testid="agent-panel"
        >
          <div className="eva-panel__glow" aria-hidden />

          <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-visible rounded-2xl bg-ink/50 ring-1 ring-neon/30">
              <EvaFace size={34} live />
              <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
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
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-slate-400 text-sm font-mono flex items-center gap-1.5">
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
          aria-label="Open Eva"
          title="Ask Eva"
          className={`fixed z-[95] rounded-none bg-transparent border-0 shadow-none flex items-end justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-visible p-0 eva-float ${dragging ? "is-dragging" : ""}`}
          style={{
            left: pos.x,
            top: pos.y,
            width: WIDTH,
            height: HEIGHT,
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
            setOpen(true);
          }}
        >
          <span className="eva-aura" aria-hidden />
          <EvaFace size={88} live />
        </button>
      )}
    </div>
  );
}
