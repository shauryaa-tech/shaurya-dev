export const SITE_ORIGIN = "https://shaurya-dev.onrender.com";

const HOME_DESCRIPTION =
  "Shaurya Pratap Singh is an AI/ML and software engineer in Vapi, Gujarat. Portfolio of Generative AI, RAG chatbots, NLP, React, and production automation.";

export function pageSeo(pathname, profile) {
  const name = profile?.name || "Shaurya Pratap Singh";
  const role = profile?.role || "AI/ML Engineer & Software Engineer";
  const location = profile?.location || "Vapi, Gujarat, India";
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";

  if (path.startsWith("/admin") || path.startsWith("/login")) {
    return {
      title: path.startsWith("/admin") ? `${name} · Admin` : `${name} · Sign in`,
      description: "Private page.",
      robots: "noindex, nofollow",
      url: `${SITE_ORIGIN}${path}`,
    };
  }

  if (path === "/contact") {
    return {
      title: `Contact ${name} | ${role}`,
      description: `Contact ${name}, ${role} in ${location}. Email, phone, LinkedIn, and GitHub for AI/ML and software engineering roles.`,
      robots: "index, follow",
      url: `${SITE_ORIGIN}/contact`,
    };
  }

  return {
    title: `${name} | AI/ML Engineer & Software Engineer`,
    description: HOME_DESCRIPTION,
    robots: "index, follow, max-image-preview:large",
    url: `${SITE_ORIGIN}/`,
  };
}
