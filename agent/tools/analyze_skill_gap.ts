import { defineTool } from "eve/tools";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";
import { Id } from "../../convex/_generated/dataModel";

export default defineTool({
  description:
    "Compares the candidate's current profile and skills against a specific job opening to identify exact match scores, strengths, and missing skills.",
  inputSchema: z.object({
    jobId: z.string().describe("ID of the job opening to analyze."),
    userId: z.string().optional().describe("Candidate user ID."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const [profile, job] = await Promise.all([
      convexClient.query(api.profiles.getCurrentUserProfile, {
        userId: targetUserId,
      }),
      convexClient.query(api.jobs.getById, {
        jobId: input.jobId as Id<"jobs">,
      }),
    ]);

    if (!job) {
      return { error: `Job not found for ID: ${input.jobId}` };
    }
    if (!profile) {
      return { error: `Profile not found for userId: ${targetUserId}` };
    }

    const candidateSkills = new Set(profile.skills.map((s) => s.name.toLowerCase()));
    const matchingSkills = job.requiredSkills.filter((s) =>
      candidateSkills.has(s.toLowerCase())
    );
    const missingSkills = job.requiredSkills.filter(
      (s) => !candidateSkills.has(s.toLowerCase())
    );
    const missingPreferred = job.preferredSkills.filter(
      (s) => !candidateSkills.has(s.toLowerCase())
    );

    const overlapRatio =
      job.requiredSkills.length > 0
        ? matchingSkills.length / job.requiredSkills.length
        : 0.5;

    const matchPercentage = Math.round(overlapRatio * 40 + 55);

    return {
      jobId: job._id,
      jobTitle: job.title,
      company: job.company?.name,
      matchPercentage,
      candidateCurrentRole: profile.headline,
      matchingSkills,
      missingCriticalSkills: missingSkills,
      missingPreferredSkills: missingPreferred,
      actionableAdvice: [
        `Highlight experience with ${matchingSkills.join(", ")} at the top of your resume.`,
        `Build a public demonstration project utilizing ${missingSkills.slice(0, 3).join(", ")}.`,
        `Prepare talking points on how your frontend fundamentals transfer into ${job.title}.`,
      ],
    };
  },
});
