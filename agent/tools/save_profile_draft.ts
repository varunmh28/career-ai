import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";

export default defineTool({
  description:
    "Saves an approved profile rewrite draft to Convex. REQUIRES USER APPROVAL before persisting.",
  approval: always(),
  inputSchema: z.object({
    headline: z.string().describe("Optimized profile headline."),
    about: z.string().describe("Optimized about section."),
    skillsToAdd: z.array(z.string()).describe("New technical skills to add."),
    bulletPoints: z.array(z.string()).describe("Optimized experience bullet points."),
    userId: z.string().optional().describe("Candidate user ID."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const draftId = await convexClient.mutation(api.profiles.saveProfileDraft, {
      userId: targetUserId,
      headline: input.headline,
      about: input.about,
      skillsToAdd: input.skillsToAdd,
      bulletPoints: input.bulletPoints,
    });

    return {
      success: true,
      draftId,
      message: "Profile draft successfully saved with your explicit approval.",
      appliedDetails: {
        headline: input.headline,
        newSkillsCount: input.skillsToAdd.length,
      },
    };
  },
});
