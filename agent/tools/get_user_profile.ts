import { defineTool } from "eve/tools";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";

export default defineTool({
  description:
    "Fetches the candidate's active profile, headline, about section, experiences, and skills from Convex.",
  inputSchema: z.object({
    userId: z
      .string()
      .optional()
      .describe("User ID to fetch. If omitted, uses active user or demo_alex_carter."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const profile = await convexClient.query(api.profiles.getCurrentUserProfile, {
      userId: targetUserId,
    });

    if (!profile) {
      return {
        error: `No candidate profile found for ${targetUserId}`,
      };
    }

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      headline: profile.headline,
      about: profile.about,
      location: profile.location,
      targetRole: profile.targetRole,
      skills: profile.skills.map((s) => s.name),
      experiences: profile.experiences.map((e) => ({
        company: e.company,
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
        description: e.description,
        skills: e.skills,
      })),
      completenessScore: profile.completenessScore,
    };
  },
});
