import { useEffect, useRef } from "react";

const SRC = "/shaurya-portrait.png";

function sampleParticles(img, canvasW, canvasH) {
  const probe = document.createElement("canvas");
  const pw = 160;
  const ph = Math.round((img.height / img.width) * pw);
  probe.width = pw;
  probe.height = ph;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  pctx.clearRect(0, 0, pw, ph);
  pctx.drawImage(img, 0, 0, pw, ph);
  const { data } = pctx.getImageData(0, 0, pw, ph);

  const particles = [];
  const drawW = canvasW * 0.78;
  const drawH = canvasH * 0.82;
  const ox = (canvasW - drawW) / 2;
  const oy = (canvasH - drawH) / 2 - canvasH * 0.02;
  const scaleX = drawW / pw;
  const scaleY = drawH / ph;
  const cx = canvasW / 2;
  const cy = canvasH / 2;

  for (let y = 0; y < ph; y += 1) {
    for (let x = 0; x < pw; x += 1) {
      const i = (y * pw + x) * 4;
      const a = data[i + 3];
      if (a < 40) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (brightness < 0.05) continue;

      const px = ox + x * scaleX;
      const py = oy + y * scaleY;
      particles.push({
        x: px,
        y: py,
        z: (brightness - 0.45) * 36,
        ox: px,
        oy: py,
        oz: (brightness - 0.45) * 36,
        bright: brightness,
        size: 1.15 + brightness * 2.1,
        layer: brightness > 0.55 ? 2 : brightness > 0.3 ? 1 : 0,
      });
    }
  }

  for (const p of particles) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 260;
    p.x = cx + Math.cos(ang) * dist;
    p.y = cy + Math.sin(ang) * dist;
    p.z = (Math.random() - 0.5) * 100;
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
      const w = Math.max(300, Math.floor(rect.width));
      const h = Math.max(360, Math.floor(rect.height));
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
      formed = Math.min(1, formed + 0.014);

      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;
      const mx = mouse.current.active ? mouse.current.x : Math.sin(t * 0.35) * 0.2;
      const my = mouse.current.active ? mouse.current.y : Math.cos(t * 0.28) * 0.14;

      // ambient glow only — clean, no clutter
      const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(w, h) * 0.48);
      glow.addColorStop(0, "rgba(0, 220, 255, 0.14)");
      glow.addColorStop(0.4, "rgba(80, 120, 255, 0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // elegant thin orbit
      ctx.save();
      ctx.translate(cx + mx * 6, cy + my * 4);
      ctx.rotate(t * 0.25);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 8]);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.38, h * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(-t * 0.55);
      ctx.strokeStyle = "rgba(168, 120, 255, 0.16)";
      ctx.setLineDash([1, 10]);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.44, h * 0.4, 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // soft ground ellipse
      ctx.fillStyle = "rgba(0, 200, 255, 0.08)";
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.9, w * 0.22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const tx = p.ox + mx * (16 + p.oz * 0.45) + Math.sin(t * 0.9 + p.oy * 0.015) * 0.45;
        const ty = p.oy + my * (12 + p.oz * 0.3) + Math.cos(t * 0.85 + p.ox * 0.015) * 0.45;
        const tz = p.oz + mx * 10;

        p.x += (tx - p.x) * (0.05 + formed * 0.05);
        p.y += (ty - p.y) * (0.05 + formed * 0.05);
        p.z += (tz - p.z) * 0.07;

        if (mouse.current.active) {
          const dx = p.x - (mx * 0.5 + 0.5) * w;
          const dy = p.y - (my * 0.5 + 0.5) * h;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 58) {
            const f = (58 - dist) / 58;
            p.x += (dx / dist) * f * 1.5;
            p.y += (dy / dist) * f * 1.5;
          }
        }

        const perspective = 1 + p.z / 160;
        const sx = w / 2 + (p.x - w / 2) * perspective;
        const sy = h / 2 + (p.y - h / 2) * perspective;
        const s = Math.max(0.8, p.size * perspective);

        // depth-colored holographic particles
        let rr;
        let gg;
        let bb;
        if (p.layer === 2) {
          rr = 210;
          gg = 250;
          bb = 255;
        } else if (p.layer === 1) {
          rr = 80;
          gg = 220;
          bb = 255;
        } else {
          rr = 90;
          gg = 140;
          bb = 255;
        }
        const alpha = 0.28 + p.bright * 0.7;
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s * 0.55, 0, Math.PI * 2);
        ctx.fill();
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
      <div className="particle-portrait__aura" aria-hidden />
      <canvas ref={canvasRef} className="particle-portrait__canvas" />
      <p className="particle-portrait__caption">
        <span className="particle-portrait__dot" />
        Move to interact
      </p>
    </div>
  );
}
