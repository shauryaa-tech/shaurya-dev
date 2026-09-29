import {
  PROFILE,
  METRICS,
  MARQUEE_ITEMS,
  ABOUT_CARDS,
  TERMINAL_LINES,
  SKILL_GROUPS,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  ACHIEVEMENTS,
} from "./data";

export const DEFAULT_SITE = {
  theme: {
    mode: "dark",
    cyan: "#00f0ff",
    violet: "#a855f7",
    ink: "#030712",
    panel: "#0b0f19",
  },
  profile: {
    ...PROFILE,
    brand: "SHAURYA",
    brandAccent: ".DEV",
    githubLabel: "github.com/shauryaa-tech",
    linkedinLabel: "linkedin.com/in/shaurya-pratap-singh-8240ba344",
  },
  nav: {
    links: [
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "journey", label: "Journey" },
      { id: "projects", label: "Projects" },
    ],
    resumeLabel: "Resume",
    talkLabel: "Let's Talk",
    mobileResume: "Download Resume",
  },
  hero: {
    badge: "Open to AI/ML & Software roles",
    line1: "I TEACH",
    line2: "MACHINES",
    line3: "TO",
    accent: "THINK.",
    bio: "AI/ML Engineer & Software Engineer from Vapi, India — shipping Generative AI systems, RAG chatbots and intelligent automation that actually work in production.",
    explore: "Explore My Work",
    resume: "Download Resume",
    scroll: "Scroll",
    rotate: "Drag to rotate",
    chips: ["GPT", "RAG", ".NET", "Gemini"],
    visual: "model",
    model: "/models/robot.glb",
    image: "",
  },
  metrics: METRICS,
  marquee: MARQUEE_ITEMS,
  about: {
    index: "01",
    eyebrow: "About",
    title: "THE HUMAN BEHIND",
    accent: "THE MACHINE",
    leadBefore: "I'm an ",
    leadCyan: "AI/ML Engineer",
    leadMid: " and ",
    leadViolet: "Software Engineer",
    leadAfter:
      " with hands-on experience building scalable machine-learning systems, Generative AI solutions and .NET applications.",
    body: "From CRM automation to RAG-based chatbots and intelligent document processing, I turn real business problems into working AI products. I publish my AI/ML and Generative AI projects on GitHub, practice Data Structures & Algorithms regularly, and constantly explore emerging AI frameworks and tools.",
    eduLabel: "Education",
    eduTitle: "B.E. Computer Engineering · CGPA 9/10",
    eduMeta: "Laxmi Institute of Technology · 2022—2026",
    cards: ABOUT_CARDS,
    terminalTitle: "shaurya@ai-lab: ~",
    terminal: TERMINAL_LINES,
  },
  skills: {
    index: "02",
    eyebrow: "Skills",
    title: "TECHNOLOGICAL",
    accent: "ARSENAL",
    groups: SKILL_GROUPS,
  },
  journey: {
    index: "03",
    eyebrow: "Journey",
    title: "EXPERIENCE",
    accent: "TIMELINE",
    educationLabel: "// Education",
  },
  experience: EXPERIENCE,
  education: EDUCATION,
  projectsSection: {
    index: "04",
    eyebrow: "Projects",
    title: "SHIPPED &",
    accent: "PUBLISHED",
    more: "More on GitHub — github.com/shauryaa-tech",
  },
  projects: PROJECTS,
  achievementsSection: {
    index: "05",
    eyebrow: "Proof of Work",
    title: "WINS &",
    accent: "CERTIFICATIONS",
  },
  achievements: ACHIEVEMENTS,
  footer: {
    index: "06",
    eyebrow: "Contact",
    title: "LET'S BUILD SOMETHING",
    accent: "INTELLIGENT.",
    blurb: "Have an AI idea, a role, or a project that needs engineering? My inbox is open.",
    cta: "Start a Conversation",
    resume: "Resume PDF",
    credit: "Designed & engineered with",
    wordA: "circuits",
    wordB: "coffee",
  },
  contact: {
    back: "Back to portfolio",
    line1: "LET'S",
    line2: "CONNECT.",
    formTitle: "Drop a message",
    formBlurb: "Lands straight in my inbox — I usually reply within a day.",
    send: "Send Message",
    sending: "Sending…",
    resume: "Download Resume",
    inbox: "shaurya13822@gmail.com",
    subjects: ["Full-Time Role", "Internship", "Freelance / Project", "Collaboration", "Just saying hi"],
  },
};

export function mergeSite(override) {
  const merge = (base, extra) => {
    if (Array.isArray(extra)) return extra;
    if (extra && typeof extra === "object" && base && typeof base === "object" && !Array.isArray(base)) {
      const out = { ...base };
      for (const key of Object.keys(extra)) out[key] = merge(base[key], extra[key]);
      return out;
    }
    return extra === undefined ? base : extra;
  };
  return merge(DEFAULT_SITE, override || {});
}
