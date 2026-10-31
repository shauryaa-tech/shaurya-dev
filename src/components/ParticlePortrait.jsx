import { useEffect, useRef } from "react";

const SRC = "/shaurya-portrait.jpg";

function sampleParticles(img, canvasW, canvasH) {
  const probe = document.createElement("canvas");
  const pw = 170;
  const ph = Math.round((img.height / img.width) * pw);
  probe.width = pw;
  probe.height = ph;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  pctx.drawImage(img, 0, 0, pw, ph);
  const { data } = pctx.getImageData(0, 0, pw, ph);

  const particles = [];
  const padX = canvasW * 0.14;
  const padY = canvasH * 0.1;
  const drawW = canvasW - padX * 2;
  const drawH = canvasH - padY * 2;
  const scaleX = drawW / pw;
  const scaleY = drawH / ph;
  const cx = canvasW / 2;
  const cy = canvasH / 2;

  for (let y = 0; y < ph; y += 1) {
    for (let x = 0; x < pw; x += 1) {
      const i = (y * pw + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (brightness < 0.1) continue;
      if (brightness < 0.18 && Math.random() > 0.4) continue;

      const px = padX + x * scaleX;
      const py = padY + y * scaleY;
      const depth = (brightness - 0.5) * 32;

      particles.push({
        x: px,
        y: py,
        z: depth,
        ox: px,
        oy: py,
        oz: depth,
        bright: brightness,
        size: 1 + brightness * 1.7,
      });
    }
  }

  for (const p of particles) {
    const a = Math.random() * Math.PI * 2;
    const d = 90 + Math.random() * 240;
    p.x = cx + Math.cos(a) * d;
    p.y = cy + Math.sin(a) * d;
    p.z = (Math.random() - 0.5) * 90;
  }

  return particles;
}

function drawArc(ctx, cx, cy, r, start, end, color, width = 1.2) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.arc(cx, cy, r, start, end);
  ctx.stroke();
}

function drawTicks(ctx, cx, cy, r, count, len, rot, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const x1 = Math.cos(a) * r;
    const y1 = Math.sin(a) * r;
    const x2 = Math.cos(a) * (r + len);
    const y2 = Math.sin(a) * (r + len);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawJarvisHud(ctx, w, h, t, mx, my) {
  const cx = w * 0.5 + mx * 8;
  const cy = h * 0.46 + my * 6;

  // holographic core glow
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(w, h) * 0.48);
  glow.addColorStop(0, "rgba(0, 220, 255, 0.16)");
  glow.addColorStop(0.35, "rgba(0, 160, 255, 0.06)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // outer rotating rings
  drawTicks(ctx, cx, cy, Math.min(w, h) * 0.42, 72, 5, t * 0.35, "rgba(0, 230, 255, 0.28)");
  drawTicks(ctx, cx, cy, Math.min(w, h) * 0.37, 48, 8, -t * 0.55, "rgba(120, 180, 255, 0.22)");

  drawArc(ctx, cx, cy, Math.min(w, h) * 0.4, t, t + Math.PI * 1.4, "rgba(0, 240, 255, 0.55)", 1.5);
  drawArc(ctx, cx, cy, Math.min(w, h) * 0.4, t + Math.PI * 1.55, t + Math.PI * 1.85, "rgba(0, 240, 255, 0.9)", 2.2);
  drawArc(ctx, cx, cy, Math.min(w, h) * 0.34, -t * 1.2, -t * 1.2 + 2.2, "rgba(90, 200, 255, 0.45)", 1.2);
  drawArc(ctx, cx, cy, Math.min(w, h) * 0.3, t * 0.8, t * 0.8 + 1.1, "rgba(0, 255, 220, 0.5)", 1.4);

  // bracket corners
  const bx = 18;
  const by = 18;
  const bl = 22;
  ctx.strokeStyle = "rgba(0, 240, 255, 0.55)";
  ctx.lineWidth = 1.4;
  [
    [bx, by, 1, 1],
    [w - bx, by, -1, 1],
    [bx, h - by, 1, -1],
    [w - bx, h - by, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * bl);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * bl, y);
    ctx.stroke();
  });

  // side telemetry
  ctx.fillStyle = "rgba(0, 240, 255, 0.72)";
  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("JARVIS // PROTOCOL", 22, 40);
  ctx.fillStyle = "rgba(150, 230, 255, 0.55)";
  ctx.fillText("BIOMETRIC SCAN", 22, 56);
  ctx.fillText(`LINK ${Math.floor(86 + Math.sin(t) * 8)}%`, 22, 72);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(0, 240, 255, 0.72)";
  ctx.fillText("SYS.ONLINE", w - 22, 40);
  ctx.fillStyle = "rgba(150, 230, 255, 0.55)";
  ctx.fillText(`CPU ${(32 + Math.sin(t * 2.1) * 8).toFixed(1)}%`, w - 22, 56);
  ctx.fillText(`LAT ${Math.floor(12 + Math.sin(t * 1.4) * 4)}ms`, w - 22, 72);
  ctx.textAlign = "left";

  // mini bars
  for (let i = 0; i < 5; i += 1) {
    const bh = 8 + ((Math.sin(t * 3 + i) + 1) * 0.5) * 18;
    ctx.fillStyle = `rgba(0, 240, 255, ${0.25 + i * 0.08})`;
    ctx.fillRect(22 + i * 8, h - 48 - bh, 5, bh);
  }

  // hex accents
  ctx.strokeStyle = "rgba(0, 220, 255, 0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i += 1) {
    const hx = w * 0.78 + Math.sin(t + i) * 6;
    const hy = h * 0.7 + i * 18;
    ctx.beginPath();
    for (let k = 0; k < 6; k += 1) {
      const a = (Math.PI / 3) * k + t * 0.2;
      const px = hx + Math.cos(a) * 8;
      const py = hy + Math.sin(a) * 8;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // scan line
  const scanY = ((t * 55) % (h * 0.7)) + h * 0.12;
  const scan = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
  scan.addColorStop(0, "rgba(0, 240, 255, 0)");
  scan.addColorStop(0.5, "rgba(0, 240, 255, 0.22)");
  scan.addColorStop(1, "rgba(0, 240, 255, 0)");
  ctx.fillStyle = scan;
  ctx.fillRect(w * 0.16, scanY - 18, w * 0.68, 36);
  ctx.strokeStyle = "rgba(0, 255, 255, 0.55)";
  ctx.beginPath();
  ctx.moveTo(w * 0.18, scanY);
  ctx.lineTo(w * 0.82, scanY);
  ctx.stroke();
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
      formed = Math.min(1, formed + 0.011);

      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.active ? mouse.current.x : Math.sin(t * 0.35) * 0.22;
      const my = mouse.current.active ? mouse.current.y : Math.cos(t * 0.3) * 0.16;

      drawJarvisHud(ctx, w, h, t, mx, my);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const tx = p.ox + mx * (14 + p.oz * 0.4) + Math.sin(t * 1.1 + p.oy * 0.02) * 0.5;
        const ty = p.oy + my * (11 + p.oz * 0.28) + Math.cos(t + p.ox * 0.02) * 0.5;
        const tz = p.oz + mx * 10;

        p.x += (tx - p.x) * (0.04 + formed * 0.05);
        p.y += (ty - p.y) * (0.04 + formed * 0.05);
        p.z += (tz - p.z) * 0.06;

        if (mouse.current.active) {
          const dx = p.x - (mx * 0.5 + 0.5) * w;
          const dy = p.y - (my * 0.5 + 0.5) * h;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 64) {
            const f = (64 - dist) / 64;
            p.x += (dx / dist) * f * 1.8;
            p.y += (dy / dist) * f * 1.8;
          }
        }

        const perspective = 1 + p.z / 170;
        const sx = w / 2 + (p.x - w / 2) * perspective;
        const sy = h / 2 + (p.y - h / 2) * perspective;

        // pure holographic cyan particles (JARVIS look)
        const alpha = 0.25 + p.bright * 0.75;
        const glowBoost = 0.55 + p.bright * 0.45;
        ctx.fillStyle = `rgba(${Math.floor(80 * glowBoost)}, ${Math.floor(230 * glowBoost)}, 255, ${alpha})`;
        const s = Math.max(0.75, p.size * perspective);
        ctx.fillRect(sx, sy, s, s);
      }

      // inner reticle
      const cx = w * 0.5 + mx * 8;
      const cy = h * 0.46 + my * 6;
      ctx.strokeStyle = "rgba(0, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy);
      ctx.lineTo(cx - 6, cy);
      ctx.moveTo(cx + 6, cy);
      ctx.lineTo(cx + 18, cy);
      ctx.moveTo(cx, cy - 18);
      ctx.lineTo(cx, cy - 6);
      ctx.moveTo(cx, cy + 6);
      ctx.lineTo(cx, cy + 18);
      ctx.stroke();
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
    <div className="particle-portrait jarvis-hud" ref={wrapRef} data-testid="particle-portrait">
      <div className="jarvis-hud__frame" aria-hidden />
      <canvas ref={canvasRef} className="particle-portrait__canvas" />
      <div className="particle-portrait__caption">
        <span className="particle-portrait__dot" />
        Jarvis protocol · online
      </div>
    </div>
  );
}
