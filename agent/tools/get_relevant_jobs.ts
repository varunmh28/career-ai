import { defineTool } from "eve/tools";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";

export default defineTool({
  description:
    "Finds relevant tech job openings for the candidate using vector similarity search, returning match percentages and skill overlaps.",
  inputSchema: z.object({
    userId: z.string().optional().describe("Candidate user ID."),
    limit: z.number().optional().describe("Number of top matched jobs to return (default 5)."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const matches = await convexClient.action(api.matches.findMatchesForUser, {
      userId: targetUserId,
      limit: input.limit || 5,
    });

    return {
      candidateUserId: targetUserId,
      totalMatched: matches.length,
      topMatches: matches.map((m) => ({
        jobId: m.jobId,
        title: m.job.title,
        company: m.job.company?.name || "Tech Company",
        location: m.job.location,
        workplaceType: m.job.workplaceType,
        salaryRange: m.job.salaryRange,
        matchPercentage: m.matchPercentage,
        matchingSkills: m.matchingSkills,
        missingSkills: m.missingSkills,
        rationale: m.rationale,
        recruiter: m.job.recruiter
          ? {
              name: m.job.recruiter.name,
              title: m.job.recruiter.title,
              email: m.job.recruiter.email,
            }
          : null,
      })),
    };
  },
});
