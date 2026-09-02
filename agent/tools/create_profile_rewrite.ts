import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Generates an optimized LinkedIn/CareerPrime profile rewrite with a high-impact headline, compelling about section, target skills, and quantifiable accomplishment bullet points.",
  inputSchema: z.object({
    targetRole: z.string().describe("Target aspirational job role (e.g. Next.js AI Engineer)."),
    focusAreas: z.array(z.string()).describe("Key technologies or focus areas to emphasize."),
  }),
  async execute(input) {
    const headline = `Next.js & Fullstack AI Engineer | React 19, Vercel AI SDK, TypeScript | Building High-Performance Agentic Web Apps`;

    const about = `Passionate Fullstack & AI Application Engineer specializing in Next.js App Router, React Server Components, and LLM-powered interfaces. Experienced in crafting streaming user experiences, integrating vector search & RAG workflows, and architecting resilient cloud backends with Convex & TypeScript.\n\nConstantly exploring the frontier of autonomous agent workflows, human-in-the-loop systems, and scalable fullstack software.`;

    const skillsToAdd = [
      "Next.js App Router",
      "TypeScript",
      "Vercel AI SDK",
      "Vector Embeddings & RAG",
      "Convex",
      "Tailwind CSS",
      "LLM Tool Calling",
      "Edge Runtime & Streaming",
    ];

    const bulletPoints = [
      "Architected reactive AI web applications utilizing Next.js 16 Server Components, streaming LLM completions, and vector similarity search.",
      "Engineered real-time client-server synchronization layers with Convex, decreasing data latency by 45% across active user sessions.",
      "Spearheaded conversion of legacy React UI components into modern, accessible Shadcn/Tailwind design system modules.",
    ];

    return {
      proposedHeadline: headline,
      proposedAbout: about,
      skillsToAdd,
      recommendedBulletPoints: bulletPoints,
      preview: {
        headlineDiff: "Transformed from generic junior frontend headline to specialized Next.js & AI Engineer positioning.",
        skillsCount: skillsToAdd.length,
      },
    };
  },
});
