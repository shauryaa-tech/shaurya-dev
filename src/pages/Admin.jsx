import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authHeaders, useSiteContent } from "../site-content";
import { applyTheme } from "../theme";
import { contactMail } from "../../server/email-template.js";
import "../admin.css";

const TABS = [
  ["design", "Design"],
  ["profile", "Profile"],
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["jobs", "Jobs"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["wins", "Wins"],
  ["footer", "Footer"],
  ["contact", "Contact"],
  ["inbox", "Inbox"],
  ["traffic", "Traffic"],
];

const SKILL_ICONS = ["Brain", "Braces", "Code2", "Database", "Wrench"];
const PROJECT_ICONS = ["Users", "FileSearch", "MessagesSquare", "Mic", "Brain", "Code2", "Database"];
const WIN_ICONS = ["Trophy", "Medal", "Award", "BadgeCheck"];

const emptyJob = { role: "", company: "", place: "", period: "", current: false, bullets: "", tags: "" };
const emptyProject = { icon: "Code2", title: "", desc: "", tags: "", repo: "", repoLabel: "View Code" };

function setIn(setter, path, value) {
  setter((prev) => {
    const next = structuredClone(prev);
    const parts = path.split(".");
    let cursor = next;
    for (let i = 0; i < parts.length - 1; i += 1) cursor = cursor[parts[i]];
    cursor[parts[parts.length - 1]] = value;
    return next;
  });
}

export default function Admin() {
  const navigate = useNavigate();
  const { site, reload } = useSiteContent();
  const [tab, setTab] = useState("design");
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [traffic, setTraffic] = useState(null);
  const [jobForm, setJobForm] = useState(null);
  const [jobIndex, setJobIndex] = useState(-1);
  const [projectForm, setProjectForm] = useState(null);
  const [projectIndex, setProjectIndex] = useState(-1);
  const [uploading, setUploading] = useState(false);
  const [inbox, setInbox] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("sps-admin-token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/me", { headers: authHeaders() }).then(async (response) => {
      if (!response.ok) {
        localStorage.removeItem("sps-admin-token");
        navigate("/login");
        return;
      }
      const next = await reload();
      setDraft(structuredClone(next));
      setReady(true);
    });
  }, [navigate, reload]);

  const themeKey = draft ? Object.values(draft.theme).join("|") : "";
  useEffect(() => {
    if (draft) applyTheme(draft.theme);
  }, [themeKey]);

  useEffect(() => () => applyTheme(site.theme), [site.theme]);

  useEffect(() => {
    if (tab !== "traffic" || !ready) return;
    fetch("/api/traffic", { headers: authHeaders() })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setTraffic(data));
  }, [tab, ready]);

  useEffect(() => {
    if (tab !== "inbox" || !ready) return;
    fetch("/api/messages", { headers: authHeaders() })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setInbox(data));
  }, [tab, ready]);

  const saveAll = async (nextDraft = draft) => {
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(nextDraft),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Save failed");
        return;
      }
      const fresh = await reload();
      setDraft(structuredClone(fresh));
      toast.success("Whole site updated");
    } catch {
      toast.error("Couldn't save right now");
    } finally {
      setSaving(false);
    }
  };

  const saveInbox = async () => {
    const email = String(draft.contact.inbox || "").trim();
    const response = await fetch("/api/inbox", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.detail || "Couldn't save that Gmail");
      return;
    }
    setInbox((current) => ({ ...(current || { messages: [] }), inbox: data.inbox }));
    toast.success("Messages will arrive at " + data.inbox);
  };

  const logout = () => {
    localStorage.removeItem("sps-admin-token");
    navigate("/login");
  };

  if (!ready || !draft) return null;

  const patch = (path, value) => setIn(setDraft, path, value);
  const uploadHero = async (file, kind) => {
    setUploading(true);
    try {
      const response = await fetch(`/api/upload?kind=${kind}`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/octet-stream" },
        body: file,
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Upload failed");
        return;
      }
      setDraft((prev) => {
        const next = structuredClone(prev);
        next.hero.visual = kind === "image" ? "image" : "model";
        if (kind === "image") next.hero.image = data.url;
        else next.hero.model = data.url;
        return next;
      });
      toast.success("File ready — hit Publish to site");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const maxBar = Math.max(1, ...(traffic?.last7 || []).map((day) => day.views));

  const saveJob = async (event) => {
    event.preventDefault();
    if (!jobForm.role.trim() || !jobForm.company.trim()) {
      toast.error("Role and company are required");
      return;
    }
    const job = {
      role: jobForm.role.trim(),
      company: jobForm.company.trim(),
      place: jobForm.place.trim(),
      period: jobForm.period.trim(),
      current: jobForm.current,
      bullets: jobForm.bullets.split("\n").map((line) => line.trim()).filter(Boolean),
      tags: jobForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    const experience = [...draft.experience];
    if (jobIndex >= 0) experience[jobIndex] = job;
    else experience.unshift(job);
    const next = { ...draft, experience };
    setDraft(next);
    setJobForm(null);
    setJobIndex(-1);
    await saveAll(next);
  };

  const saveProject = async (event) => {
    event.preventDefault();
    if (!projectForm.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    const project = {
      icon: projectForm.icon,
      title: projectForm.title.trim(),
      desc: projectForm.desc.trim(),
      tags: projectForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      repo: projectForm.repo.trim(),
      repoLabel: projectForm.repoLabel.trim() || "View Code",
    };
    const projects = [...draft.projects];
    if (projectIndex >= 0) projects[projectIndex] = { ...projects[projectIndex], ...project };
    else projects.push(project);
    const next = { ...draft, projects };
    setDraft(next);
    setProjectForm(null);
    setProjectIndex(-1);
    await saveAll(next);
  };

  return (
    <main className="adm-page" data-testid="admin-page">
      <div className="adm-wrap">
        <div className="adm-row">
          <div>
            <p className="adm-kicker">Dashboard</p>
            <h1 className="adm-title">CONTROL ROOM</h1>
            <p className="adm-sub">Every headline, card, color, and contact line on the portfolio.</p>
          </div>
          <div className="adm-actions">
            <Link to="/" className="adm-btn-ghost" style={{ textDecoration: "none" }}>View site</Link>
            <button className="adm-btn-ghost" type="button" onClick={logout} data-testid="admin-logout">Log out</button>
          </div>
        </div>

        <div className="adm-tabs">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`adm-tab ${tab === id ? "active" : ""}`}
              data-testid={`admin-tab-${id}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "design" && (
          <section className="adm-form glass" data-testid="admin-design">
            <p className="adm-kicker">Appearance</p>
            <div className="adm-actions">
              <button
                type="button"
                data-testid="theme-dark"
                className={`adm-tab ${(draft.theme.mode || "dark") !== "light" ? "active" : ""}`}
                onClick={() => patch("theme.mode", "dark")}
              >
                Dark
              </button>
              <button
                type="button"
                data-testid="theme-light"
                className={`adm-tab ${draft.theme.mode === "light" ? "active" : ""}`}
                onClick={() => patch("theme.mode", "light")}
              >
                Light
              </button>
            </div>
            <ColorRow label="Accent" value={draft.theme.cyan} onChange={(cyan) => patch("theme.cyan", cyan)} />
            <ColorRow label="Violet" value={draft.theme.violet} onChange={(violet) => patch("theme.violet", violet)} />
            <ColorRow label="Background" value={draft.theme.ink} onChange={(ink) => patch("theme.ink", ink)} />
            <ColorRow label="Cards" value={draft.theme.panel} onChange={(panel) => patch("theme.panel", panel)} />
            <p className="adm-sub">Dark and light update live here. Publish to keep the mode on the public site. Accent colors stay in both modes.</p>
          </section>
        )}

        {tab === "profile" && (
          <section className="adm-form glass">
            <div className="adm-grid-2">
              <Field label="Full name" value={draft.profile.name} onChange={(name) => patch("profile.name", name)} />
              <Field label="Role" value={draft.profile.role} onChange={(role) => patch("profile.role", role)} />
              <Field label="Brand" value={draft.profile.brand} onChange={(brand) => patch("profile.brand", brand)} />
              <Field label="Brand accent" value={draft.profile.brandAccent} onChange={(brandAccent) => patch("profile.brandAccent", brandAccent)} />
              <Field label="Email" value={draft.profile.email} onChange={(email) => patch("profile.email", email)} />
              <Field label="Phone" value={draft.profile.phone} onChange={(phone) => patch("profile.phone", phone)} />
              <Field label="Location" value={draft.profile.location} onChange={(location) => patch("profile.location", location)} />
              <Field label="Resume path" value={draft.profile.resume} onChange={(resume) => patch("profile.resume", resume)} />
              <Field label="GitHub URL" value={draft.profile.github} onChange={(github) => patch("profile.github", github)} />
              <Field label="GitHub label" value={draft.profile.githubLabel} onChange={(githubLabel) => patch("profile.githubLabel", githubLabel)} />
              <Field label="LinkedIn URL" value={draft.profile.linkedin} onChange={(linkedin) => patch("profile.linkedin", linkedin)} />
              <Field label="LinkedIn label" value={draft.profile.linkedinLabel} onChange={(linkedinLabel) => patch("profile.linkedinLabel", linkedinLabel)} />
              <Field label="Nav resume" value={draft.nav.resumeLabel} onChange={(resumeLabel) => patch("nav.resumeLabel", resumeLabel)} />
              <Field label="Nav talk button" value={draft.nav.talkLabel} onChange={(talkLabel) => patch("nav.talkLabel", talkLabel)} />
            </div>
            {draft.nav.links.map((link, index) => (
              <Field
                key={link.id}
                label={`Menu · ${link.id}`}
                value={link.label}
                onChange={(label) => {
                  const links = draft.nav.links.map((item, i) => (i === index ? { ...item, label } : item));
                  patch("nav.links", links);
                }}
              />
            ))}
          </section>
        )}

        {tab === "home" && (
          <section className="adm-form glass">
            <p className="adm-kicker">Hero character</p>
            <div className="adm-actions">
              <button type="button" className={`adm-tab ${draft.hero.visual !== "image" ? "active" : ""}`} onClick={() => patch("hero.visual", "model")}>3D robot</button>
              <button type="button" className={`adm-tab ${draft.hero.visual === "image" ? "active" : ""}`} onClick={() => patch("hero.visual", "image")}>Photo</button>
            </div>
            {draft.hero.visual === "image" ? (
              <>
                {draft.hero.image && (
                  <img src={draft.hero.image} alt="" style={{ width: 180, height: 180, objectFit: "contain" }} />
                )}
                <label className="adm-btn" style={{ width: "fit-content" }}>
                  {uploading ? "Uploading…" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) uploadHero(file, "image");
                    }}
                  />
                </label>
              </>
            ) : (
              <>
                <p className="adm-sub">Current model: {draft.hero.model || "/models/robot.glb"}</p>
                <div className="adm-actions">
                  <label className="adm-btn" style={{ width: "fit-content" }}>
                    {uploading ? "Uploading…" : "Replace .glb"}
                    <input
                      type="file"
                      accept=".glb,model/gltf-binary"
                      hidden
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) uploadHero(file, "model");
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="adm-btn-ghost"
                    onClick={() => {
                      patch("hero.visual", "model");
                      patch("hero.model", "/models/robot.glb");
                    }}
                  >
                    Use original robot
                  </button>
                </div>
              </>
            )}
            <Field label="Status badge" value={draft.hero.badge} onChange={(badge) => patch("hero.badge", badge)} />
            <div className="adm-grid-2">
              <Field label="Headline line 1" value={draft.hero.line1} onChange={(line1) => patch("hero.line1", line1)} />
              <Field label="Outline line" value={draft.hero.line2} onChange={(line2) => patch("hero.line2", line2)} />
              <Field label="Line 3 prefix" value={draft.hero.line3} onChange={(line3) => patch("hero.line3", line3)} />
              <Field label="Gradient word" value={draft.hero.accent} onChange={(accent) => patch("hero.accent", accent)} />
              <Field label="Explore button" value={draft.hero.explore} onChange={(explore) => patch("hero.explore", explore)} />
              <Field label="Resume button" value={draft.hero.resume} onChange={(resume) => patch("hero.resume", resume)} />
              <Field label="Scroll label" value={draft.hero.scroll} onChange={(scroll) => patch("hero.scroll", scroll)} />
              <Field label="Rotate hint" value={draft.hero.rotate} onChange={(rotate) => patch("hero.rotate", rotate)} />
            </div>
            <Area label="Intro paragraph" value={draft.hero.bio} onChange={(bio) => patch("hero.bio", bio)} />
            <Area label="Floating chips, one per line" value={draft.hero.chips.join("\n")} onChange={(text) => patch("hero.chips", text.split("\n"))} />
            <Area label="Marquee words, one per line" value={draft.marquee.join("\n")} onChange={(text) => patch("marquee", text.split("\n"))} />
            <p className="adm-kicker">Metric cards</p>
            {draft.metrics.map((metric, index) => (
              <div className="adm-grid-2" key={index}>
                <Field label="Value" value={metric.value} onChange={(value) => patch("metrics", draft.metrics.map((item, i) => i === index ? { ...item, value } : item))} />
                <Field label="Label" value={metric.label} onChange={(label) => patch("metrics", draft.metrics.map((item, i) => i === index ? { ...item, label } : item))} />
                <Field label="Caption" value={metric.sub} onChange={(sub) => patch("metrics", draft.metrics.map((item, i) => i === index ? { ...item, sub } : item))} />
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("metrics", [...draft.metrics, { value: "1", label: "New", sub: "caption" }])}>Add metric</button>
          </section>
        )}

        {tab === "about" && (
          <section className="adm-form glass">
            <HeadingFields value={draft.about} onChange={(about) => setDraft({ ...draft, about: { ...draft.about, ...about } })} />
            <div className="adm-grid-2">
              <Field label="Lead before highlight" value={draft.about.leadBefore} onChange={(leadBefore) => patch("about.leadBefore", leadBefore)} />
              <Field label="Cyan highlight" value={draft.about.leadCyan} onChange={(leadCyan) => patch("about.leadCyan", leadCyan)} />
              <Field label="Between highlights" value={draft.about.leadMid} onChange={(leadMid) => patch("about.leadMid", leadMid)} />
              <Field label="Violet highlight" value={draft.about.leadViolet} onChange={(leadViolet) => patch("about.leadViolet", leadViolet)} />
            </div>
            <Area label="Rest of lead" value={draft.about.leadAfter} onChange={(leadAfter) => patch("about.leadAfter", leadAfter)} />
            <Area label="Second paragraph" value={draft.about.body} onChange={(body) => patch("about.body", body)} />
            <div className="adm-grid-2">
              <Field label="Photo badge" value={draft.about.eduLabel} onChange={(eduLabel) => patch("about.eduLabel", eduLabel)} />
              <Field label="Photo title" value={draft.about.eduTitle} onChange={(eduTitle) => patch("about.eduTitle", eduTitle)} />
              <Field label="Photo meta" value={draft.about.eduMeta} onChange={(eduMeta) => patch("about.eduMeta", eduMeta)} />
              <Field label="Terminal title" value={draft.about.terminalTitle} onChange={(terminalTitle) => patch("about.terminalTitle", terminalTitle)} />
            </div>
            <p className="adm-kicker">About cards</p>
            {draft.about.cards.map((card, index) => (
              <div className="adm-item glass" key={index}>
                <div className="adm-grid-2">
                  <Field label="Number" value={card.num} onChange={(num) => patch("about.cards", draft.about.cards.map((item, i) => i === index ? { ...item, num } : item))} />
                  <Field label="Title" value={card.title} onChange={(title) => patch("about.cards", draft.about.cards.map((item, i) => i === index ? { ...item, title } : item))} />
                </div>
                <Area label="Description" value={card.desc} onChange={(desc) => patch("about.cards", draft.about.cards.map((item, i) => i === index ? { ...item, desc } : item))} />
                <button className="adm-btn-danger" type="button" onClick={() => patch("about.cards", draft.about.cards.filter((_, i) => i !== index))}>Delete card</button>
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("about.cards", [...draft.about.cards, { num: "04", title: "New card", desc: "" }])}>Add about card</button>
            <p className="adm-kicker">Terminal</p>
            {draft.about.terminal.map((line, index) => (
              <div className="adm-grid-2" key={index}>
                <div className="adm-field">
                  <label>Tone</label>
                  <select value={line.tone} onChange={(e) => patch("about.terminal", draft.about.terminal.map((item, i) => i === index ? { ...item, tone: e.target.value } : item))}>
                    <option value="cmd">command</option>
                    <option value="out">output</option>
                    <option value="ok">success</option>
                  </select>
                </div>
                <Field label="Line" value={line.text} onChange={(text) => patch("about.terminal", draft.about.terminal.map((item, i) => i === index ? { ...item, text } : item))} />
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("about.terminal", [...draft.about.terminal, { tone: "cmd", text: "$ " }])}>Add terminal line</button>
          </section>
        )}

        {tab === "skills" && (
          <section className="adm-form glass">
            <HeadingFields value={draft.skills} onChange={(skills) => setDraft({ ...draft, skills: { ...draft.skills, ...skills } })} />
            {draft.skills.groups.map((group, index) => (
              <div className="adm-item glass" key={index}>
                <div className="adm-grid-2">
                  <Field label="Group" value={group.title} onChange={(title) => patch("skills.groups", draft.skills.groups.map((item, i) => i === index ? { ...item, title } : item))} />
                  <div className="adm-field">
                    <label>Icon</label>
                    <select value={group.icon} onChange={(e) => patch("skills.groups", draft.skills.groups.map((item, i) => i === index ? { ...item, icon: e.target.value } : item))}>
                      {SKILL_ICONS.map((icon) => <option key={icon}>{icon}</option>)}
                    </select>
                  </div>
                </div>
                {group.skills.map((skill, si) => (
                  <div className="adm-grid-2" key={si}>
                    <Field label="Skill" value={skill.name} onChange={(name) => {
                      const skills = group.skills.map((item, i) => i === si ? { ...item, name } : item);
                      patch("skills.groups", draft.skills.groups.map((item, i) => i === index ? { ...item, skills } : item));
                    }} />
                    <div className="adm-field">
                      <label>Level 1–5</label>
                      <select value={skill.level} onChange={(e) => {
                        const skills = group.skills.map((item, i) => i === si ? { ...item, level: Number(e.target.value) } : item);
                        patch("skills.groups", draft.skills.groups.map((item, i) => i === index ? { ...item, skills } : item));
                      }}>
                        {[1, 2, 3, 4, 5].map((level) => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                <div className="adm-actions">
                  <button className="adm-btn-ghost" type="button" onClick={() => {
                    const skills = [...group.skills, { name: "New skill", level: 3 }];
                    patch("skills.groups", draft.skills.groups.map((item, i) => i === index ? { ...item, skills } : item));
                  }}>Add skill</button>
                  <button className="adm-btn-danger" type="button" onClick={() => patch("skills.groups", draft.skills.groups.filter((_, i) => i !== index))}>Delete group</button>
                </div>
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("skills.groups", [...draft.skills.groups, { icon: "Code2", title: "New group", skills: [{ name: "Skill", level: 3 }] }])}>Add skill group</button>
          </section>
        )}

        {tab === "jobs" && (
          <section>
            <HeadingFields value={draft.journey} onChange={(journey) => setDraft({ ...draft, journey: { ...draft.journey, ...journey } })} />
            <Field label="Education label" value={draft.journey.educationLabel} onChange={(educationLabel) => patch("journey.educationLabel", educationLabel)} />
            <button className="adm-btn" type="button" data-testid="admin-add-job" style={{ margin: "16px 0" }} onClick={() => { setJobIndex(-1); setJobForm({ ...emptyJob }); }}>Add job</button>
            {jobForm && (
              <form className="adm-form glass" onSubmit={saveJob} data-testid="admin-job-form">
                <div className="adm-grid-2">
                  <Field label="Role" value={jobForm.role} onChange={(role) => setJobForm({ ...jobForm, role })} testid="job-role" />
                  <Field label="Company" value={jobForm.company} onChange={(company) => setJobForm({ ...jobForm, company })} testid="job-company" />
                  <Field label="Place" value={jobForm.place} onChange={(place) => setJobForm({ ...jobForm, place })} />
                  <Field label="Period" value={jobForm.period} onChange={(period) => setJobForm({ ...jobForm, period })} testid="job-period" />
                </div>
                <Field label="Tags, comma separated" value={jobForm.tags} onChange={(tags) => setJobForm({ ...jobForm, tags })} />
                <Area label="Bullets, one per line" value={jobForm.bullets} onChange={(bullets) => setJobForm({ ...jobForm, bullets })} testid="job-bullets" />
                <label className="adm-check">
                  <input type="checkbox" checked={jobForm.current} onChange={(e) => setJobForm({ ...jobForm, current: e.target.checked })} />
                  Current role
                </label>
                <div className="adm-actions">
                  <button className="adm-btn" type="submit" disabled={saving} data-testid="job-save">{jobIndex >= 0 ? "Save job" : "Add job card"}</button>
                  <button className="adm-btn-ghost" type="button" onClick={() => setJobForm(null)}>Cancel</button>
                </div>
              </form>
            )}
            <div className="adm-list">
              {draft.experience.map((job, index) => (
                <article key={`${job.company}-${index}`} className="adm-item glass adm-row" data-testid={`admin-job-${index}`}>
                  <div>
                    <h3>{job.role}</h3>
                    <p className="adm-meta">{job.company} · {job.period}</p>
                  </div>
                  <div className="adm-actions">
                    <button className="adm-btn-ghost" type="button" data-testid={`admin-edit-job-${index}`} onClick={() => { setJobIndex(index); setJobForm({ ...job, bullets: (job.bullets || []).join("\n"), tags: (job.tags || []).join(", ") }); }}>Edit</button>
                    <button className="adm-btn-danger" type="button" onClick={() => { const next = { ...draft, experience: draft.experience.filter((_, i) => i !== index) }; setDraft(next); saveAll(next); }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "education" && (
          <section className="adm-form glass">
            {draft.education.map((item, index) => (
              <div className="adm-item glass" key={index}>
                <Field label="Title" value={item.title} onChange={(title) => patch("education", draft.education.map((row, i) => i === index ? { ...row, title } : row))} />
                <Field label="School" value={item.org} onChange={(org) => patch("education", draft.education.map((row, i) => i === index ? { ...row, org } : row))} />
                <Field label="Meta" value={item.meta} onChange={(meta) => patch("education", draft.education.map((row, i) => i === index ? { ...row, meta } : row))} />
                <label className="adm-check">
                  <input type="checkbox" checked={Boolean(item.highlight)} onChange={(e) => patch("education", draft.education.map((row, i) => i === index ? { ...row, highlight: e.target.checked } : row))} />
                  Highlight this card
                </label>
                <button className="adm-btn-danger" type="button" onClick={() => patch("education", draft.education.filter((_, i) => i !== index))}>Delete</button>
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("education", [...draft.education, { title: "New school", org: "", meta: "", highlight: false }])}>Add education</button>
          </section>
        )}

        {tab === "projects" && (
          <section>
            <HeadingFields value={draft.projectsSection} onChange={(projectsSection) => setDraft({ ...draft, projectsSection: { ...draft.projectsSection, ...projectsSection } })} />
            <Field label="GitHub line" value={draft.projectsSection.more} onChange={(more) => patch("projectsSection.more", more)} />
            <button className="adm-btn" type="button" data-testid="admin-add-project" style={{ margin: "16px 0" }} onClick={() => { setProjectIndex(-1); setProjectForm({ ...emptyProject }); }}>Add project</button>
            {projectForm && (
              <form className="adm-form glass" onSubmit={saveProject} data-testid="admin-project-form">
                <div className="adm-grid-2">
                  <Field label="Title" value={projectForm.title} onChange={(title) => setProjectForm({ ...projectForm, title })} testid="project-title" />
                  <div className="adm-field">
                    <label>Icon</label>
                    <select value={projectForm.icon} onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}>
                      {PROJECT_ICONS.map((icon) => <option key={icon}>{icon}</option>)}
                    </select>
                  </div>
                </div>
                <Area label="Description" value={projectForm.desc} onChange={(desc) => setProjectForm({ ...projectForm, desc })} testid="project-desc" />
                <div className="adm-grid-2">
                  <Field label="Tags, comma separated" value={projectForm.tags} onChange={(tags) => setProjectForm({ ...projectForm, tags })} />
                  <Field label="Button label" value={projectForm.repoLabel} onChange={(repoLabel) => setProjectForm({ ...projectForm, repoLabel })} />
                  <Field label="Link" value={projectForm.repo} onChange={(repo) => setProjectForm({ ...projectForm, repo })} testid="project-repo" />
                </div>
                <div className="adm-actions">
                  <button className="adm-btn" type="submit" disabled={saving} data-testid="project-save">{projectIndex >= 0 ? "Save project" : "Publish project"}</button>
                  <button className="adm-btn-ghost" type="button" onClick={() => setProjectForm(null)}>Cancel</button>
                </div>
              </form>
            )}
            <div className="adm-list">
              {draft.projects.map((project, index) => (
                <article key={`${project.title}-${index}`} className="adm-item glass adm-row">
                  <div>
                    <h3>{project.num} · {project.title}</h3>
                    <p className="adm-meta">{(project.tags || []).join(" · ")}</p>
                  </div>
                  <div className="adm-actions">
                    <button className="adm-btn-ghost" type="button" onClick={() => { setProjectIndex(index); setProjectForm({ ...project, tags: (project.tags || []).join(", ") }); }}>Edit</button>
                    <button className="adm-btn-danger" type="button" onClick={() => { const next = { ...draft, projects: draft.projects.filter((_, i) => i !== index) }; setDraft(next); saveAll(next); }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "wins" && (
          <section className="adm-form glass">
            <HeadingFields value={draft.achievementsSection} onChange={(achievementsSection) => setDraft({ ...draft, achievementsSection: { ...draft.achievementsSection, ...achievementsSection } })} />
            {draft.achievements.map((item, index) => (
              <div className="adm-item glass" key={index}>
                <div className="adm-grid-2">
                  <Field label="Title" value={item.title} onChange={(title) => patch("achievements", draft.achievements.map((row, i) => i === index ? { ...row, title } : row))} />
                  <div className="adm-field">
                    <label>Icon</label>
                    <select value={item.icon} onChange={(e) => patch("achievements", draft.achievements.map((row, i) => i === index ? { ...row, icon: e.target.value } : row))}>
                      {WIN_ICONS.map((icon) => <option key={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <Field label="Organization" value={item.org} onChange={(org) => patch("achievements", draft.achievements.map((row, i) => i === index ? { ...row, org } : row))} />
                  <Field label="Meta" value={item.meta} onChange={(meta) => patch("achievements", draft.achievements.map((row, i) => i === index ? { ...row, meta } : row))} />
                </div>
                <label className="adm-check">
                  <input type="checkbox" checked={Boolean(item.gold)} onChange={(e) => patch("achievements", draft.achievements.map((row, i) => i === index ? { ...row, gold: e.target.checked } : row))} />
                  Gold highlight
                </label>
                <button className="adm-btn-danger" type="button" onClick={() => patch("achievements", draft.achievements.filter((_, i) => i !== index))}>Delete</button>
              </div>
            ))}
            <button className="adm-btn-ghost" type="button" onClick={() => patch("achievements", [...draft.achievements, { icon: "Award", title: "New win", org: "", meta: "Certified", gold: false }])}>Add win</button>
          </section>
        )}

        {tab === "footer" && (
          <section className="adm-form glass">
            <div className="adm-grid-2">
              <Field label="Index" value={draft.footer.index} onChange={(index) => patch("footer.index", index)} />
              <Field label="Eyebrow" value={draft.footer.eyebrow} onChange={(eyebrow) => patch("footer.eyebrow", eyebrow)} />
              <Field label="Title" value={draft.footer.title} onChange={(title) => patch("footer.title", title)} />
              <Field label="Gradient line" value={draft.footer.accent} onChange={(accent) => patch("footer.accent", accent)} />
              <Field label="Conversation button" value={draft.footer.cta} onChange={(cta) => patch("footer.cta", cta)} />
              <Field label="Resume button" value={draft.footer.resume} onChange={(resume) => patch("footer.resume", resume)} />
              <Field label="Credit line" value={draft.footer.credit} onChange={(credit) => patch("footer.credit", credit)} />
              <Field label="Accent word" value={draft.footer.wordA} onChange={(wordA) => patch("footer.wordA", wordA)} />
              <Field label="Second word" value={draft.footer.wordB} onChange={(wordB) => patch("footer.wordB", wordB)} />
            </div>
            <Area label="Blurb" value={draft.footer.blurb} onChange={(blurb) => patch("footer.blurb", blurb)} />
          </section>
        )}

        {tab === "contact" && (
          <section className="adm-form glass">
            <div className="adm-grid-2">
              <Field label="Back link" value={draft.contact.back} onChange={(back) => patch("contact.back", back)} />
              <Field label="Line 1" value={draft.contact.line1} onChange={(line1) => patch("contact.line1", line1)} />
              <Field label="Outline line" value={draft.contact.line2} onChange={(line2) => patch("contact.line2", line2)} />
              <Field label="Form title" value={draft.contact.formTitle} onChange={(formTitle) => patch("contact.formTitle", formTitle)} />
              <Field label="Send button" value={draft.contact.send} onChange={(send) => patch("contact.send", send)} />
              <Field label="Sending label" value={draft.contact.sending} onChange={(sending) => patch("contact.sending", sending)} />
              <Field label="Resume button" value={draft.contact.resume} onChange={(resume) => patch("contact.resume", resume)} />
            </div>
            <Area label="Form note" value={draft.contact.formBlurb} onChange={(formBlurb) => patch("contact.formBlurb", formBlurb)} />
            <Area label="Subjects, one per line" value={(draft.contact.subjects || []).join("\n")} onChange={(text) => patch("contact.subjects", text.split("\n"))} />
          </section>
        )}

        {tab === "traffic" && (
          <section data-testid="admin-traffic">
            <div className="adm-stats">
              <div className="adm-stat glass"><strong data-testid="traffic-total">{traffic?.totalViews ?? "—"}</strong><span>Page views</span></div>
              <div className="adm-stat glass"><strong data-testid="traffic-unique">{traffic?.uniqueVisitors ?? "—"}</strong><span>Unique visitors</span></div>
              <div className="adm-stat glass"><strong data-testid="traffic-today">{traffic?.todayViews ?? "—"}</strong><span>Views today</span></div>
            </div>
            <div className="glass adm-bars">
              {(traffic?.last7 || []).map((day) => (
                <div className="adm-bar" key={day.date}>
                  <i style={{ height: `${Math.max(6, (day.views / maxBar) * 100)}%` }} />
                  <em>{day.date.slice(5)}</em>
                </div>
              ))}
            </div>
            <div className="glass" style={{ padding: 18, marginTop: 14 }}>
              <table className="adm-table">
                <thead><tr><th>Page</th><th>Views</th></tr></thead>
                <tbody>
                  {(traffic?.pages || []).map((page) => <tr key={page.path}><td>{page.path}</td><td>{page.views}</td></tr>)}
                  {!traffic?.pages?.length && <tr><td colSpan={2}>No visits yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "inbox" && (
          <section data-testid="admin-inbox">
            <div className="adm-form glass">
              <p className="adm-kicker">Delivery</p>
              {inbox && inbox.mailReady === false && (
                <p className="adm-error" data-testid="mail-not-ready">
                  Mail is not leaving yet. In .env, paste a Gmail App Password after SMTP_PASS= and save the file.
                </p>
              )}
              <Field
                label="Messages arrive at"
                value={draft.contact.inbox}
                testid="admin-inbox-email"
                onChange={(value) => patch("contact.inbox", value)}
              />
              <p className="adm-sub" style={{ marginTop: 0 }}>
                The sender name is always Shaurya.dev. This Gmail is only where the message lands.
              </p>
              <div className="adm-actions">
                <button className="adm-btn" type="button" data-testid="admin-inbox-save" onClick={saveInbox}>Save Gmail</button>
              </div>
            </div>
            <p className="adm-kicker">Email template</p>
            <iframe
              title="Email template"
              className="adm-preview"
              data-testid="email-preview"
              srcDoc={contactMail({
                name: "Ada Lovelace",
                email: "ada@studio.dev",
                subject: "Collaboration",
                message: "I have an AI product that needs a sharp engineer. Can we talk this week?",
                theme: draft.theme,
              }).html}
            />
            <div className="adm-list" style={{ marginTop: 18 }}>
              {(inbox?.messages || []).map((item) => (
                <article key={item.id} className="adm-item glass" data-testid="inbox-message">
                  <p className="adm-kicker">Shaurya.dev</p>
                  <h3>{item.name}</h3>
                  <p className="adm-meta">{item.email} · {item.subject}</p>
                  <p className="adm-sub" style={{ whiteSpace: "pre-wrap" }}>{item.message}</p>
                  <p className="adm-meta">{new Date(item.ts).toLocaleString()}</p>
                  <div className="adm-actions" style={{ marginTop: 12 }}>
                    <a className="adm-btn-ghost" style={{ textDecoration: "none" }} href={`mailto:${item.email}?subject=${encodeURIComponent("Re: " + item.subject)}`}>Reply</a>
                  </div>
                </article>
              ))}
              {inbox && !inbox.messages?.length && <p className="adm-sub">No messages yet.</p>}
            </div>
          </section>
        )}

        {tab !== "traffic" && tab !== "inbox" && (
          <div className="adm-savebar">
            <button className="adm-btn" type="button" disabled={saving} data-testid="admin-publish" onClick={() => saveAll()}>
              {saving ? "Publishing…" : "Publish to site"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange, testid }) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      <input data-testid={testid} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange, testid }) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      <textarea data-testid={testid} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function HeadingFields({ value, onChange }) {
  return (
    <div className="adm-grid-2">
      <Field label="Index" value={value.index} onChange={(index) => onChange({ ...value, index })} />
      <Field label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
      <Field label="Title" value={value.title} onChange={(title) => onChange({ ...value, title })} />
      <Field label="Accent line" value={value.accent} onChange={(accent) => onChange({ ...value, accent })} />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#000000";
  return (
    <label className="adm-color">
      <input type="color" value={safe} onChange={(e) => onChange(e.target.value)} />
      <span style={{ width: 110 }}>{label}</span>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
