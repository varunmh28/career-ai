import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get key skills, trends, and market insights for a given job role or tech domain.",
  inputSchema: z.object({
    role: z.string().describe("The job title or domain (e.g. 'AI Engineer', 'Fullstack Developer')"),
  }),
  async execute({ role }) {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("ai") || roleLower.includes("machine learning")) {
      return {
        role,
        demand: "Very High",
        topSkills: [
          "Python",
          "PyTorch",
          "LLM APIs & Prompt Engineering",
          "Vector Databases",
          "Agent Frameworks (Eve, LangGraph)",
        ],
        trendingFocus:
          "Building durable production-grade autonomous agent workflows, evaluations, and RAG pipelines.",
      };
    }
    return {
      role,
      demand: "High",
      topSkills: [
        "TypeScript",
        "Next.js",
        "Cloud Deployment (Vercel/AWS)",
        "API Design",
        "Database Architecture",
      ],
      trendingFocus:
        "Modern fullstack development, AI-assisted feature engineering, and robust backend integrations.",
    };
  },
});
