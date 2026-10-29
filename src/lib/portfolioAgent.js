export {
  AGENT_PROMPTS,
  buildPortfolioBrief,
  answerFromPortfolio,
} from "../../server/portfolio-agent.js";

import { answerFromPortfolio } from "../../server/portfolio-agent.js";

export async function askPortfolioAgent(site, question) {
  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: String(question || "").slice(0, 500) }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data?.answer) return { answer: data.answer, source: data.source || "live" };
    }
  } catch {
    // local fallback
  }
  return { answer: answerFromPortfolio(site, question), source: "local" };
}
