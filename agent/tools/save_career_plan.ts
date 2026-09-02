import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";

export default defineTool({
  description:
    "Saves a generated 90-day career roadmap to Convex. REQUIRES USER APPROVAL before saving.",
  approval: always(),
  inputSchema: z.object({
    targetRole: z.string().describe("Target career title."),
    timeline: z.string().describe("Duration (e.g. 90 Days)."),
    milestones: z
      .array(
        z.object({
          week: z.string(),
          title: z.string(),
          tasks: z.array(z.string()),
        })
      )
      .describe("List of roadmap milestone phases."),
    userId: z.string().optional().describe("Candidate user ID."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const planId = await convexClient.mutation(api.careerPlan.saveCareerPlan, {
      userId: targetUserId,
      targetRole: input.targetRole,
      timeline: input.timeline,
      milestones: input.milestones,
    });

    return {
      success: true,
      planId,
      message: "90-day career plan successfully activated and saved to your dashboard.",
      targetRole: input.targetRole,
      milestonesCount: input.milestones.length,
    };
  },
});
