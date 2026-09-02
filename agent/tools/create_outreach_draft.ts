import { defineTool } from "eve/tools";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";
import { Id } from "../../convex/_generated/dataModel";

export default defineTool({
  description:
    "Drafts a personalized, high-conversion direct outreach message to a recruiter or hiring manager for a specific job opening.",
  inputSchema: z.object({
    jobId: z.string().describe("Target job ID in Convex."),
    tone: z
      .enum(["confident", "enthusiastic", "concise", "technical"])
      .default("confident")
      .describe("Tone of the message."),
    highlightProjects: z
      .array(z.string())
      .optional()
      .describe("Specific accomplishments or projects to highlight."),
  }),
  async execute(input) {
    const job = await convexClient.query(api.jobs.getById, {
      jobId: input.jobId as Id<"jobs">,
    });

    if (!job) {
      return { error: `Job opening not found for ID: ${input.jobId}` };
    }

    const recruiterName = job.recruiter?.name ? job.recruiter.name.split(" ")[0] : "there";
    const companyName = job.company?.name || "your team";

    const subject = `Next.js & AI Application Engineer — Alex Carter / ${job.title}`;

    const body = `Hi ${recruiterName},

I saw that ${companyName} is expanding the engineering team for the ${job.title} role.

Over the past few years, I've focused on building high-performance React and Next.js applications, recently diving deep into the Vercel AI SDK, streaming LLM outputs, and vector search with Convex. 

Given ${companyName}'s focus on ${job.requirements[0] || "modern fullstack engineering"}, I’d love to share how my background in modern web performance and agentic workflows can add immediate value to the team.

Are you open to a brief 10-minute chat this week?

Best regards,
Alex Carter
alex.carter@example.com | github.com/alexcarter-dev`;

    return {
      jobId: job._id,
      jobTitle: job.title,
      company: companyName,
      recruiter: job.recruiter,
      subject,
      body,
      tone: input.tone,
      tips: [
        "Personalized to the specific recruiter and company.",
        "Emphasizes concrete Next.js + AI SDK domain skills matching the job requirements.",
        "Clear, low-friction call to action.",
      ],
    };
  },
});
