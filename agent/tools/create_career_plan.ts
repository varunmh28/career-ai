import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Generates a 90-day transition roadmap with weekly milestones, learning tracks, project deliverables, and interview preparation steps to become a Senior Next.js AI Engineer.",
  inputSchema: z.object({
    targetRole: z
      .string()
      .default("Next.js AI Engineer")
      .describe("Target career title."),
    currentLevel: z
      .string()
      .default("Frontend Developer")
      .describe("Current experience level."),
  }),
  async execute(input) {
    const milestones = [
      {
        week: "Weeks 1-3",
        title: "Mastering Next.js 16 App Router & Server Actions",
        tasks: [
          "Deep dive into React 19 Server Components, streaming SSR, and useActionState.",
          "Build fullstack CRUD workflows with Server Actions and optimistic updates.",
          "Implement route handlers and edge middleware with cookie authentication.",
        ],
      },
      {
        week: "Weeks 4-6",
        title: "Vercel AI SDK, Streaming LLM UI & Structured Outputs",
        tasks: [
          "Implement streaming text, reasoning parts, and dynamic tool calls with useChat.",
          "Build multi-step agent loops and structured schema validation with Zod.",
          "Deploy an end-to-end AI artifact workbench running on edge compute.",
        ],
      },
      {
        week: "Weeks 7-9",
        title: "Vector Embeddings, RAG & Realtime Reactive Backends (Convex)",
        tasks: [
          "Generate and index 768-dimensional embeddings for semantic search.",
          "Implement cosine similarity ranking and skill gap matching algorithms.",
          "Integrate Convex reactive subscriptions for real-time multiplayer feeds.",
        ],
      },
      {
        week: "Weeks 10-12",
        title: "Portfolio Polish, Recruiter Outreach & System Design Interviews",
        tasks: [
          "Ship and open-source CareerPrime / agentic portfolio project with live demo.",
          "Conduct direct outreach to tech recruiters at Vercel, Linear, and Supabase.",
          "Practice system design interview questions on streaming AI architectures.",
        ],
      },
    ];

    return {
      targetRole: input.targetRole,
      timeline: "90 Days (12 Weeks)",
      summary: `A structured, high-intensity transition plan taking you from ${input.currentLevel} to ${input.targetRole} with concrete proof-of-work deliverables.`,
      milestones,
    };
  },
});
