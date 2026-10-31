import { useEffect, useRef } from "react";

const SRC = "/shaurya-portrait.jpg";

function sampleParticles(img, canvasW, canvasH) {
  const probe = document.createElement("canvas");
  const pw = 180;
  const ph = Math.round((img.height / img.width) * pw);
  probe.width = pw;
  probe.height = ph;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  pctx.drawImage(img, 0, 0, pw, ph);
  const { data } = pctx.getImageData(0, 0, pw, ph);

  const particles = [];
  const scaleX = canvasW / pw;
  const scaleY = canvasH / ph;
  const cx = canvasW / 2;
  const cy = canvasH / 2;

  for (let y = 0; y < ph; y += 1) {
    for (let x = 0; x < pw; x += 1) {
      const i = (y * pw + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

      // skip very dark background-ish pixels
      if (brightness < 0.08) continue;
      // prefer face tones / detail; thin out shadows
      if (brightness < 0.16 && Math.random() > 0.35) continue;

      const px = x * scaleX;
      const py = y * scaleY;
      const depth = (brightness - 0.5) * 28;

      particles.push({
        x: px,
        y: py,
        z: depth,
        ox: px,
        oy: py,
        oz: depth,
        vx: 0,
        vy: 0,
        r,
        g,
        b,
        size: 1.1 + brightness * 1.8,
        bright: brightness,
      });
    }
  }

  // scatter start positions for intro
  for (const p of particles) {
    const a = Math.random() * Math.PI * 2;
    const d = 80 + Math.random() * 220;
    p.x = cx + Math.cos(a) * d;
    p.y = cy + Math.sin(a) * d;
    p.z = (Math.random() - 0.5) * 80;
  }

  return particles;
}

export default function ParticlePortrait() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = 0;
    let running = true;
    let t = 0;
    let formed = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(280, Math.floor(rect.width));
      const h = Math.max(340, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let size = resize();

    const img = new Image();
    img.decoding = "async";
    img.src = SRC;
    img.onload = () => {
      size = resize();
      particles = sampleParticles(img, size.w, size.h);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.current.active = true;
    };
    const onLeave = () => {
      mouse.current.active = false;
    };
    const onResize = () => {
      size = resize();
      if (img.complete && img.naturalWidth) {
        particles = sampleParticles(img, size.w, size.h);
        formed = 1;
      }
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      t += 0.016;
      formed = Math.min(1, formed + 0.012);

      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);

      // soft neon stage
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.5, w * 0.55);
      g.addColorStop(0, "rgba(0, 220, 255, 0.10)");
      g.addColorStop(0.45, "rgba(120, 70, 255, 0.06)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const mx = mouse.current.active ? mouse.current.x : Math.sin(t * 0.4) * 0.25;
      const my = mouse.current.active ? mouse.current.y : Math.cos(t * 0.35) * 0.18;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const tx = p.ox + mx * (12 + p.oz * 0.35) + Math.sin(t * 1.2 + p.oy * 0.02) * 0.6;
        const ty = p.oy + my * (10 + p.oz * 0.25) + Math.cos(t * 1.1 + p.ox * 0.02) * 0.6;
        const tz = p.oz + mx * 8;

        p.x += (tx - p.x) * (0.045 + formed * 0.05);
        p.y += (ty - p.y) * (0.045 + formed * 0.05);
        p.z += (tz - p.z) * 0.06;

        // mouse explode/attract locally
        if (mouse.current.active) {
          const dx = p.x - (mx * 0.5 + 0.5) * w;
          const dy = p.y - (my * 0.5 + 0.5) * h;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 70) {
            const f = (70 - dist) / 70;
            p.x += (dx / dist) * f * 2.2;
            p.y += (dy / dist) * f * 2.2;
          }
        }

        const perspective = 1 + p.z / 180;
        const sx = w / 2 + (p.x - w / 2) * perspective;
        const sy = h / 2 + (p.y - h / 2) * perspective;
        const alpha = 0.35 + p.bright * 0.65;

        // cyan/violet tint over natural color for portfolio look
        const nr = Math.min(255, p.r * 0.55 + 40);
        const ng = Math.min(255, p.g * 0.7 + 120);
        const nb = Math.min(255, p.b * 0.55 + 220);

        ctx.fillStyle = `rgba(${nr | 0},${ng | 0},${nb | 0},${alpha})`;
        const s = Math.max(0.7, p.size * perspective);
        ctx.fillRect(sx, sy, s, s);
      }
    };

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="particle-portrait" ref={wrapRef} data-testid="particle-portrait">
      <div className="particle-portrait__ring" aria-hidden />
      <div className="particle-portrait__ring particle-portrait__ring--b" aria-hidden />
      <canvas ref={canvasRef} className="particle-portrait__canvas" />
      <div className="particle-portrait__caption">
        <span className="particle-portrait__dot" />
        Interactive particle portrait
      </div>
    </div>
  );
}
