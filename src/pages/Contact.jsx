import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Mail, Phone, MapPin, Github, Linkedin, Copy, Send, Download,
} from "lucide-react";
import { KineticLine, Reveal } from "../components/Kinetic";
import { useSiteContent } from "../site-content";

async function sendToInbox(inbox, form) {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Shaurya.dev · ${form.subject} — ${form.name}`,
        _template: "box",
        _captcha: "false",
        _replyto: form.email,
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (String(data.success) === "true") return { ok: true, activate: false };
    return { ok: false, activate: /activat|confirm/i.test(String(data.message || "")) };
  } catch {
    return { ok: false, activate: false };
  }
}

export default function Contact() {
  const { site } = useSiteContent();
  const profile = site.profile;
  const copyText = site.contact;
  const subjects = copyText.subjects?.length ? copyText.subjects : ["Hello"];
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${key} copied to clipboard`);
    } catch {
      toast.error("Copy failed — please copy manually");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Your name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.message.trim().length < 10) errs.message = "Tell me a bit more (10+ characters)";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(40000),
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          company: new FormData(e.target).get("company") || "",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.saved) {
        toast.error(data.detail || "Couldn't send right now — please email me directly");
        return;
      }
      if (!data.emailed) {
        const relayed = data.inbox ? await sendToInbox(data.inbox, form) : { ok: false, activate: false };
        if (relayed.ok) {
          toast.success("Message sent — it lands straight in my inbox. I'll reply soon!");
          setForm({ name: "", email: "", subject: subjects[0], message: "" });
          return;
        }
        if (relayed.activate) {
          toast.error("Gmail mein Activate Form wala mail khula hoga. Us link par ek baar click karo, phir yeh message dubara bhejo.");
          return;
        }
        toast.error("Saved on the site, but the email did not reach Gmail.");
        return;
      }
      toast.success("Message sent — it lands straight in my inbox. I'll reply soon!");
      setForm({ name: "", email: "", subject: subjects[0], message: "" });
    } catch {
      toast.error("Couldn't send right now — please email me directly");
    } finally {
      setSending(false);
    }
  };

  const INFO = [
    { icon: Mail, label: "Email", value: profile.email, copyText: profile.email, href: `mailto:${profile.email}`, testid: "contact-info-email" },
    { icon: Phone, label: "Phone", value: profile.phone, copyText: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, testid: "contact-info-phone" },
    { icon: MapPin, label: "Location", value: profile.location, testid: "contact-info-location" },
    { icon: Github, label: "GitHub", value: profile.githubLabel, href: profile.github, testid: "contact-info-github" },
    { icon: Linkedin, label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, testid: "contact-info-linkedin" },
  ];

  return (
    <main data-testid="contact-page" className="relative min-h-screen pt-[72px] overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-viol/15 blur-[130px]" />
      <div className="absolute bottom-0 -left-24 w-[420px] h-[420px] rounded-full bg-neon/12 blur-[130px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <Link
          to="/"
          data-testid="contact-back-link"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-neon t-fast mb-12"
        >
          <ArrowLeft size={15} /> {copyText.back}
        </Link>

        <h1 className="font-display font-extrabold text-white leading-[0.95] tracking-tight text-[clamp(2.4rem,10vw,4.5rem)]">
          <KineticLine delay={0.08}>{copyText.line1}</KineticLine>
          <KineticLine delay={0.2}>
            <span className="text-stroke">{copyText.line2}</span>
          </KineticLine>
        </h1>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 mt-14 items-start">
          <div>
            <Reveal>
              <div className="relative">
                <div className="absolute inset-10 bg-neon/10 blur-[70px] rounded-full" />
                <img
                  src="/contact-character.png"
                  alt="3D avatar of Shaurya relaxing with a coffee"
                  className="relative floaty w-full max-w-[420px] mx-auto object-contain"
                  data-testid="contact-character"
                />
              </div>
            </Reveal>
            <div className="space-y-3 mt-8">
              {INFO.map((c, i) => {
                const Icon = c.icon;
                const Inner = (
                  <>
                    <span className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/25 flex items-center justify-center text-neon shrink-0">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{c.label}</p>
                      <p className="text-slate-200 text-sm truncate">{c.value}</p>
                    </div>
                    {c.copyText && (
                      <Copy size={15} className="text-slate-500 hover:text-neon t-fast shrink-0 ml-auto" />
                    )}
                  </>
                );
                const cardClass = "glass rounded-2xl px-5 py-3.5 flex items-center gap-4 hover:border-neon/40 t-fast";
                return (
                  <Reveal key={c.label} delay={0.06 * i}>
                    {c.href && !c.copyText ? (
                      <a href={c.href} target="_blank" rel="noreferrer" data-testid={c.testid} className={cardClass}>
                        {Inner}
                      </a>
                    ) : (
                      <div
                        data-testid={c.testid}
                        onClick={() => c.copyText && copy(c.copyText, c.label)}
                        className={cardClass}
                      >
                        {Inner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
              <Reveal delay={0.35}>
                <a
                  href={profile.resume}
                  download="Shaurya_Pratap_Singh_Resume.pdf"
                  data-testid="contact-resume-btn"
                  className="inline-flex items-center gap-2.5 rounded-full border border-viol/50 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-viol hover:bg-viol/10 t-fast"
                >
                  <Download size={15} /> {copyText.resume}
                </a>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="glass rounded-3xl p-7 md:p-9" data-testid="contact-form">
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
              <h2 className="font-display font-bold text-white text-2xl mb-2">{copyText.formTitle}</h2>
              <p className="text-slate-400 text-sm mb-8">
                {copyText.formBlurb}
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-2" htmlFor="cf-name">
                    Your Name
                  </label>
                  <input
                    id="cf-name"
                    data-testid="contact-form-name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Ada Lovelace"
                    className={`w-full rounded-xl bg-ink/70 border px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none t-fast focus:border-neon ${
                      errors.name ? "border-red-500/70" : "border-white/10"
                    }`}
                  />
                  {errors.name && <p data-testid="contact-error-name" className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-2" htmlFor="cf-email">
                    Your Email
                  </label>
                  <input
                    id="cf-email"
                    data-testid="contact-form-email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@company.com"
                    className={`w-full rounded-xl bg-ink/70 border px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none t-fast focus:border-neon ${
                      errors.email ? "border-red-500/70" : "border-white/10"
                    }`}
                  />
                  {errors.email && <p data-testid="contact-error-email" className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-2" htmlFor="cf-subject">
                  Subject
                </label>
                <select
                  id="cf-subject"
                  data-testid="contact-form-subject"
                  value={form.subject}
                  onChange={set("subject")}
                  className="w-full rounded-xl bg-ink/70 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-neon t-fast"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-panel">{s}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-2" htmlFor="cf-message">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  data-testid="contact-form-message"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  placeholder="Tell me about the role, the idea, or just say hi…"
                  className={`w-full rounded-xl bg-ink/70 border px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none resize-none t-fast focus:border-neon ${
                    errors.message ? "border-red-500/70" : "border-white/10"
                  }`}
                />
                {errors.message && <p data-testid="contact-error-message" className="text-red-400 text-xs mt-1.5">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                data-testid="contact-form-submit"
                className="mt-7 w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-neon px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 disabled:opacity-60 t-fast"
              >
                {sending ? copyText.sending : <>{copyText.send} <Send size={15} /></>}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
