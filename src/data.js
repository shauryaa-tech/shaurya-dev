export const PROFILE = {
  name: "Shaurya Pratap Singh",
  firstName: "Shaurya",
  role: "AI/ML Engineer & Software Engineer",
  location: "Vapi, Gujarat, India",
  email: "shauryasingh2222004@gmail.com",
  phone: "+91 78978 58298",
  linkedin: "https://www.linkedin.com/in/shaurya-pratap-singh-8240ba344/",
  github: "https://github.com/shauryaa-tech",
  resume: "/Shaurya_Pratap_Singh_Resume.pdf",
};

export const METRICS = [
  { value: "9/10", label: "CGPA", sub: "Computer Engineering" },
  { value: "4", label: "AI Projects", sub: "shipped & published" },
  { value: "2x", label: "Podiums", sub: "national hackathons" },
];

export const MARQUEE_ITEMS = [
  "ARTIFICIAL INTELLIGENCE",
  "GENERATIVE AI",
  "RAG SYSTEMS",
  "PYTHON",
  "REACT.JS",
  ".NET",
  "LANGCHAIN",
  "PROMPT ENGINEERING",
  "NLP",
  "MONGODB",
];

export const ABOUT_CARDS = [
  {
    num: "01",
    title: "Generative AI Systems",
    desc: "RAG chatbots, GPT & Gemini integrations, LangChain pipelines and prompt engineering that reduce hallucination and ship real value.",
  },
  {
    num: "02",
    title: "Full-Stack Engineering",
    desc: ".NET, React.js, Flask and PHP — from database schema to polished UI, with MongoDB, MySQL and SQL Server underneath.",
  },
  {
    num: "03",
    title: "Intelligent Automation",
    desc: "OCR document pipelines, CRM workflow automation and no-code tooling with N8N, Zapier and Make that erase manual work.",
  },
];

export const TERMINAL_LINES = [
  { text: "$ whoami", tone: "cmd" },
  { text: "shaurya-pratap-singh — AI/ML & Software Engineer", tone: "out" },
  { text: "$ ls projects/", tone: "cmd" },
  { text: "samridh-crm  resume-analyzer  rag-pdf-chatbot  eva", tone: "out" },
  { text: "$ status --current", tone: "cmd" },
  { text: "[ok] open-to-work: true", tone: "ok" },
  { text: "[ok] learning: always", tone: "ok" },
];

export const SKILL_GROUPS = [
  {
    icon: "Brain",
    title: "Generative AI",
    skills: [
      { name: "OpenAI GPT", level: 5 },
      { name: "Google Gemini API", level: 5 },
      { name: "RAG", level: 5 },
      { name: "Prompt Engineering", level: 5 },
      { name: "LangChain", level: 4 },
      { name: "NLP / TF-IDF", level: 4 },
    ],
  },
  {
    icon: "Braces",
    title: "Languages",
    skills: [
      { name: "Python", level: 5 },
      { name: "C# / .NET", level: 4 },
      { name: "JavaScript", level: 4 },
      { name: "PHP", level: 3 },
    ],
  },
  {
    icon: "Code2",
    title: "Web Development",
    skills: [
      { name: "React.js", level: 4 },
      { name: "Flask", level: 4 },
      { name: ".NET", level: 4 },
      { name: "HTML / CSS", level: 4 },
    ],
  },
  {
    icon: "Database",
    title: "Databases",
    skills: [
      { name: "MongoDB", level: 4 },
      { name: "MySQL", level: 4 },
      { name: "SQL Server", level: 3 },
    ],
  },
  {
    icon: "Wrench",
    title: "Tools & Platforms",
    skills: [
      { name: "GitHub / VS Code", level: 5 },
      { name: "N8N / Zapier / Make", level: 4 },
      { name: "Postman", level: 4 },
      { name: "VAPI / XAMPP", level: 3 },
    ],
  },
];

export const EXPERIENCE = [
  {
    role: "Software Engineer (.NET)",
    company: "Cloudmex Technologies",
    place: "Vapi, Gujarat, India",
    period: "Jun 2026 — Present",
    current: true,
    bullets: [
      "Developing and maintaining applications using the .NET framework.",
      "Contributing to software development workflows and collaborating with the team on building and deploying business applications.",
    ],
    tags: [".NET", "C#", "SQL Server"],
  },
  {
    role: "AI/ML Intern",
    company: "Enjay IT Solutions Ltd",
    place: "India",
    period: "Jan 2026 — Apr 2026",
    bullets: [
      "Built an AI-powered Business Card Scanner leveraging OCR and AI to automatically extract, save and categorize contact details from physical cards.",
      "Implemented intelligent data processing pipelines for structured storage and retrieval of customer information in CRM workflows.",
      "Developed real-world AI/ML applications with Python, reducing manual processing time.",
    ],
    tags: ["Python", "OCR", "NLP", "CRM"],
  },
  {
    role: "AI Intern",
    company: "IBM SkillsBuild",
    place: "Remote",
    period: "Jun 2025 — Jul 2025",
    bullets: [
      "Built Eva, an interactive AI assistant using React.js and Google Gemini API with real-time dynamic UI interaction.",
      "Developed AI-powered applications using Python and Generative AI concepts as part of IBM's structured AI curriculum.",
      "Gained applied experience in ML workflows, REST APIs and real-time AI system integration.",
    ],
    tags: ["React.js", "Gemini API", "Python", "REST APIs"],
  },
];

export const EDUCATION = [
  {
    title: "B.E. — Computer Engineering",
    org: "Laxmi Institute of Technology",
    meta: "2022 — 2026 · CGPA 9/10",
    highlight: true,
  },
  {
    title: "Higher Secondary (12th)",
    org: "Manasthali Education Centre, U.P.",
    meta: "2020 · 60%",
  },
  {
    title: "Secondary (10th)",
    org: "Anita Memorial Convent School, U.P.",
    meta: "2018 · 66%",
  },
];

export const PROJECTS = [
  {
    num: "01",
    icon: "Users",
    title: "AI Powered Samridh CRM",
    desc: "Full-featured CRM system with AI-driven lead management and workflow automation. Generative AI APIs deliver real-time business insights, lead scoring and dashboard analytics.",
    tags: ["PHP", "MySQL", "GenAI APIs", "XAMPP"],
    repo: "https://github.com/shauryaa-tech",
    repoLabel: "View GitHub",
  },
  {
    num: "02",
    icon: "FileSearch",
    title: "AI Resume Analyzer",
    desc: "NLP-based resume evaluation tool using TF-IDF vectorization and cosine similarity to score resumes against job descriptions and generate AI-driven improvement suggestions.",
    tags: ["Python", "NLP", "TF-IDF", "Cosine Similarity"],
    repo: "https://github.com/shauryaa-tech/AI_Resume_Analyzer",
    repoLabel: "View Code",
  },
  {
    num: "03",
    icon: "MessagesSquare",
    title: "AI PDF Chatbot (RAG)",
    desc: "Document-based Q&A system using Retrieval-Augmented Generation with FAISS vector search and text embeddings — high-accuracy answers with significantly reduced hallucination.",
    tags: ["Python", "FAISS", "LangChain", "Embeddings"],
    repo: "https://github.com/shauryaa-tech",
    repoLabel: "View GitHub",
  },
  {
    num: "04",
    icon: "Mic",
    title: "Eva — AI Voice & Chat Assistant",
    desc: "Real-time AI assistant with a dynamic React.js UI integrated with the Google Gemini API, supporting conversational AI interactions and voice-based responses.",
    tags: ["React.js", "Gemini API", "Voice"],
    repo: "https://github.com/shauryaa-tech/Eva-Assistant",
    repoLabel: "View Code",
  },
];

export const ACHIEVEMENTS = [
  {
    icon: "Trophy",
    title: "Winner — Code Crasher",
    org: "National Level Tech Fest",
    meta: "1st Place",
    gold: true,
  },
  {
    icon: "Medal",
    title: "2nd Place — Brain Buster",
    org: "National Level Tech Fest",
    meta: "Runner-up",
  },
  {
    icon: "Award",
    title: "Java Programming Fundamentals",
    org: "Infosys Certification",
    meta: "Certified",
  },
  {
    icon: "BadgeCheck",
    title: "Code Unnati Program",
    org: "SAP & Edunet Foundation",
    meta: "Certified",
  },
];
