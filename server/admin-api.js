import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { contactMail } from "./email-template.js";

const dataDir = path.resolve("data");
const contentPath = path.join(dataDir, "content.json");
const trafficPath = path.join(dataDir, "traffic.json");
const messagesPath = path.join(dataDir, "messages.json");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readRaw(req, limit = 12_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        reject(new Error("too big"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sniffMedia(buf) {
  if (buf.length > 20 && buf.slice(0, 4).toString() === "glTF") return { ext: "glb", kind: "model" };
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { ext: "png", kind: "image" };
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) return { ext: "jpg", kind: "image" };
  if (buf.length > 12 && buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return { ext: "webp", kind: "image" };
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) req.destroy();
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function send(res, code, body) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function clip(value, max = 400) {
  return String(value ?? "").trim().slice(0, max);
}

function lines(list, max = 40) {
  return (Array.isArray(list) ? list : []).map((item) => clip(item, 80)).filter(Boolean).slice(0, max);
}

function tags(list) {
  return (Array.isArray(list) ? list : []).map((item) => clip(item, 40)).filter(Boolean).slice(0, 12);
}

function mediaPath(value, fallback) {
  const next = clip(value, 200);
  if (next.startsWith("/uploads/") || next.startsWith("/models/")) return next;
  return fallback;
}

function hex(value, fallback) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || "")) ? String(value) : fallback;
}

function sanitizeSite(body) {
  const theme = body.theme || {};
  const profile = body.profile || {};
  const nav = body.nav || {};
  const hero = body.hero || {};
  const about = body.about || {};
  const skills = body.skills || {};
  const journey = body.journey || {};
  const projectsSection = body.projectsSection || {};
  const achievementsSection = body.achievementsSection || {};
  const footer = body.footer || {};
  const contact = body.contact || {};

  const experience = (Array.isArray(body.experience) ? body.experience : []).slice(0, 20).map((job) => ({
    role: clip(job.role, 120),
    company: clip(job.company, 120),
    place: clip(job.place, 120),
    period: clip(job.period, 80),
    current: Boolean(job.current),
    bullets: (job.bullets || []).map((item) => clip(item, 400)).filter(Boolean).slice(0, 8),
    tags: tags(job.tags),
  })).filter((job) => job.role && job.company);

  const projects = (Array.isArray(body.projects) ? body.projects : []).slice(0, 24).map((project, index) => ({
    num: String(index + 1).padStart(2, "0"),
    icon: clip(project.icon, 40) || "Code2",
    title: clip(project.title, 140),
    desc: clip(project.desc, 600),
    tags: tags(project.tags),
    repo: clip(project.repo, 300),
    repoLabel: clip(project.repoLabel, 40) || "View Code",
  })).filter((project) => project.title);

  return {
    theme: {
      mode: theme.mode === "light" ? "light" : "dark",
      cyan: hex(theme.cyan, "#00f0ff"),
      violet: hex(theme.violet, "#a855f7"),
      ink: hex(theme.ink, "#030712"),
      panel: hex(theme.panel, "#0b0f19"),
    },
    profile: {
      name: clip(profile.name, 80),
      firstName: clip(profile.firstName, 40),
      role: clip(profile.role, 120),
      location: clip(profile.location, 120),
      email: clip(profile.email, 120),
      phone: clip(profile.phone, 40),
      linkedin: clip(profile.linkedin, 200),
      github: clip(profile.github, 200),
      resume: clip(profile.resume, 200) || "/Shaurya_Pratap_Singh_Resume.pdf",
      brand: clip(profile.brand, 24) || "SHAURYA",
      brandAccent: clip(profile.brandAccent, 12) || ".DEV",
      githubLabel: clip(profile.githubLabel, 80),
      linkedinLabel: clip(profile.linkedinLabel, 80),
    },
    nav: {
      links: (Array.isArray(nav.links) ? nav.links : []).slice(0, 6).map((link) => ({
        id: clip(link.id, 30),
        label: clip(link.label, 30),
      })).filter((link) => link.id && link.label),
      resumeLabel: clip(nav.resumeLabel, 30) || "Resume",
      talkLabel: clip(nav.talkLabel, 30) || "Let's Talk",
      mobileResume: clip(nav.mobileResume, 40) || "Download Resume",
    },
    hero: {
      badge: clip(hero.badge, 80),
      line1: clip(hero.line1, 40),
      line2: clip(hero.line2, 40),
      line3: clip(hero.line3, 20),
      accent: clip(hero.accent, 40),
      bio: clip(hero.bio, 500),
      explore: clip(hero.explore, 40),
      resume: clip(hero.resume, 40),
      scroll: clip(hero.scroll, 20),
      rotate: clip(hero.rotate, 40),
      chips: lines(hero.chips, 4),
      visual: hero.visual === "image" ? "image" : "model",
      model: mediaPath(hero.model, "/models/robot.glb"),
      image: mediaPath(hero.image, ""),
    },
    metrics: (Array.isArray(body.metrics) ? body.metrics : []).slice(0, 6).map((metric) => ({
      value: clip(metric.value, 16),
      label: clip(metric.label, 24),
      sub: clip(metric.sub, 40),
    })).filter((metric) => metric.value || metric.label),
    marquee: lines(body.marquee, 20),
    about: {
      index: clip(about.index, 8),
      eyebrow: clip(about.eyebrow, 40),
      title: clip(about.title, 60),
      accent: clip(about.accent, 60),
      leadBefore: clip(about.leadBefore, 80),
      leadCyan: clip(about.leadCyan, 60),
      leadMid: clip(about.leadMid, 40),
      leadViolet: clip(about.leadViolet, 60),
      leadAfter: clip(about.leadAfter, 500),
      body: clip(about.body, 800),
      eduLabel: clip(about.eduLabel, 40),
      eduTitle: clip(about.eduTitle, 120),
      eduMeta: clip(about.eduMeta, 120),
      terminalTitle: clip(about.terminalTitle, 60),
      cards: (about.cards || []).slice(0, 8).map((card, index) => ({
        num: clip(card.num, 4) || String(index + 1).padStart(2, "0"),
        title: clip(card.title, 80),
        desc: clip(card.desc, 400),
      })).filter((card) => card.title),
      terminal: (about.terminal || []).slice(0, 16).map((line) => ({
        text: clip(line.text, 160),
        tone: ["cmd", "out", "ok"].includes(line.tone) ? line.tone : "out",
      })).filter((line) => line.text),
    },
    skills: {
      index: clip(skills.index, 8),
      eyebrow: clip(skills.eyebrow, 40),
      title: clip(skills.title, 60),
      accent: clip(skills.accent, 60),
      groups: (skills.groups || []).slice(0, 8).map((group) => ({
        icon: clip(group.icon, 30) || "Code2",
        title: clip(group.title, 60),
        skills: (group.skills || []).slice(0, 10).map((skill) => ({
          name: clip(skill.name, 40),
          level: Math.min(5, Math.max(1, Number(skill.level) || 3)),
        })).filter((skill) => skill.name),
      })).filter((group) => group.title),
    },
    journey: {
      index: clip(journey.index, 8),
      eyebrow: clip(journey.eyebrow, 40),
      title: clip(journey.title, 60),
      accent: clip(journey.accent, 60),
      educationLabel: clip(journey.educationLabel, 40),
    },
    experience,
    education: (Array.isArray(body.education) ? body.education : []).slice(0, 8).map((item) => ({
      title: clip(item.title, 120),
      org: clip(item.org, 120),
      meta: clip(item.meta, 80),
      highlight: Boolean(item.highlight),
    })).filter((item) => item.title),
    projectsSection: {
      index: clip(projectsSection.index, 8),
      eyebrow: clip(projectsSection.eyebrow, 40),
      title: clip(projectsSection.title, 60),
      accent: clip(projectsSection.accent, 60),
      more: clip(projectsSection.more, 120),
    },
    projects,
    achievementsSection: {
      index: clip(achievementsSection.index, 8),
      eyebrow: clip(achievementsSection.eyebrow, 40),
      title: clip(achievementsSection.title, 60),
      accent: clip(achievementsSection.accent, 60),
    },
    achievements: (Array.isArray(body.achievements) ? body.achievements : []).slice(0, 12).map((item) => ({
      icon: clip(item.icon, 30) || "Award",
      title: clip(item.title, 120),
      org: clip(item.org, 120),
      meta: clip(item.meta, 40),
      gold: Boolean(item.gold),
    })).filter((item) => item.title),
    footer: {
      index: clip(footer.index, 8),
      eyebrow: clip(footer.eyebrow, 40),
      title: clip(footer.title, 80),
      accent: clip(footer.accent, 40),
      blurb: clip(footer.blurb, 300),
      cta: clip(footer.cta, 40),
      resume: clip(footer.resume, 40),
      credit: clip(footer.credit, 80),
      wordA: clip(footer.wordA, 24),
      wordB: clip(footer.wordB, 24),
    },
    contact: {
      back: clip(contact.back, 40),
      line1: clip(contact.line1, 30),
      line2: clip(contact.line2, 30),
      formTitle: clip(contact.formTitle, 60),
      formBlurb: clip(contact.formBlurb, 200),
      send: clip(contact.send, 40),
      sending: clip(contact.sending, 40),
      resume: clip(contact.resume, 40),
      subjects: lines(contact.subjects, 8),
      inbox: validEmail(contact.inbox) ? clip(contact.inbox, 120) : "shaurya13822@gmail.com",
    },
  };
}

function dayKey(ts) {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function summarize(visits) {
  const now = Date.now();
  const today = dayKey(now);
  const sessions = new Set();
  const pages = new Map();
  const byDay = new Map();
  for (let i = 6; i >= 0; i--) {
    byDay.set(dayKey(now - i * 86400000), 0);
  }
  for (const visit of visits) {
    if (visit.sessionId) sessions.add(visit.sessionId);
    pages.set(visit.path, (pages.get(visit.path) || 0) + 1);
    const key = dayKey(visit.ts);
    if (byDay.has(key)) byDay.set(key, byDay.get(key) + 1);
  }
  return {
    totalViews: visits.length,
    uniqueVisitors: sessions.size,
    todayViews: visits.filter((v) => dayKey(v.ts) === today).length,
    last7: [...byDay.entries()].map(([date, views]) => ({ date, views })),
    pages: [...pages.entries()]
      .map(([pathName, views]) => ({ path: pathName, views }))
      .sort((a, b) => b.views - a.views),
    recent: [...visits].slice(-12).reverse(),
  };
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function deliverContact({ smtpUser, smtpPass, to, mail, replyTo, fields }) {
  if (smtpUser && smtpPass) {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
      });
      await transport.sendMail({
        from: { name: "Shaurya.dev", address: smtpUser },
        to,
        replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      return { emailed: true, note: "gmail" };
    } catch (err) {
      console.error("gmail smtp:", err?.message || err);
    }
  }
  return deliverOverHttps({ to, mail, replyTo, fields });
}

async function deliverOverHttps({ to, mail, replyTo, fields }) {
  const site = "http://localhost:5173";
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: site,
        Referer: `${site}/contact`,
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        _subject: mail.subject,
        _template: "box",
        _captcha: "false",
        _replyto: replyTo,
        From: fields.name,
        Email: fields.email,
        Topic: fields.subject,
        Message: fields.message,
        Portfolio: "Shaurya Pratap Singh · AI/ML Engineer",
      }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json().catch(() => ({}));
    const note = String(data.message || "");
    const ok = response.ok && String(data.success) === "true";
    if (!ok) console.error("contact https:", note || response.status);
    return { emailed: ok, note: note || `mail service ${response.status}` };
  } catch (err) {
    const note = err?.message || "mail service failed";
    console.error("contact https:", note);
    return { emailed: false, note };
  }
}

export function adminApiPlugin({
  user = "shaurya",
  password = "Shaurya@2026",
  inbox = "shaurya13822@gmail.com",
  smtpUser = "",
  smtpPass = "",
} = {}) {
  const tokens = new Set();
  const contactHits = new Map();
  let failures = 0;
  let lockedUntil = 0;

  function authed(req) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    return token && tokens.has(token);
  }

  function currentInbox() {
    const content = readJson(contentPath, {});
    const saved = clip(content.contact?.inbox, 120);
    if (validEmail(saved)) return saved;
    return validEmail(inbox) ? inbox : "shaurya13822@gmail.com";
  }

  return {
    name: "admin-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0];
        if (!pathname.startsWith("/api/")) return next();

        try {
          if (req.method === "POST" && pathname === "/api/upload") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            const file = await readRaw(req);
            const sniffed = sniffMedia(file);
            const asked = new URL(req.url, "http://localhost").searchParams.get("kind");
            if (!sniffed || sniffed.kind !== asked) {
              return send(res, 400, { detail: "Upload a .glb model or a PNG, JPG, or WEBP image" });
            }
            const uploads = path.resolve("public/uploads");
            fs.mkdirSync(uploads, { recursive: true });
            const filename = `hero-${Date.now()}.${sniffed.ext}`;
            fs.writeFileSync(path.join(uploads, filename), file);
            return send(res, 200, { url: `/uploads/${filename}` });
          }

          if (req.method === "POST" && pathname === "/api/login") {
            if (Date.now() < lockedUntil) {
              return send(res, 429, { detail: "Too many attempts. Wait a minute and try again." });
            }
            const body = await readBody(req);
            const ok = safeEqual(body.username || "", user) && safeEqual(body.password || "", password);
            if (!ok) {
              failures += 1;
              if (failures >= 8) {
                lockedUntil = Date.now() + 60_000;
                failures = 0;
              }
              return send(res, 401, { detail: "Wrong username or password" });
            }
            failures = 0;
            const token = crypto.randomBytes(24).toString("hex");
            tokens.add(token);
            return send(res, 200, { token });
          }

          if (req.method === "GET" && pathname === "/api/content") {
            const content = readJson(contentPath, { experience: [], projects: [] });
            return send(res, 200, content);
          }

          if (req.method === "PUT" && pathname === "/api/content") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            const body = await readBody(req);
            const saved = sanitizeSite(body);
            writeJson(contentPath, saved);
            return send(res, 200, saved);
          }

          if (req.method === "POST" && pathname === "/api/contact") {
            const body = await readBody(req);
            if (String(body.company || "").trim()) return send(res, 200, { saved: true, emailed: true });
            const name = clip(body.name, 80);
            const email = clip(body.email, 120);
            const subject = clip(body.subject, 80) || "Hello";
            const message = clip(body.message, 4000);
            if (!name || !validEmail(email) || message.length < 10) {
              return send(res, 400, { detail: "Check the name, email, and message." });
            }
            const ip = String(req.socket?.remoteAddress || "local");
            const now = Date.now();
            const recent = (contactHits.get(ip) || []).filter((ts) => now - ts < 10 * 60 * 1000);
            if (recent.length >= 6) return send(res, 429, { detail: "Too many messages. Try again in a few minutes." });
            recent.push(now);
            contactHits.set(ip, recent);

            const content = readJson(contentPath, {});
            const mail = contactMail({ name, email, subject, message, theme: content.theme });
            const entry = {
              id: crypto.randomBytes(8).toString("hex"),
              name,
              email,
              subject,
              message,
              ts: Date.now(),
              emailed: false,
            };
            let delivery = { emailed: false, note: "" };
            try {
              delivery = await deliverContact({
                smtpUser,
                smtpPass,
                to: currentInbox(),
                mail,
                replyTo: email,
                fields: { name, email, subject, message },
              });
            } catch (err) {
              console.error("contact mail:", err?.message || err);
              delivery = { emailed: false, note: "delivery failed" };
            }
            entry.emailed = delivery.emailed;
            const store = readJson(messagesPath, { messages: [] });
            store.messages.push(entry);
            if (store.messages.length > 200) store.messages = store.messages.slice(-200);
            writeJson(messagesPath, store);
            return send(res, 200, {
              saved: true,
              emailed: entry.emailed,
              note: delivery.note || "",
              inbox: entry.emailed ? "" : currentInbox(),
            });
          }

          if (req.method === "GET" && pathname === "/api/messages") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            const store = readJson(messagesPath, { messages: [] });
            const messages = [...(store.messages || [])].reverse();
            return send(res, 200, { inbox: currentInbox(), mailReady: Boolean(smtpUser && smtpPass), messages });
          }

          if (req.method === "PUT" && pathname === "/api/inbox") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            const body = await readBody(req);
            const email = clip(body.email, 120);
            if (!validEmail(email)) return send(res, 400, { detail: "Enter a valid Gmail address" });
            const content = readJson(contentPath, {});
            content.contact = { ...(content.contact || {}), inbox: email };
            writeJson(contentPath, content);
            return send(res, 200, { inbox: email });
          }

          if (req.method === "POST" && pathname === "/api/track") {
            const body = await readBody(req);
            const visitPath = String(body.path || "/").slice(0, 120);
            if (visitPath.startsWith("/admin") || visitPath.startsWith("/login")) {
              return send(res, 200, { ok: true });
            }
            const store = readJson(trafficPath, { visits: [] });
            store.visits.push({
              path: visitPath,
              sessionId: String(body.sessionId || "").slice(0, 64),
              referrer: String(body.referrer || "").slice(0, 200),
              ts: Date.now(),
            });
            if (store.visits.length > 2000) store.visits = store.visits.slice(-2000);
            writeJson(trafficPath, store);
            return send(res, 200, { ok: true });
          }

          if (req.method === "GET" && pathname === "/api/traffic") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            const store = readJson(trafficPath, { visits: [] });
            return send(res, 200, summarize(store.visits || []));
          }

          if (req.method === "GET" && pathname === "/api/me") {
            if (!authed(req)) return send(res, 401, { detail: "Login required" });
            return send(res, 200, { user });
          }

          return send(res, 404, { detail: "Not found" });
        } catch {
          return send(res, 400, { detail: "Bad request" });
        }
      });
    },
  };
}
