function norm(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(q, words) {
  return words.some((w) => q.includes(w));
}

export const AGENT_PROMPTS = [
  "Who is Shaurya?",
  "What projects has he built?",
  "What are his skills?",
  "Where does he work?",
  "How can I contact him?",
];

export function buildPortfolioBrief(site) {
  const p = site.profile || {};
  const projects = (site.projects || [])
    .map((item) => `- ${item.title}: ${item.desc} (${(item.tags || []).join(", ")})`)
    .join("\n");
  const jobs = (site.experience || [])
    .map((job) => `- ${job.role} @ ${job.company} (${job.period}): ${(job.bullets || []).join(" ")}`)
    .join("\n");
  const skills = (site.skills?.groups || [])
    .map((g) => `${g.title}: ${(g.skills || []).map((s) => s.name).join(", ")}`)
    .join("\n");
  const wins = (site.achievements || [])
    .map((a) => `- ${a.title} · ${a.org} (${a.meta})`)
    .join("\n");
  const edu = (site.education || [])
    .map((e) => `- ${e.title} · ${e.org} · ${e.meta}`)
    .join("\n");

  return [
    `Name: ${p.name}`,
    `Role: ${p.role}`,
    `Location: ${p.location}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `GitHub: ${p.github}`,
    `LinkedIn: ${p.linkedin}`,
    `Resume: ${p.resume}`,
    `Bio: ${site.hero?.bio || ""}`,
    `About: ${[site.about?.leadBefore, site.about?.leadCyan, site.about?.leadMid, site.about?.leadViolet, site.about?.leadAfter].filter(Boolean).join(" ")} ${site.about?.body || ""}`,
    `Skills:\n${skills}`,
    `Experience:\n${jobs}`,
    `Education:\n${edu}`,
    `Projects:\n${projects}`,
    `Achievements:\n${wins}`,
  ].join("\n\n");
}

export function answerFromPortfolio(site, question) {
  const q = norm(question);
  const p = site.profile || {};
  const name = p.name || "Shaurya Pratap Singh";
  const first = p.firstName || name.split(" ")[0];

  if (!q || q.length < 2) {
    return `Ask me anything about ${first} — skills, projects, experience, education, or how to contact him.`;
  }

  if (has(q, ["hello", "hey", "namaste", "good morning", "good evening"]) || q === "hi" || q.startsWith("hi ")) {
    return `Hey! I'm ${first}'s portfolio agent. I can walk you through his AI/ML work, projects, experience, and how to reach him. What would you like to know?`;
  }

  if (has(q, ["who are you", "what are you", "your name", "agent"])) {
    return `I'm the on-site AI guide for ${name}'s portfolio. I answer from his real profile, projects, and experience — not random web guesses.`;
  }

  if (has(q, ["contact", "email", "phone", "reach", "hire", "linkedin", "github", "resume", "cv"])) {
    return [
      `Here's how to reach ${first}:`,
      `• Email: ${p.email}`,
      `• Phone: ${p.phone}`,
      `• LinkedIn: ${p.linkedin}`,
      `• GitHub: ${p.github}`,
      `• Resume: available via the Download Resume button on this page`,
      `He's open to AI/ML and software roles — the Contact page also sends a message straight to his inbox.`,
    ].join("\n");
  }

  if (has(q, ["project", "built", "github", "samridh", "crm", "resume analyzer", "rag", "chatbot", "eva", "pdf"])) {
    const lines = (site.projects || []).map((item) => {
      const link = item.repo ? `\n  ${item.repoLabel || "Link"}: ${item.repo}` : "";
      return `• ${item.title}\n  ${item.desc}\n  Stack: ${(item.tags || []).join(", ")}${link}`;
    });
    return `Here are ${first}'s shipped projects:\n\n${lines.join("\n\n")}\n\nMore code lives on GitHub: ${p.github}`;
  }

  if (has(q, ["skill", "tech", "stack", "python", "react", "langchain", "dotnet", ".net", "language", "framework", "tool"])) {
    const groups = (site.skills?.groups || [])
      .map((g) => `• ${g.title}: ${(g.skills || []).map((s) => `${s.name} (${s.level}/5)`).join(", ")}`)
      .join("\n");
    return `${first}'s core stack focuses on Generative AI + full-stack engineering:\n\n${groups}\n\nHe works especially deep with GPT, Gemini, RAG, LangChain, Python, React, and .NET.`;
  }

  if (has(q, ["experience", "work", "job", "intern", "company", "cloudmex", "enjay", "ibm", "career", "journey"])) {
    const jobs = (site.experience || [])
      .map((job) => {
        const bullets = (job.bullets || []).map((b) => `  – ${b}`).join("\n");
        return `• ${job.role} @ ${job.company}\n  ${job.place} · ${job.period}${job.current ? " (current)" : ""}\n${bullets}`;
      })
      .join("\n\n");
    return `${first}'s experience timeline:\n\n${jobs}`;
  }

  if (has(q, ["education", "college", "cgpa", "degree", "study", "school", "university", "laxmi"])) {
    const edu = (site.education || [])
      .map((e) => `• ${e.title}\n  ${e.org}\n  ${e.meta}`)
      .join("\n\n");
    return `Education:\n\n${edu}\n\nHe's a Computer Engineering student with a strong 9/10 CGPA and hands-on AI product experience.`;
  }

  if (has(q, ["achieve", "award", "win", "certif", "hackathon", "podium", "code crasher", "brain buster"])) {
    const wins = (site.achievements || [])
      .map((a) => `• ${a.title} — ${a.org} (${a.meta})`)
      .join("\n");
    return `Proof of work:\n\n${wins}`;
  }

  if (has(q, ["about", "who is", "introduce", "bio", "background", "tell me about", "shaurya"])) {
    const aboutLead = [
      site.about?.leadBefore,
      site.about?.leadCyan,
      site.about?.leadMid,
      site.about?.leadViolet,
      site.about?.leadAfter,
    ]
      .filter(Boolean)
      .join(" ");
    return [
      `${name} is an ${p.role} based in ${p.location}.`,
      site.hero?.bio || "",
      aboutLead,
      site.about?.body || "",
      `Highlights: ${(site.metrics || []).map((m) => `${m.value} ${m.label}`).join(" · ")}.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (has(q, ["open to work", "available", "hiring", "looking for", "role", "job opportunity"])) {
    return `${first} is open to AI/ML and software engineering roles. You can email ${p.email}, message on LinkedIn (${p.linkedin}), or use the Contact page on this site.`;
  }

  const projectHit = (site.projects || []).find((item) => {
    const blob = norm(`${item.title} ${item.desc} ${(item.tags || []).join(" ")}`);
    return q.split(" ").filter((w) => w.length > 3).some((w) => blob.includes(w));
  });
  if (projectHit) {
    return `That maps to ${projectHit.title}:\n\n${projectHit.desc}\n\nStack: ${(projectHit.tags || []).join(", ")}${
      projectHit.repo ? `\nCode: ${projectHit.repo}` : ""
    }\n\nWant details on another project, his skills, or how to contact him?`;
  }

  return [
    `I can cover ${first}'s background in detail. Try asking about:`,
    `• Who he is / his background`,
    `• Projects (CRM, Resume Analyzer, RAG chatbot, Eva)`,
    `• Skills & tech stack`,
    `• Work experience & education`,
    `• Awards or how to contact him`,
    `Ask in plain English — I'll answer from his portfolio data.`,
  ].join("\n");
}

export async function answerWithGemini(site, question, apiKey) {
  const brief = buildPortfolioBrief(site);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "You are Shaurya's portfolio AI agent on shaurya-dev.onrender.com.",
                  "Answer ONLY using the portfolio brief below. Be warm, clear, and specific.",
                  "If something is missing from the brief, say you don't have that detail and point them to Contact.",
                  "Keep answers under 180 words unless listing projects/skills.",
                  "",
                  "PORTFOLIO BRIEF:",
                  brief,
                  "",
                  `Visitor question: ${question}`,
                ].join("\n"),
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 450 },
      }),
      signal: AbortSignal.timeout(20000),
    },
  );
  const data = await response.json().catch(() => ({}));
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n");
  if (!response.ok || !text) {
    throw new Error(data?.error?.message || `gemini ${response.status}`);
  }
  return text.trim();
}
